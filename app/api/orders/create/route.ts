import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/firebase-admin';
import { createOrderWithNumber } from '@/lib/server/order-number';
import type { OrderItem, Address } from '@/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatusStored = 'processing' | 'completed' | 'cancelled';

interface CreateOrderBody {
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatusStored;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address | null;
  notes?: string;
  paymentMethod: string;
}

/**
 * POST /api/orders/create
 * Creates an order in top-level "orders" collection with a unique orderNumber.
 * Returns only orderNumber (never Firestore document ID).
 * Requires Authorization: Bearer <Firebase ID token>.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { uid } = auth;

  try {
    const body = (await request.json()) as CreateOrderBody;
    const {
      totalAmount,
      paymentStatus,
      orderStatus,
      items,
      shippingAddress,
      billingAddress,
      notes,
      paymentMethod,
    } = body;

    if (typeof totalAmount !== 'number' || totalAmount < 0) {
      return NextResponse.json(
        { success: false, error: 'totalAmount is required and must be a non-negative number' },
        { status: 400 }
      );
    }

    if (!items?.length || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'items and shippingAddress are required' },
        { status: 400 }
      );
    }

    const validPaymentStatuses: PaymentStatus[] = ['pending', 'paid', 'failed'];
    const validOrderStatuses: OrderStatusStored[] = ['processing', 'completed', 'cancelled'];
    if (!validPaymentStatuses.includes(paymentStatus) || !validOrderStatuses.includes(orderStatus)) {
      return NextResponse.json(
        { success: false, error: 'Invalid paymentStatus or orderStatus' },
        { status: 400 }
      );
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKeyRaw) {
      return NextResponse.json(
        { success: false, error: 'Server misconfiguration: missing Firebase env' },
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
    const result = await createOrderWithNumber(db, {
      userId: uid,
      totalAmount,
      paymentStatus,
      orderStatus,
      items,
      shippingAddress,
      billingAddress,
      notes,
      paymentMethod: paymentMethod ?? 'card',
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, orderNumber: result.orderNumber });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('POST /api/orders/create error:', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
