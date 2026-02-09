/**
 * Server-side Stripe helpers. Use only in API routes or server code.
 * Do not import in client components (uses STRIPE_SECRET_KEY).
 */
import Stripe from 'stripe';

// Initialize Stripe with secret key (server only)
let stripe: Stripe;

if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your_stripe_secret_key')) {
  // Use mock Stripe for development when no real key is provided
  console.warn('Using mock Stripe service - replace with real STRIPE_SECRET_KEY in production');
  stripe = {
    paymentIntents: {
      create: async () => {
        // Mock successful payment intent creation
        return {
          id: 'pi_mock_' + Math.random().toString(36).substr(2, 9),
          client_secret: 'pi_mock_' + Math.random().toString(36).substr(2, 9) + '_secret_' + Math.random().toString(36).substr(2, 9),
        } as any;
      },
      retrieve: async () => {
        // Mock payment intent retrieval
        return {
          id: 'pi_mock_' + Math.random().toString(36).substr(2, 9),
          status: 'succeeded',
        } as any;
      }
    }
  } as any;
} else {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover', // stable API version
    typescript: true,
  });
}

// -------------------- TYPES --------------------
export interface CreatePaymentIntentParams {
  amount: number; // in cents
  currency?: string;
  receipt_email?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface CreatePaymentIntentResult {
  success: boolean;
  paymentIntent?: Stripe.PaymentIntent;
  error?: string;
}

export interface VerifyPaymentIntentParams {
  paymentIntentId: string;
}

export interface VerifyPaymentIntentResult {
  success: boolean;
  paymentIntent?: Stripe.PaymentIntent;
  error?: string;
}

// -------------------- CREATE PAYMENT INTENT --------------------
export const createPaymentIntent = async (
  amount: number,
  email?: string,
  options?: { metadata?: Record<string, string> }
) => {
  try {
    if (typeof stripe.paymentIntents.create === 'function') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        receipt_email: email,
        payment_method_types: ['card'],
        metadata: options?.metadata,
      });
      return { success: true, paymentIntent };
    } else {
      // Mock Stripe - return mock data
      const mockPaymentIntent = {
        id: 'pi_mock_' + Math.random().toString(36).substr(2, 9),
        client_secret: 'pi_mock_' + Math.random().toString(36).substr(2, 9) + '_secret_' + Math.random().toString(36).substr(2, 9),
        amount,
        currency: 'usd',
        receipt_email: email,
        status: 'requires_confirmation',
      };

      return { success: true, paymentIntent: mockPaymentIntent as any };
    }
  } catch (err: any) {
    console.error('Stripe createPaymentIntent error:', err);
    return { success: false, error: err.message || 'PaymentIntent creation failed' };
  }
};


// -------------------- VERIFY PAYMENT INTENT --------------------
export const verifyPaymentIntent = async ({
  paymentIntentId,
}: VerifyPaymentIntentParams): Promise<VerifyPaymentIntentResult> => {
  try {
    // Check if we're using mock Stripe
    if (typeof stripe.paymentIntents.retrieve === 'function') {
      // Real Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return { success: true, paymentIntent };
    } else {
      // Mock Stripe - return mock data
      const mockPaymentIntent = {
        id: paymentIntentId,
        status: 'succeeded',
        amount: 0,
        currency: 'usd',
      };

      return { success: true, paymentIntent: mockPaymentIntent as any };
    }
  } catch (error) {
    console.error('Stripe verifyPaymentIntent error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export default stripe;

