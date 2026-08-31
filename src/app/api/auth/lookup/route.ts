import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

// Lookup username → email (untuk login dengan username)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username wajib diisi' }, { status: 400 });
    }

    const usernameRef = adminDb.ref(`pirotech/usernames/${username.toLowerCase()}`);
    const snap = await usernameRef.get();

    if (!snap.exists()) {
      return NextResponse.json({ error: 'Username tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ email: snap.val() });
  } catch (error: any) {
    console.error('Error looking up username:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
