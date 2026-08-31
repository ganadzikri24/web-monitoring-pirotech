import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';

function initAdminApp() {
  if (!getApps().length) {
    try {
      initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      });
    } catch (error) {
      console.error('Firebase admin initialization error', error);
    }
  }
}

export const adminAuth = new Proxy({} as ReturnType<typeof getAuth>, {
  get(target, prop) {
    initAdminApp();
    const auth = getAuth();
    const value = (auth as any)[prop];
    return typeof value === 'function' ? value.bind(auth) : value;
  }
});

export const adminDb = new Proxy({} as ReturnType<typeof getDatabase>, {
  get(target, prop) {
    initAdminApp();
    const db = getDatabase();
    const value = (db as any)[prop];
    return typeof value === 'function' ? value.bind(db) : value;
  }
});
