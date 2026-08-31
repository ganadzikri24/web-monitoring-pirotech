import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Setup Firebase Admin using Env vars
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error("Error: FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, and NEXT_PUBLIC_FIREBASE_PROJECT_ID harus diset di .env.local");
  process.exit(1);
}

initializeApp({
  credential: cert({
    projectId,
    clientEmail,
    privateKey,
  }),
});

const auth = getAuth();

async function seedAdmin() {
  const email = "pirotechsvipb@gmail.com";
  const password = "adminpassword123"; // Ganti ini nanti

  try {
    console.log(`Mencari user ${email}...`);
    let user;
    try {
      user = await auth.getUserByEmail(email);
      console.log("User sudah ada, melakukan update role...");
    } catch (e) {
      console.log("User belum ada, membuat user baru...");
      user = await auth.createUser({
        email,
        password,
        emailVerified: true,
      });
    }

    await auth.setCustomUserClaims(user.uid, { role: 'admin' });
    console.log("✅ Berhasil! User admin telah diset.");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
  } catch (error) {
    console.error("❌ Gagal membuat admin:", error);
  }
}

seedAdmin();
