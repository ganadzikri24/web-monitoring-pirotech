import type { NextRequest } from "next/server";
import {
  getTimeRangeBoundsFromLogActivity,
  pushKeyToTimestamp,
  type LogActivityEntry,
} from "@/lib/pushIdTimeRange";

const DB_BASE_URL =
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
  "https://prikitiw-18dde-default-rtdb.asia-southeast1.firebasedatabase.app";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

interface RawSensorEntry {
  device_id: string;
  temperature_c: number;
  pressure_bar?: number;
  status: string;
  timestamp?: number; // server timestamp dari ESP32 (.sv)
}

interface DownsampledMinute {
  minuteLabel: string; // "HH:MM" dalam WIB
  relativeMinute: number; // menit ke-N dari awal sesi
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  avgPressure: number | null;
  minPressure: number | null;
  maxPressure: number | null;
  count: number;
}

interface RawRow {
  key: string;
  timestampMs: number;
  timeLabel: string; // "HH:MM:SS" dalam WIB
  temperature_c: number;
  pressure_bar: number | null;
  status: string;
  device_id: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function toWIBLabel(tsMs: number, format: "HH:MM" | "HH:MM:SS"): string {
  const d = new Date(tsMs + 7 * 3600 * 1000); // shift ke WIB (UTC+7)
  const h = d.getUTCHours().toString().padStart(2, "0");
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  if (format === "HH:MM") return `${h}:${m}`;
  const s = d.getUTCSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) / 100;
}

// ────────────────────────────────────────────────────────────────────────────
// Route Handler
// ────────────────────────────────────────────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ logId: string }> }
) {
  // 1. Baca logId dari dynamic segment
  const { logId } = await params;

  // 2. Ambil idToken dari header Authorization (jika ada)
  const authHeader = request.headers.get("Authorization");
  let idToken = "";
  if (authHeader?.startsWith("Bearer ")) {
    idToken = authHeader.slice(7);
  }

  try {
    const authQuery = idToken ? `?auth=${idToken}` : "";
    const authParam = idToken ? `&auth=${idToken}` : "";

    // 3. Fetch data log_activity entry
    const logRes = await fetch(
      `${DB_BASE_URL}/log_activity/${encodeURIComponent(logId)}.json${authQuery}`
    );

    if (!logRes.ok) {
      return Response.json(
        { error: "Failed to fetch log_activity entry", status: logRes.status },
        { status: logRes.status }
      );
    }

    const logEntry: LogActivityEntry | null = await logRes.json();
    if (!logEntry) {
      return Response.json({ error: "Log entry not found" }, { status: 404 });
    }

    // 4. Hitung push-key bounds dari tanggal + durasi
    const { startKey, endKey, startMs } =
      getTimeRangeBoundsFromLogActivity(logEntry);

    // 5. Query sensor_data dengan orderByKey + range
    const sensorUrl =
      `${DB_BASE_URL}/sensor_data.json` +
      `?orderBy="$key"` +
      `&startAt="${startKey}"` +
      `&endAt="${endKey}"` +
      authParam;

    const sensorRes = await fetch(sensorUrl);

    if (!sensorRes.ok) {
      return Response.json(
        { error: "Failed to fetch sensor_data", status: sensorRes.status },
        { status: sensorRes.status }
      );
    }

    const rawData: Record<string, RawSensorEntry> | null =
      await sensorRes.json();

    if (!rawData) {
      // Tidak ada data sensor dalam rentang ini
      return Response.json({
        session: logEntry,
        downsampled: [],
        raw: [],
        totalReadings: 0,
      });
    }

    // 6. Proses: bangun raw rows dan grup per-menit untuk downsampling
    const rawRows: RawRow[] = [];
    // Map: menit-ke-N → array nilai
    const minuteGroups = new Map<
      number,
      { temps: number[]; pressures: number[]; ts: number }
    >();

    for (const [key, entry] of Object.entries(rawData)) {
      // Decode timestamp dari push-key
      const tsMs = pushKeyToTimestamp(key);

      // Hitung menit relatif dari awal sesi
      const relMinute = Math.floor((tsMs - startMs) / 60_000);

      rawRows.push({
        key,
        timestampMs: tsMs,
        timeLabel: toWIBLabel(tsMs, "HH:MM:SS"),
        temperature_c: entry.temperature_c,
        pressure_bar: entry.pressure_bar ?? null,
        status: entry.status,
        device_id: entry.device_id,
      });

      if (!minuteGroups.has(relMinute)) {
        minuteGroups.set(relMinute, { temps: [], pressures: [], ts: tsMs });
      }
      const group = minuteGroups.get(relMinute)!;
      group.temps.push(entry.temperature_c);
      if (entry.pressure_bar !== undefined) {
        group.pressures.push(entry.pressure_bar);
      }
    }

    // Urutkan raw berdasarkan timestamp
    rawRows.sort((a, b) => a.timestampMs - b.timestampMs);

    // 7. Bangun downsampled array
    const downsampled: DownsampledMinute[] = [];
    const sortedMinutes = Array.from(minuteGroups.keys()).sort((a, b) => a - b);

    for (const relMinute of sortedMinutes) {
      const group = minuteGroups.get(relMinute)!;
      const hasPressure = group.pressures.length > 0;

      downsampled.push({
        minuteLabel: toWIBLabel(group.ts, "HH:MM"),
        relativeMinute: relMinute,
        avgTemp: avg(group.temps),
        minTemp: Math.min(...group.temps),
        maxTemp: Math.max(...group.temps),
        avgPressure: hasPressure ? avg(group.pressures) : null,
        minPressure: hasPressure ? Math.min(...group.pressures) : null,
        maxPressure: hasPressure ? Math.max(...group.pressures) : null,
        count: group.temps.length,
      });
    }

    // 8. Kembalikan response
    return Response.json({
      session: logEntry,
      downsampled,
      raw: rawRows,
      totalReadings: rawRows.length,
    });
  } catch (err) {
    console.error("[API /sessions/[logId]/data]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
