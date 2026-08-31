import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function DELETE(request: Request, props: { params: Promise<{ uid: string }> }) {
  try {
    const params = await props.params;
    const uid = params.uid;
    if (!uid) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const auth = getAdminAuth();
    const db = getAdminDb();

    // Ambil data user terlebih dahulu untuk membersihkan username mapping
    const userRecord = await auth.getUser(uid);
    const username = userRecord.customClaims?.username;

    // Hapus mapping username dari RTDB
    if (username) {
      await db.ref(`pirotech/usernames/${username}`).remove();
    }

    await auth.deleteUser(uid);

    return NextResponse.json({ message: 'Pengguna berhasil dihapus' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, props: { params: Promise<{ uid: string }> }) {
  try {
    const params = await props.params;
    const uid = params.uid;
    if (!uid) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { role, username } = body;

    const auth = getAdminAuth();
    const db = getAdminDb();

    // Ambil data user
    const userRecord = await auth.getUser(uid);
    const existingClaims = userRecord.customClaims || {};

    let newClaims = { ...existingClaims };

    if (role) {
      newClaims.role = role;
    }

    if (username !== undefined) {
      if (username && /\s/.test(username)) {
        return NextResponse.json({ error: 'Username tidak boleh mengandung spasi' }, { status: 400 });
      }

      // Validasi username unik jika ada username baru
      if (username && username.toLowerCase() !== existingClaims.username) {
        const usernameRef = db.ref(`pirotech/usernames/${username.toLowerCase()}`);
        const snap = await usernameRef.get();
        if (snap.exists()) {
          return NextResponse.json({ error: 'Username sudah digunakan oleh akun lain' }, { status: 400 });
        }
      }

      // Hapus mapping username lama jika ada
      if (existingClaims.username) {
        await db.ref(`pirotech/usernames/${existingClaims.username}`).remove();
      }

      // Simpan mapping username baru jika ada
      if (username) {
        await db.ref(`pirotech/usernames/${username.toLowerCase()}`).set(userRecord.email);
        newClaims.username = username.toLowerCase();
      } else {
        delete newClaims.username;
      }
    }

    await auth.setCustomUserClaims(uid, newClaims);

    return NextResponse.json({ message: 'Profil berhasil diperbarui', claims: newClaims });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
