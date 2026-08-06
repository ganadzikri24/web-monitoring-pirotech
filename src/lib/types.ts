export type ProcessStatus = 'IDLE' | 'HEATING' | 'PYROLYSIS' | 'COOLING';

export interface Reading {
  ts: number;
  tempC: number;
  pressureKPa?: number;
  status?: ProcessStatus;
  durationSec?: number;
}

export interface LatestSnapshot {
  current: {
    ts: number;
    tempC: number;
    status: ProcessStatus;
  };
  batchId?: string;
  startTs?: number;
}

export interface Batch {
  startTs: number;
  endTs?: number;
  wasteKg: number;
  fuelLiters?: number;
  plasticType?: string;
  avgTempC?: number;
  maxTempC?: number;
  status: 'running' | 'paused' | 'completed' | 'aborted';
  pausedAt?: number;
  accumulatedMs?: number; // Total ms of active running time (excludes paused time)
}

export interface Controls {
  buzzer: boolean;
  lastUpdatedBy: string;
}

export interface Thresholds {
  buzzer: {
    enabled: boolean;
    tempMax: number;
  };
}

export interface NotificationSettings {
  warningPercent: number;
  enableFCM: boolean;
  enableEmail: boolean;
}
