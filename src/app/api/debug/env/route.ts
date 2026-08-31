import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const envCheck = {
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ SET' : '❌ MISSING',
    NEXT_PUBLIC_FIREBASE_DATABASE_URL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ? '✅ SET' : '❌ MISSING',
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? '✅ SET' : '❌ MISSING',
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY
      ? `✅ SET (${process.env.FIREBASE_PRIVATE_KEY.length} chars, starts with: ${process.env.FIREBASE_PRIVATE_KEY.substring(0, 30)}...)`
      : '❌ MISSING',
  };

  // Try to actually initialize Firebase Admin
  let adminTest = 'not tested';
  try {
    const { getAdminAuth } = await import('@/lib/firebaseAdmin');
    const auth = getAdminAuth();
    const list = await auth.listUsers(1);
    adminTest = `✅ SUCCESS - found ${list.users.length} user(s)`;
  } catch (error: any) {
    adminTest = `❌ FAILED: ${error.code || ''} ${error.message}`;
  }

  return NextResponse.json({
    envCheck,
    adminTest,
    nodeEnv: process.env.NODE_ENV,
  }, { status: 200 });
}
