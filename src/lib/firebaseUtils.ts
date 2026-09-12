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

const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
function decodePushId(id: string): number {
  let time = 0;
  for (let i = 0; i < 8; i++) {
    time = time * 64 + PUSH_CHARS.indexOf(id.charAt(i));
  }
  return time;
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
      callback(null);
    }, 15000);
  };

  const unsubscribe = onValue(monitoringRef, (snapshot) => {
    resetTimeout();
    if (snapshot.exists()) {
      const dataObj = snapshot.val();
      const key = Object.keys(dataObj)[0];
      
      // Deteksi instan: jika data terakhir umurnya > 15 detik, langsung buang!
      const dataTimestamp = decodePushId(key);
      if (Date.now() - dataTimestamp > 15000) {
        callback(null);
        return;
      }

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

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export async function stopFirebaseBatch(batchId: string, currentAccumulatedMs: number, fuelLiters: number, weightKg: number, type: string): Promise<boolean> {
  try {
    // 1. Update status batch yang berjalan menjadi completed
    await update(ref(db, `batches/${batchId}`), {
      status: "completed",
      endTs: Date.now(),
      accumulatedMs: currentAccumulatedMs,
      fuelLiters: fuelLiters,
    });
    
    // 2. Simpan hasil akhir ke log_activity dengan zona waktu WIB (UTC+7)
    const now = new Date();
    const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    // Format YYYY-MM-DD HH:mm:ss
    const tanggalStr = wibTime.toISOString().replace('T', ' ').substring(0, 19);
    
    // Map ID plastik ke nama (karena type menyimpan ID seperti "1", "2")
    const plasticNames: Record<string, string> = {
      "1": "PET",
      "2": "HDPE",
      "4": "LDPE",
      "5": "PP",
      "6": "PS",
      "mix": "MIX"
    };
    const jenisPlastikStr = plasticNames[type] || type.toUpperCase();
    
    const logData = {
      tanggal: tanggalStr,
      berat_kg: weightKg,
      jenis_plastik: jenisPlastikStr,
      bbm_liter: fuelLiters,
      durasi: formatDuration(currentAccumulatedMs)
    };
    
    const logRef = push(ref(db, 'log_activity'));
    await set(logRef, logData);
    
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

// ============================================
// LOGIC NOTIFICATIONS
// ============================================

export interface NotificationData {
  id?: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "critical";
  timestamp: number;
}

export async function pushNotification(title: string, message: string, type: "info" | "warning" | "success" | "critical") {
  try {
    const notifRef = push(ref(db, 'notifications'));
    await set(notifRef, {
      title,
      message,
      type,
      timestamp: Date.now()
    });
  } catch (err) {
    console.error("Error pushing notification:", err);
  }
}

export function listenToNotifications(limit: number, callback: (notifs: NotificationData[]) => void) {
  // Ambil n notifikasi terakhir
  const notifQuery = query(ref(db, 'notifications'), limitToLast(limit));
  
  const unsubscribe = onValue(notifQuery, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const parsed = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) as NotificationData[];
      // Urutkan dari yang terbaru
      parsed.sort((a, b) => b.timestamp - a.timestamp);
      callback(parsed);
    } else {
      callback([]);
    }
  });

  return unsubscribe;
}
