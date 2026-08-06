import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const isMock = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

let app: any, db: any, auth: any;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Selalu inisialisasi App dan Database (agar RTDB selalu jalan)
app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
db = getDatabase(app);

if (!isMock) {
  auth = getAuth(app);
} else {
  auth = {
    onIdTokenChanged: (callback: any) => {
      // simulate no user logged in from Firebase's perspective, 
      // since our mock auth uses localStorage instead
      callback(null); 
      return () => {}; // mock unsubscribe
    }
  };
}

export { app, db, auth };
