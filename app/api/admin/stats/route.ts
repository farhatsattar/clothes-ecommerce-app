import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export interface AdminStats {
  totalProducts: number;
  ordersToday: number;
  totalOrders: number;
  revenueToday: number;
}

/**
 * GET /api/admin/stats
 * Returns dashboard quick stats from Firestore (products count, orders today, total orders, revenue today).
 */
export async function GET() {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKeyRaw) {
      return NextResponse.json(
        { success: false, error: 'Missing Firebase env configuration', stats: null },
        { status: 500 }
      );
    }

    const admin = await import('firebase-admin');
    const { getFirestore, Timestamp } = await import('firebase-admin/firestore');

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

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const startTimestamp = Timestamp.fromDate(startOfDay);
    const endTimestamp = Timestamp.fromDate(endOfDay);

    const [productsSnap, allOrdersSnap, ordersTodaySnap] = await Promise.all([
      db.collection('products').count().get(),
      db.collection('orders').get(),
      db
        .collection('orders')
        .where('createdAt', '>=', startTimestamp)
        .where('createdAt', '<=', endTimestamp)
        .get(),
    ]);

    const totalProducts = productsSnap.data().count ?? 0;
    const totalOrders = allOrdersSnap.size;
    const ordersToday = ordersTodaySnap.size;

    let revenueToday = 0;
    ordersTodaySnap.docs.forEach((doc) => {
      const totalAmount = doc.data().totalAmount;
      if (typeof totalAmount === 'number') revenueToday += totalAmount;
    });

    const stats: AdminStats = {
      totalProducts,
      ordersToday,
      totalOrders,
      revenueToday,
    };

    return NextResponse.json({ success: true, stats });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('GET /api/admin/stats error:', err);
    return NextResponse.json(
      { success: false, error: message, stats: null },
      { status: 500 }
    );
  }
}
