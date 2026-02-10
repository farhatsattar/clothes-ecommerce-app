import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/firebase-admin';
import { createPaymentIntent } from '@/lib/services/stripe';
import { createOrderWithNumber } from '@/lib/server/order-number';
import type { OrderItem, Address } from '@/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Order payload for creating a pending order (no sensitive data). */
export interface CreatePaymentIntentBody {
  amount: number;
  receipt_email?: string;
  order: {
    items: OrderItem[];
    shippingAddress: Address;
    billingAddress?: Address | null;
    notes?: string;
    totalAmount: number;
  };
}

/**
 * POST /api/create-payment-intent
 * Creates a Stripe PaymentIntent and optionally a Firestore order with status "pending".
 * Requires Authorization: Bearer <Firebase ID token>.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { uid } = auth;

  try {
    const body = (await request.json()) as CreatePaymentIntentBody;
    const { amount, receipt_email, order: orderPayload } = body;

    if (amount == null || typeof amount !== 'number' || amount < 50) {
      return NextResponse.json(
        { success: false, error: 'amount is required, must be a number, and at least 50 cents' },
        { status: 400 }
      );
    }

    if (!orderPayload?.items?.length || !orderPayload?.shippingAddress || orderPayload?.totalAmount !== amount) {
      return NextResponse.json(
        { success: false, error: 'order must include items, shippingAddress, and totalAmount equal to amount' },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(amount);

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
    const orderResult = await createOrderWithNumber(db, {
      userId: uid,
      totalAmount: orderPayload.totalAmount,
      paymentStatus: 'pending',
      orderStatus: 'processing',
      items: orderPayload.items,
      shippingAddress: orderPayload.shippingAddress,
      billingAddress: orderPayload.billingAddress ?? orderPayload.shippingAddress,
      notes: orderPayload.notes ?? '',
      paymentMethod: 'card',
    });

    if (!orderResult.success) {
      return NextResponse.json(
        { success: false, error: orderResult.error ?? 'Failed to create order' },
        { status: 500 }
      );
    }

    const result = await createPaymentIntent(amountInCents, receipt_email, {
      metadata: { orderNumber: orderResult.orderNumber, userId: uid },
    });

    if (!result.success || !result.paymentIntent?.client_secret) {
      return NextResponse.json(
        { success: false, error: result.error ?? 'Failed to create payment intent' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      clientSecret: result.paymentIntent.client_secret,
      orderNumber: orderResult.orderNumber,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('create-payment-intent error:', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
