/**
 * Server-only Firebase Admin helpers for API route protection.
 * Verify ID token and optionally check role from custom claims or Firestore.
 */

import { NextRequest, NextResponse } from 'next/server';

export type AuthResult = { uid: string; isAdmin: boolean };

function getAdminApp(): Promise<{ admin: typeof import('firebase-admin'); app: import('firebase-admin').app.App }> {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error('Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY');
  }

  return (async () => {
    const admin = await import('firebase-admin');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKeyRaw.replace(/\\n/g, '\n'),
        }),
      });
    }
    return { admin, app: admin.app() };
  })();
}

/** Verifies Firebase ID token and returns uid + isAdmin (from custom claims). */
export async function verifyIdToken(idToken: string): Promise<AuthResult> {
  const { admin } = await getAdminApp();
  const decoded = await admin.auth().verifyIdToken(idToken);
  const isAdmin = decoded.claims?.admin === true;
  return { uid: decoded.uid, isAdmin };
}

/** Optionally resolve admin role from Firestore users collection (fallback). */
export async function getRoleFromFirestore(uid: string): Promise<'admin' | 'user' | null> {
  const { admin } = await getAdminApp();
  const db = admin.firestore();
  const userSnap = await db.collection('users').doc(uid).get();
  const role = userSnap.data()?.role as string | undefined;
  if (role === 'admin') return 'admin';
  if (role === 'user') return 'user';
  return null;
}

/**
 * Use in admin-only API routes. Returns auth payload or a 401/403 NextResponse.
 * - 401 if no/invalid token
 * - 403 if valid user but not admin (custom claim; optional Firestore fallback)
 */
export async function requireAdminAuth(
  request: NextRequest
): Promise<{ uid: string; isAdmin: true } | NextResponse> {
  const authHeader = request.headers.get('authorization');
  const idToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!idToken) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { uid, isAdmin } = await verifyIdToken(idToken);
    if (isAdmin) return { uid, isAdmin: true as const };

    const role = await getRoleFromFirestore(uid);
    if (role === 'admin') return { uid, isAdmin: true as const };

    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  } catch {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
}

/**
 * Use in user-only (authenticated) API routes. Returns uid or 401 NextResponse.
 */
export async function requireAuth(request: NextRequest): Promise<{ uid: string } | NextResponse> {
  const authHeader = request.headers.get('authorization');
  const idToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!idToken) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { uid } = await verifyIdToken(idToken);
    return { uid };
  } catch {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
}
