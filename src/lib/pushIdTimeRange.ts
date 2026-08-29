/**
 * pushIdTimeRange.ts
 *
 * Mengonversi timestamp menjadi "batas" push-key Firebase untuk digunakan
 * dalam query orderByKey().startAt(startKey).endAt(endKey) pada sensor_data.
 *
 * Firebase push-key format:
 *  - 8 karakter pertama = timestamp (ms sejak epoch) di-encode base64url
 *  - 12 karakter berikutnya = random (untuk uniqueness)
 *
 * Kita hanya perlu encode timestamp-nya; suffix bisa dimanipulasi
 * ("0000000000000" untuk startKey, "zzzzzzzzzzzz" untuk endKey)
 * karena '0' < semua karakter random dan 'z' > semua karakter random
 * dalam alfabet push-key Firebase.
 */

const PUSH_CHARS =
  "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

/**
 * Mengonversi timestamp (ms) menjadi 8-karakter prefix push-key Firebase.
 */
function timestampToPushKeyPrefix(timestampMs: number): string {
  let now = timestampMs;
  let id = "";
  for (let i = 7; i >= 0; i--) {
    id = PUSH_CHARS[now % 64] + id;
    now = Math.floor(now / 64);
  }
  return id;
}

/**
 * Mengonversi timestamp (ms) menjadi push-key minimum yang valid
 * (digunakan sebagai startAt — semua key lebih besar dijamin tercakup).
 */
export function timestampToStartKey(timestampMs: number): string {
  return timestampToPushKeyPrefix(timestampMs) + "0000000000000";
}

/**
 * Mengonversi timestamp (ms) menjadi push-key maksimum yang valid
 * (digunakan sebagai endAt — semua key lebih kecil dijamin tercakup).
 */
export function timestampToEndKey(timestampMs: number): string {
  return timestampToPushKeyPrefix(timestampMs) + "zzzzzzzzzzzz";
}

/**
 * Mengonversi push-key Firebase kembali ke timestamp (ms).
 * Berguna untuk menampilkan waktu pada grafik.
 */
export function pushKeyToTimestamp(pushKey: string): number {
  let timestamp = 0;
  for (let i = 0; i < 8; i++) {
    timestamp = timestamp * 64 + PUSH_CHARS.indexOf(pushKey[i]);
  }
  return timestamp;
}

export interface LogActivityEntry {
  tanggal: string;  // "YYYY-MM-DD HH:MM:SS.ffffff" (WIB / UTC+7)
  durasi: string;   // "HH:MM:SS"
  jenis_plastik?: string;
  berat_kg?: number;
  bbm_liter?: number;
  residu_kg?: number;
  yield_persen?: number;
}

/**
 * Mem-parsing field tanggal dari log_activity.
 * Asumsi: waktu lokal WIB (UTC+7), dikonversi ke UTC untuk push-key.
 *
 * Format input: "YYYY-MM-DD HH:MM:SS.ffffff"
 * (microsecond di-ignore, cukup sampai detik)
 */
function parseTanggalToUTCMs(tanggal: string): number {
  // "2026-08-30 14:30:00.123456" → pisah tanggal & waktu
  const [datePart, timePart] = tanggal.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);

  // time bisa berformat "14:30:00" atau "14:30:00.123456"
  const [hStr, mStr, sStr] = timePart.split(":");
  const seconds = parseInt(sStr, 10); // buang microsecond
  const hours = parseInt(hStr, 10);
  const minutes = parseInt(mStr, 10);

  // Buat timestamp UTC: karena tanggal berasal dari WIB (UTC+7),
  // kita kurangi 7 jam untuk mendapatkan UTC.
  const utcMs = Date.UTC(year, month - 1, day, hours - 7, minutes, seconds, 0);
  return utcMs;
}

/**
 * Mem-parsing field durasi "HH:MM:SS" menjadi milidetik.
 */
function parseDurasiToMs(durasi: string): number {
  const parts = durasi.split(":").map(Number);
  const hours = parts[0] ?? 0;
  const minutes = parts[1] ?? 0;
  const seconds = parts[2] ?? 0;
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

export interface TimeRangeBounds {
  startKey: string;
  endKey: string;
  startMs: number;
  endMs: number;
}

/**
 * Fungsi utama: menghitung startKey & endKey berdasarkan
 * data satu entry log_activity.
 *
 * Tambahkan buffer ±5 detik untuk toleransi clock skew / delay jaringan ESP32.
 */
export function getTimeRangeBoundsFromLogActivity(
  entry: LogActivityEntry
): TimeRangeBounds {
  const BUFFER_MS = 5_000; // 5 detik

  const startMs = parseTanggalToUTCMs(entry.tanggal) - BUFFER_MS;
  const durasiMs = parseDurasiToMs(entry.durasi);
  const endMs = startMs + durasiMs + BUFFER_MS * 2;

  return {
    startKey: timestampToStartKey(startMs),
    endKey: timestampToEndKey(endMs),
    startMs,
    endMs,
  };
}
