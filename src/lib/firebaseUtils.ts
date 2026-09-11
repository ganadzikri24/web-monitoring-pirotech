import { ref, onValue, set, get } from "firebase/database";
import { db } from "./firebase";

// Tipe data yang diharapkan dari Firebase
export interface MonitoringData {
  suhu: number;
  tekanan: number;
  status: string;
}

export interface ControlData {
  buzzer: boolean;
  relay_pemanas: boolean;
}

/**
 * Dengarkan perubahan data di node /sensor_data secara realtime (mengambil data terbaru).
 */
import { query, limitToLast } from "firebase/database";

export function listenToMonitoring(callback: (data: MonitoringData | null) => void) {
  const monitoringRef = query(ref(db, 'sensor_data'), limitToLast(1));
  
  const unsubscribe = onValue(monitoringRef, (snapshot) => {
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

  return unsubscribe;
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
