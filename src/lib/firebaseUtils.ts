import { ref, onValue, set, update, push, query, limitToLast, get, orderByChild, equalTo } from "firebase/database";
import { db } from "./firebase";
import type { Batch } from "./types";

// Tipe data yang diharapkan dari Firebase
export interface MonitoringData {
  suhu: number;
  tekanan: number;
  status: string;
}

export interface ConfigData {
  overheat_limit: number;
  warning_percent: number;
  push_enabled?: boolean;
}

/**
 * Dengarkan perubahan data di node /sensor_data secara realtime (mengambil data terbaru).
 * Akan memicu status "null" (Kosong/Mati) jika tidak ada data baru selama > 15 detik.
 */
export function listenToMonitoring(callback: (data: MonitoringData | null) => void) {
  const monitoringRef = query(ref(db, 'sensor_data'), limitToLast(1));
  
  let timeoutId: NodeJS.Timeout;

  const resetTimeout = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      // Timeout 15 detik, anggap ESP32 mati/terputus
      callback(null);
    }, 15000);
  };

  const unsubscribe = onValue(monitoringRef, (snapshot) => {
    resetTimeout();
    if (snapshot.exists()) {
      const dataObj = snapshot.val();
      const key = Object.keys(dataObj)[0];
      const data = dataObj[key];

      const mappedData: MonitoringData = {
        suhu: data.temperature_c || 0,
        tekanan: data.pressure_bar || 0,
        status: data.status || 'IDLE'
      };

      callback(mappedData);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Error listening to monitoring:", error);
    callback(null);
  });

  return () => {
    unsubscribe();
    if (timeoutId) clearTimeout(timeoutId);
  };
}

/**
 * Dengarkan perubahan data spesifik di node /config
 */
export function listenToConfig(callback: (data: ConfigData | null) => void) {
  const configRef = ref(db, 'config');
  const unsubscribe = onValue(configRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as ConfigData);
    } else {
      // Default jika belum ada config di DB
      callback({ overheat_limit: 50, warning_percent: 90 });
    }
  }, (error) => {
    console.error("Error listening to config:", error);
    callback(null);
  });

  return unsubscribe;
}

export async function updateConfig(updates: Partial<ConfigData>) {
  try {
    await update(ref(db, 'config'), updates);
    return true;
  } catch (error) {
    console.error("Error updating config:", error);
    return false;
  }
}

/**
 * Dengarkan perubahan data spesifik di node /control/buzzer.
 */
export function listenToBuzzer(callback: (isOn: boolean) => void) {
  const buzzerRef = ref(db, 'control/buzzer');
  
  const unsubscribe = onValue(buzzerRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(!!snapshot.val());
    } else {
      callback(false);
    }
  }, (error) => {
    console.error("Error listening to buzzer:", error);
    callback(false);
  });

  return unsubscribe;
}

/**
 * Ubah status buzzer di Firebase
 */
export async function setBuzzerState(isOn: boolean) {
  const buzzerRef = ref(db, 'control/buzzer');
  try {
    await set(buzzerRef, isOn);
    return true;
  } catch (error) {
    console.error("Error setting buzzer state:", error);
    return false;
  }
}

// ============================================
// LOGIC BATCH (LOG AKTIVITAS) DI FIREBASE
// ============================================

export async function getRunningFirebaseBatch(): Promise<(Batch & { id: string }) | null> {
  const batchesRef = query(ref(db, 'batches'), orderByChild('status'), equalTo('running'));
  const snap1 = await get(batchesRef);
  if (snap1.exists()) {
    const val = snap1.val();
    const id = Object.keys(val)[0];
    return { ...val[id], id };
  }
  
  const pausedRef = query(ref(db, 'batches'), orderByChild('status'), equalTo('paused'));
  const snap2 = await get(pausedRef);
  if (snap2.exists()) {
    const val = snap2.val();
    const id = Object.keys(val)[0];
    return { ...val[id], id };
  }
  return null;
}

export async function startFirebaseBatch(weight: number, type: string, userId: string): Promise<Batch & { id: string }> {
  const newBatch: Batch = {
    startTs: Date.now(),
    wasteKg: weight,
    plasticType: type,
    status: "running",
    accumulatedMs: 0,
  };
  
  const batchesRef = ref(db, 'batches');
  const newRef = push(batchesRef);
  await set(newRef, newBatch);
  
  return { ...newBatch, id: newRef.key! };
}

export async function pauseFirebaseBatch(batchId: string, currentAccumulatedMs: number): Promise<boolean> {
  try {
    await update(ref(db, `batches/${batchId}`), {
      status: "paused",
      pausedAt: Date.now(),
      accumulatedMs: currentAccumulatedMs,
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function resumeFirebaseBatch(batchId: string): Promise<boolean> {
  try {
    await update(ref(db, `batches/${batchId}`), {
      status: "running",
      startTs: Date.now(), 
      pausedAt: null,
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function stopFirebaseBatch(batchId: string, currentAccumulatedMs: number, fuelLiters: number): Promise<boolean> {
  try {
    await update(ref(db, `batches/${batchId}`), {
      status: "completed",
      endTs: Date.now(),
      accumulatedMs: currentAccumulatedMs,
      fuelLiters: fuelLiters,
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
