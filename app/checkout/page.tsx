'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/lib/context/auth-context';
import { useCart } from '@/lib/context/cart-context';
import { createOrder } from '@/firebase/orders';
import { OrderItem, OrderStatus, Address } from '@/types';
import Button from '@/components/ui/Button';
import PaymentForm from '@/components/payment/PaymentForm';
import Link from 'next/link';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { cart, clearCart } = useCart();
  const cartItems = cart.items || [];
  const totalAmount = cart.total || 0; // already in cents
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shippingAddress, setShippingAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [useSameAddress, setUseSameAddress] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cardClientSecret, setCardClientSecret] = useState<string | null>(null);
  const [cardOrderNumber, setCardOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.uid && cartItems.length > 0) {
      router.replace('/login?redirect=/checkout');
    }
  }, [user, authLoading, cartItems.length, router]);

  const handlePlaceOrder = async () => {
    setError(null);

    if (!user?.uid) {
      router.replace('/login?redirect=/checkout');
      return;
    }

    if (!cartItems.length) {
      setError('Your cart is empty!');
      return;
    }

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
      setError('Please fill in all shipping address fields');
      return;
    }

    if (paymentMethod === 'card') {
      setLoading(true);
      setError(null);
      try {
        const idToken = await user.getIdToken();
        const orderItems = cartItems.map((item) => ({
          productId: item.product?.id ?? '',
          name: item.product?.name ?? '',
          priceAtTime: item.priceAtTime ?? 0,
          quantity: item.quantity ?? 1,
          selectedSize: item.selectedSize ?? '',
          selectedColor: item.selectedColor ?? '',
        }));
        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            amount: totalAmount,
            receipt_email: user.email ?? undefined,
            order: {
              items: orderItems,
              shippingAddress,
              billingAddress: useSameAddress ? shippingAddress : billingAddress,
              notes: '',
              totalAmount,
            },
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success || !data.clientSecret) {
          setError(data.error ?? 'Failed to create payment session');
          setLoading(false);
          return;
        }
        setCardClientSecret(data.clientSecret);
        if (data.orderNumber) setCardOrderNumber(data.orderNumber);
        setShowPaymentForm(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const orderItems: OrderItem[] = cartItems.map(item => ({
        productId: item.product?.id || '',
        name: item.product?.name || '',
        priceAtTime: item.priceAtTime || 0,
        quantity: item.quantity || 1,
        selectedSize: item.selectedSize || '',
        selectedColor: item.selectedColor || '',
      }));

      const orderData = {
        items: orderItems,
        shippingAddress,
        billingAddress: useSameAddress ? shippingAddress : billingAddress,
        notes: '',
        paymentMethod: 'Cash on Delivery',
        totalAmount,
        status: 'pending' as OrderStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const res = await createOrder(user.uid, orderData);
      if (!res.success) {
        const errMsg = res.error instanceof Error ? res.error.message : String(res.error ?? 'Failed to create order');
        setError(errMsg);
        setLoading(false);
        return;
      }

      clearCart();
      router.push('/checkout/confirmation');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong while placing your order.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    const query = cardOrderNumber ? `?orderNumber=${encodeURIComponent(cardOrderNumber)}` : '';
    router.push(`/checkout/confirmation${query}`);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setShowPaymentForm(false);
  };

  // Loading state while auth/cart resolve
  if (authLoading) {
    return (
      <MainLayout title="Checkout">
        <div className="max-w-3xl mx-auto py-10 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ibfashionhub-red" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Checkout">
      <div className="max-w-3xl mx-auto py-10 space-y-6">
        <h1 className="text-3xl font-bold">Checkout</h1>

        {error && <p className="text-red-600">{error}</p>}

        {!user?.uid ? (
          <div className="border p-6 rounded bg-white shadow text-center">
            <p className="text-gray-600 mb-4">Please sign in to checkout.</p>
            <Link href={`/login?redirect=/checkout`} className="text-ibfashionhub-red font-medium hover:underline">
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            {/* SHIPPING & BILLING FORM */}
            <div className="border p-6 rounded bg-white shadow space-y-6">
              <h2 className="font-semibold mb-4">Shipping Address</h2>
              <input
                type="text"
                placeholder="Street"
                value={shippingAddress.street}
                onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="City" value={shippingAddress.city} onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })} className="border p-2 rounded" />
                <input type="text" placeholder="State" value={shippingAddress.state} onChange={e => setShippingAddress({ ...shippingAddress, state: e.target.value })} className="border p-2 rounded" />
                <input type="text" placeholder="ZIP" value={shippingAddress.zipCode} onChange={e => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })} className="border p-2 rounded" />
              </div>
              <input type="text" placeholder="Country" value={shippingAddress.country} onChange={e => setShippingAddress({ ...shippingAddress, country: e.target.value })} className="w-full border p-2 rounded" />

              <div className="mt-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={useSameAddress} onChange={e => setUseSameAddress(e.target.checked)} />
                  Same as shipping address
                </label>
                {!useSameAddress && (
                  <div className="mt-2 space-y-2">
                    <input type="text" placeholder="Street" value={billingAddress.street} onChange={e => setBillingAddress({ ...billingAddress, street: e.target.value })} className="w-full border p-2 rounded" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input type="text" placeholder="City" value={billingAddress.city} onChange={e => setBillingAddress({ ...billingAddress, city: e.target.value })} className="border p-2 rounded" />
                      <input type="text" placeholder="State" value={billingAddress.state} onChange={e => setBillingAddress({ ...billingAddress, state: e.target.value })} className="border p-2 rounded" />
                      <input type="text" placeholder="ZIP" value={billingAddress.zipCode} onChange={e => setBillingAddress({ ...billingAddress, zipCode: e.target.value })} className="border p-2 rounded" />
                    </div>
                    <input type="text" placeholder="Country" value={billingAddress.country} onChange={e => setBillingAddress({ ...billingAddress, country: e.target.value })} className="w-full border p-2 rounded" />
                  </div>
                )}
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="border p-6 rounded bg-white shadow">
              <h2 className="font-semibold mb-4">Order Summary</h2>
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty. <Link href="/products" className="text-ibfashionhub-red hover:underline">Continue shopping</Link>.</p>
              ) : (
                <>
                  <ul>
                    {cartItems.map((item, idx) => (
                      <li key={item.id || idx}>{item.product?.name} × {item.quantity} — ${((item.priceAtTime || 0) / 100).toFixed(2)}</li>
                    ))}
                  </ul>
                  <div className="mt-2 font-bold">Total: ${(totalAmount / 100).toFixed(2)}</div>
                </>
              )}
            </div>

            {/* PAYMENT METHOD */}
            <div className="border p-6 rounded bg-white shadow space-y-2">
              <h2 className="font-semibold">Payment Method</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                Credit/Debit Card
              </label>
            </div>

            {showPaymentForm && paymentMethod === 'card' && (
              <PaymentForm
                totalAmount={totalAmount}
                cartItems={cartItems}
                shippingAddress={shippingAddress}
                billingAddress={useSameAddress ? shippingAddress : billingAddress}
                useSameAddress={useSameAddress}
                clientSecretFromApi={cardClientSecret}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            )}

            {!showPaymentForm && (
              <Button onClick={handlePlaceOrder} disabled={loading || !cartItems.length} variant="orange">
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
