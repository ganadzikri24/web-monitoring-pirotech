import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getDatabase, type Database } from 'firebase-admin/database';

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^"|"$/g, '')
        : undefined,
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function getAdminDb(): Database {
  return getDatabase(getAdminApp());
}

// Backward-compat aliases (digunakan oleh route yang sudah ada)
export const adminAuth = new Proxy({} as Auth, {
  get(_, prop) {
    const auth = getAdminAuth();
    const val = (auth as any)[prop];
    return typeof val === 'function' ? val.bind(auth) : val;
  },
});

export const adminDb = new Proxy({} as Database, {
  get(_, prop) {
    const db = getAdminDb();
    const val = (db as any)[prop];
    return typeof val === 'function' ? val.bind(db) : val;
  },
});
