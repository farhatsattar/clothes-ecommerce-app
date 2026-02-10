import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/my-orders/[orderNumber]
 * Returns a single order for the current user by orderNumber.
 * Does not return Firestore document ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { uid } = auth;

  const { orderNumber } = await params;
  if (!orderNumber) {
    return NextResponse.json({ success: false, error: 'Missing order number' }, { status: 400 });
  }

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKeyRaw) {
      return NextResponse.json(
        { success: false, error: 'Server error' },
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

    const doc = snap.docs.find((d) => d.data().orderNumber === orderNumber);
    if (!doc) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const data = doc.data();
    const order = {
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

    return NextResponse.json({ success: true, order });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('GET /api/my-orders/[orderNumber] error:', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
