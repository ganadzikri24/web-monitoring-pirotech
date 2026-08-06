import { db } from "./firebase";
import { ref, onValue, set, push, update } from "firebase/database";
import type { Controls, Thresholds } from "./types";

export const subscribeToLatest = (callback: (data: unknown) => void) => {
  const latestRef = ref(db, 'pirotech/latest');
  return onValue(latestRef, (snapshot) => {
    callback(snapshot.val());
  });
};

export const updateControls = async (controls: Partial<Controls>, uid: string) => {
  const controlsRef = ref(db, 'pirotech/controls');
  await update(controlsRef, {
    ...controls,
    lastUpdatedBy: uid
  });
  
  // Log action
  const logRef = push(ref(db, 'pirotech/controlLog'));
  await set(logRef, {
    ts: Date.now(),
    uid,
    action: 'update_controls',
    details: controls
  });
};

export const updateThresholds = async (thresholds: Partial<Thresholds>) => {
  const thresholdsRef = ref(db, 'pirotech/thresholds');
  await update(thresholdsRef, thresholds);
};
