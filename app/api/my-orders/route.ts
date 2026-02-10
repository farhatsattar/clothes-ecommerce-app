import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/my-orders
 * Returns current user's orders from top-level "orders" collection.
 * Response includes orderNumber only (no Firestore document ID).
 */
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { uid } = auth;

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKeyRaw) {
      return NextResponse.json(
        { success: false, error: 'Server error', orders: [] },
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
    const snap = await db.collection('orders').where('userId', '==', uid).get();

    const orders = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        orderNumber: data.orderNumber,
        userId: data.userId,
        totalAmount: data.totalAmount,
        paymentStatus: data.paymentStatus,
        orderStatus: data.orderStatus,
        items: data.items,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        notes: data.notes,
        paymentMethod: data.paymentMethod,
        createdAt: data.createdAt?.toDate?.() ?? data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() ?? data.updatedAt,
      };
    });

    orders.sort((a, b) => {
      const tA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const tB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return tB - tA;
    });

    return NextResponse.json({ success: true, orders });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('GET /api/my-orders error:', err);
    return NextResponse.json({ success: false, error: message, orders: [] }, { status: 500 });
  }
}
