import { db } from "./firebase";
import { ref, push, set } from "firebase/database";

export const sendCommand = async (uid: string, target: string, action: string, value: string | boolean | number) => {
  const commandsRef = ref(db, 'pirotech/commands');
  const newCommandRef = push(commandsRef);
  
  await set(newCommandRef, {
    ts: Date.now(),
    uid,
    target,
    action,
    value,
    status: 'pending' // pending, executed, failed
  });
};

export const toggleActuator = async (uid: string, actuator: 'heater' | 'valve' | 'fan', state: boolean) => {
  await sendCommand(uid, actuator, state ? 'ON' : 'OFF', state);
};

export const toggleBuzzer = async (uid: string, state: boolean) => {
  await sendCommand(uid, 'buzzer', state ? 'ON' : 'OFF', state);
};
