import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export async function DELETE(request: Request, { params }: { params: { uid: string } }) {
  try {
    const uid = params.uid;
    if (!uid) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Ambil data user terlebih dahulu untuk membersihkan username mapping
    const userRecord = await adminAuth.getUser(uid);
    const username = userRecord.customClaims?.username;

    // Hapus mapping username dari RTDB
    if (username) {
      await adminDb.ref(`pirotech/usernames/${username}`).remove();
    }

    await adminAuth.deleteUser(uid);

    return NextResponse.json({ message: 'Pengguna berhasil dihapus' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
