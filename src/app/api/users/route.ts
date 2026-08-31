import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const listUsersResult = await adminAuth.listUsers(1000);
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || '',
      role: userRecord.customClaims?.role || 'operator',
      username: userRecord.customClaims?.username || '',
      creationTime: userRecord.metadata.creationTime,
      lastSignInTime: userRecord.metadata.lastSignInTime,
    }));
    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error listing users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role, username } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
    }

    // Validasi username tidak boleh mengandung spasi
    if (username && /\s/.test(username)) {
      return NextResponse.json({ error: 'Username tidak boleh mengandung spasi' }, { status: 400 });
    }

    // Validasi username unik jika disediakan
    if (username) {
      const usernameRef = adminDb.ref(`pirotech/usernames/${username.toLowerCase()}`);
      const snap = await usernameRef.get();
      if (snap.exists()) {
        return NextResponse.json({ error: 'Username sudah digunakan oleh akun lain' }, { status: 400 });
      }
    }

    const userRecord = await adminAuth.createUser({
      email,
      password,
    });

    const claims: Record<string, string> = { role: role || 'operator' };
    if (username) {
      claims.username = username.toLowerCase();
    }
    await adminAuth.setCustomUserClaims(userRecord.uid, claims);

    // Simpan mapping username → email di Realtime Database
    if (username) {
      await adminDb.ref(`pirotech/usernames/${username.toLowerCase()}`).set(email);
    }

    return NextResponse.json({
      message: 'Akun berhasil dibuat!',
      uid: userRecord.uid,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
