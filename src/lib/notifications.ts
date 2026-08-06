import { db } from "./firebase";
import { ref, push, set } from "firebase/database";

export const logNotification = async (type: 'warning' | 'critical', message: string) => {
  const notificationsRef = ref(db, 'pirotech/notifications/history');
  const newNotifRef = push(notificationsRef);
  
  await set(newNotifRef, {
    ts: Date.now(),
    type,
    message,
    acknowledged: false
  });
};
