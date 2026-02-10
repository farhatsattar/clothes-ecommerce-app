'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/context/auth-context';
import { useCart } from '@/lib/context/cart-context';
import { createOrder } from '@/firebase/orders';
import { OrderItem, OrderStatus, Address } from '@/types';

interface PaymentFormProps {
  totalAmount: number;
  cartItems: Array<{
    id: string;
    product?: { id: string; name: string };
    priceAtTime?: number;
    quantity?: number;
    selectedSize?: string;
    selectedColor?: string;
  }>;
  shippingAddress: Address;
  billingAddress: Address;
  useSameAddress: boolean;
  clientSecret: string;
  /** When true, order was already created by API; do not create again after payment. */
  orderAlreadyCreated?: boolean;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

const CheckoutForm: React.FC<PaymentFormProps> = ({
  totalAmount,
  cartItems,
  shippingAddress,
  billingAddress,
  useSameAddress,
  clientSecret,
  orderAlreadyCreated,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    if (!user?.uid) {
      onPaymentError('User not authenticated');
      return;
    }
    if (!cartItems.length && !orderAlreadyCreated) {
      onPaymentError('Your cart is empty!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // (a) Validate and collect card details first
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message ?? 'Validation failed');
        onPaymentError(submitError.message ?? 'Validation failed');
        setLoading(false);
        return;
      }

      // (b) Async work (order + PI already created by API when clientSecret was fetched)
      // (c) Confirm payment with clientSecret from backend
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url:
            typeof window !== 'undefined'
              ? `${window.location.origin}/checkout/confirmation`
              : '/checkout/confirmation',
          receipt_email: user.email ?? undefined,
        },
        redirect: 'if_required',
      });

      if (result.error) {
        setError(result.error.message ?? 'Payment failed');
        onPaymentError(result.error.message ?? 'Payment failed');
        setLoading(false);
        return;
      }

      if (orderAlreadyCreated) {
        clearCart();
        onPaymentSuccess();
        return;
      }

      const orderItems: OrderItem[] = cartItems.map((item) => ({
        productId: item.product?.id ?? '',
        name: item.product?.name ?? '',
        priceAtTime: item.priceAtTime ?? 0,
        quantity: item.quantity ?? 1,
        selectedSize: item.selectedSize ?? '',
        selectedColor: item.selectedColor ?? '',
      }));

      const orderData = {
        items: orderItems,
        shippingAddress,
        billingAddress: useSameAddress ? shippingAddress : billingAddress,
        notes: '',
        paymentMethod: 'card',
        totalAmount,
        status: 'pending' as OrderStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const res = await createOrder(user.uid, orderData);
      if (!res.success) {
        onPaymentError(res.error ? String(res.error) : 'Failed to create order');
        setLoading(false);
        return;
      }

      clearCart();
      onPaymentSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment (card only — Visa, Mastercard)</label>
        <div className="border p-4 rounded-md">
          <PaymentElement
            options={{
              paymentMethodOrder: ['card'],
              layout: 'tabs',
              wallets: 'never',
            } as Record<string, unknown>}
          />
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <Button
        type="submit"
        disabled={!stripe || loading}
        variant="orange"
        className="w-full"
      >
        {loading ? 'Processing...' : 'Submit Card'}
      </Button>
    </form>
  );
};

export interface PaymentFormWrapperProps {
  totalAmount: number;
  cartItems: Array<{
    id: string;
    product?: { id: string; name: string };
    priceAtTime?: number;
    quantity?: number;
    selectedSize?: string;
    selectedColor?: string;
  }>;
  shippingAddress: Address;
  billingAddress: Address;
  useSameAddress: boolean;
  /** When set, use this clientSecret (from create-payment-intent API) and do not fetch; order already created on server. */
  clientSecretFromApi?: string | null;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');

const PaymentForm: React.FC<PaymentFormWrapperProps> = (props) => {
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState<string | null>(props.clientSecretFromApi ?? null);
  const [error, setError] = useState<string | null>(null);

  const useDeferredApi = props.clientSecretFromApi != null;

  useEffect(() => {
    if (useDeferredApi) {
      setClientSecret(props.clientSecretFromApi ?? null);
      setError(null);
      return;
    }
    if (!props.totalAmount || props.totalAmount < 50 || !user?.uid) return;

    let cancelled = false;
    fetch('/api/payment-intents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: props.totalAmount,
        email: user.email ?? undefined,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.success && data.client_secret) {
          setClientSecret(data.client_secret);
          setError(null);
        } else {
          setError(data.error ?? 'Failed to create payment session');
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load payment form');
      });

    return () => {
      cancelled = true;
    };
  }, [useDeferredApi, props.clientSecretFromApi, props.totalAmount, user?.uid, user?.email]);

  if (error) {
    return (
      <div className="border p-6 rounded bg-white shadow">
        <p className="text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => props.onPaymentError(error)}
          className="mt-2 text-sm text-gray-600 hover:underline"
        >
          Dismiss
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="border p-6 rounded bg-white shadow flex justify-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ibfashionhub-red" />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm
        {...props}
        clientSecret={clientSecret}
        orderAlreadyCreated={useDeferredApi}
      />
    </Elements>
  );
};

export default PaymentForm;
