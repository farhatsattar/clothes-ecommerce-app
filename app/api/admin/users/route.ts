import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/admin/users
 * Fetches users from Firestore (users collection) and merges with Firebase Auth for email/uid.
 * Requires Firebase Admin env vars.
 */
export async function GET() {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKeyRaw) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing env: set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local.',
          users: [],
        },
        { status: 500 }
      );
    }

    const admin = await import('firebase-admin');
    const { getFirestore } = await import('firebase-admin/firestore');

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKeyRaw.replace(/\\n/g, '\n'),
        }),
      });
    }

    const db = getFirestore(admin.app());
    const auth = admin.auth();

    const usersSnap = await db.collection('users').get();
    const listResult = await auth.listUsers(1000);
    const authUsers = listResult.users;
    const profileByUid = new Map(usersSnap.docs.map((d) => [d.id, d.data()]));

    const users: Array<{
      id: string;
      email: string;
      displayName: string;
      phoneNumber?: string;
      addresses?: unknown[];
      createdAt: Date;
      updatedAt: Date;
      isActive: boolean;
    }> = [];

    for (const authUser of authUsers) {
      const data = profileByUid.get(authUser.uid) ?? {};
      const createdAt = data.createdAt?.toDate?.() ?? (authUser.metadata.creationTime ? new Date(authUser.metadata.creationTime) : new Date());
      const updatedAt = data.updatedAt?.toDate?.() ?? (authUser.metadata.lastSignInTime ? new Date(authUser.metadata.lastSignInTime) : createdAt);

      users.push({
        id: authUser.uid,
        email: authUser.email ?? '',
        displayName: data.displayName ?? authUser.displayName ?? authUser.email ?? '—',
        phoneNumber: data.phoneNumber ?? authUser.phoneNumber ?? undefined,
        addresses: data.addresses,
        createdAt,
        updatedAt,
        isActive: data.isActive !== false,
      });
    }

    users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({ success: true, users });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Admin users API error:', err);
    return NextResponse.json(
      { success: false, error: message, users: [] },
      { status: 500 }
    );
  }
}
