import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/admin/orders/[id]
 * Fetches a single order by Firestore document ID (admin only).
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing order id' }, { status: 400 });
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKeyRaw) {
      return NextResponse.json(
        { success: false, error: 'Missing Firebase env configuration' },
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
    const docRef = db.collection('orders').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const data = docSnap.data()!;
    const order = {
      id: docSnap.id,
      orderNumber: data.orderNumber ?? '—',
      userId: data.userId ?? '',
      totalAmount: data.totalAmount ?? 0,
      paymentStatus: data.paymentStatus ?? 'pending',
      orderStatus: data.orderStatus ?? 'processing',
      items: data.items ?? [],
      shippingAddress: data.shippingAddress ?? {},
      billingAddress: data.billingAddress ?? null,
      notes: data.notes ?? '',
      paymentMethod: data.paymentMethod ?? '',
      createdAt: data.createdAt?.toDate?.() ?? data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() ?? data.updatedAt,
    };

    return NextResponse.json({ success: true, order });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('GET /api/admin/orders/[id] error:', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
