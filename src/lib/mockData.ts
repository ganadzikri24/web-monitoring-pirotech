import { LatestSnapshot, Controls, Thresholds, Batch } from "./types";
import { calculateEstimatedYield } from "./calculations";

// Simpan data batch di memory (sementara selama session aktif)
let mockBatches: Batch[] = [
  {
    startTs: Date.now() - 86400000 * 3, // 3 days ago
    endTs: Date.now() - 86400000 * 3 + 7200000,
    wasteKg: 20,
    fuelLiters: 9.5,
    plasticType: "4",
    avgTempC: 380,
    maxTempC: 410,
    status: "completed",
    accumulatedMs: 7200000,
  },
  {
    startTs: Date.now() - 86400000 * 1, // 1 day ago
    endTs: Date.now() - 86400000 * 1 + 8000000,
    wasteKg: 15,
    fuelLiters: 6.8,
    plasticType: "mix",
    avgTempC: 390,
    maxTempC: 420,
    status: "completed",
    accumulatedMs: 8000000,
  }
];

export const getBatches = async () => {
  return [...mockBatches].sort((a, b) => b.startTs - a.startTs);
};

export const getRunningBatch = async (): Promise<Batch | null> => {
  return mockBatches.find(b => b.status === "running" || b.status === "paused") || null;
};

export const startNewBatch = async (weight: number, type: string, userId: string): Promise<Batch> => {
  const newBatch: Batch = {
    startTs: Date.now(),
    wasteKg: weight,
    plasticType: type,
    status: "running",
    accumulatedMs: 0,
  };
  mockBatches.push(newBatch);
  return newBatch;
};

export const pauseBatch = async (): Promise<Batch | null> => {
  const idx = mockBatches.findIndex(b => b.status === "running");
  if (idx !== -1) {
    const batch = mockBatches[idx];
    const now = Date.now();
    // Accumulate the time since startTs (or since last resume)
    const runningMs = now - batch.startTs;
    batch.accumulatedMs = (batch.accumulatedMs || 0) + runningMs;
    batch.pausedAt = now;
    batch.status = "paused";
    return { ...batch };
  }
  return null;
};

export const resumeBatch = async (): Promise<Batch | null> => {
  const idx = mockBatches.findIndex(b => b.status === "paused");
  if (idx !== -1) {
    const batch = mockBatches[idx];
    // Reset startTs to now so the timer counts from this moment
    batch.startTs = Date.now();
    batch.pausedAt = undefined;
    batch.status = "running";
    return { ...batch };
  }
  return null;
};

export const stopBatch = async (): Promise<Batch | null> => {
  const idx = mockBatches.findIndex(b => b.status === "running" || b.status === "paused");
  if (idx !== -1) {
    const batch = mockBatches[idx];
    const now = Date.now();

    if (batch.status === "running") {
      // Add current running segment
      batch.accumulatedMs = (batch.accumulatedMs || 0) + (now - batch.startTs);
    }
    // If paused, accumulatedMs is already up to date

    batch.endTs = now;
    batch.status = "completed";
    batch.pausedAt = undefined;

    // Simulate calculated results
    const { fuelLiters } = calculateEstimatedYield(batch.wasteKg, batch.plasticType || "mix");
    batch.fuelLiters = fuelLiters;
    batch.avgTempC = 385;
    batch.maxTempC = 415;

    return { ...batch };
  }
  return null;
};

export const completeBatch = stopBatch; // Alias

export const mockLatestSnapshot: LatestSnapshot = {
  current: {
    ts: Date.now(),
    tempC: 325.0,
    status: 'HEATING',
  },
  batchId: "batch_mock_running",
  startTs: Date.now() - 1800000,
};

export const mockChartData = [
  { time: '10:00', temp: 200 },
  { time: '10:05', temp: 250 },
  { time: '10:10', temp: 300 },
  { time: '10:15', temp: 320 },
  { time: '10:20', temp: 325 },
];

export const mockControls: Controls = {
  buzzer: false,
  lastUpdatedBy: "mock_admin",
};

export const mockThresholds: Thresholds = {
  buzzer: {
    enabled: true,
    tempMax: 400,
  }
};
