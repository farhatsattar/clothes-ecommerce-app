import { NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/services/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = body.amount;
    const email = body.email ?? body.receipt_email;

    // Validate required fields (amount must be in cents)
    if (amount == null || typeof amount !== 'number' || amount < 50) {
      return NextResponse.json(
        { success: false, error: 'Amount is required, must be a number, and at least 50 cents' },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(amount);

    // Call Stripe service
    const result = await createPaymentIntent(amountInCents, email);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create payment intent' },
        { status: 500 }
      );
    }

    // Return client secret for frontend
    return NextResponse.json({
      success: true,
      client_secret: result.paymentIntent?.client_secret,
      id: result.paymentIntent?.id,
    });
  } catch (err: any) {
    console.error('Error creating payment intent:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
