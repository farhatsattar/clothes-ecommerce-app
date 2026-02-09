import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/admin/orders
 * Fetches all orders from all users using Firebase Admin SDK.
 * Uses dynamic import so firebase-admin load errors are caught and returned as JSON.
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
          error: 'Missing env: set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local then restart the dev server.',
          orders: [],
        },
        { status: 500 }
      );
    }

    const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

    const admin = await import('firebase-admin');
    const { getFirestore } = await import('firebase-admin/firestore');

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }

    const db = getFirestore(admin.app());

    // Collection group query (no orderBy to avoid requiring a composite index)
    const ordersSnap = await db.collectionGroup('orders').get();

    const allOrders: Array<{ id: string; userId: string; createdAt: Date | unknown; updatedAt: Date | unknown; [key: string]: unknown }> = [];

    ordersSnap.docs.forEach((doc) => {
      const userId = doc.ref.parent.parent?.id ?? '';
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.() ?? data.createdAt;
      const updatedAt = data.updatedAt?.toDate?.() ?? data.updatedAt;
      allOrders.push({
        id: doc.id,
        userId,
        ...data,
        createdAt,
        updatedAt,
      });
    });

    allOrders.sort((a, b) => {
      const tA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const tB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return tB - tA;
    });

    return NextResponse.json({ success: true, orders: allOrders });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Admin orders API error:', err);
    return NextResponse.json(
      { success: false, error: message, orders: [] },
      { status: 500 }
    );
  }
}
