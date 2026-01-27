'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/lib/context/auth-context';
import { useCart } from '@/lib/context/cart-context';
import { createOrder } from '@/firebase/orders';
import { OrderItem, OrderStatus, Address } from '@/types';
import Button from '@/components/ui/Button';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const cartItems = cart.items || [];
  const totalAmount = cart.total || 0;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address state
  const [shippingAddress, setShippingAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
  });

  const [useSameAddress, setUseSameAddress] = useState<boolean>(true);

  const handlePlaceOrder = async () => {
    if (!user || !user.uid) {
      router.replace('/login?redirect=/checkout');
      return;
    }

    if (!cartItems.length) {
      setError('Your cart is empty!');
      return;
    }

    // Validate shipping address
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      setError('Please fill in all shipping address fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert cart items to order items
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
        setError(res.error ? String(res.error) : 'Failed to create order');
        setLoading(false);
        return;
      }

      // Clear cart
      clearCart();

      // Redirect to confirmation
      router.push('/checkout/confirmation');
    } catch (err) {
      console.error(err);
      setError('Something went wrong while placing your order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Checkout">
      <div className="max-w-3xl mx-auto py-10 space-y-6">
        <h1 className="text-3xl font-bold">Checkout</h1>

        {error && <p className="text-red-600">{error}</p>}

        {/* ADDRESS FORM */}
        <div className="border p-6 rounded bg-white shadow">
          <h2 className="font-semibold mb-4">Shipping Address</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address</label>
              <input
                type="text"
                id="street"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  id="city"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State/Province</label>
                <input
                  type="text"
                  id="state"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZIP/Postal Code</label>
                <input
                  type="text"
                  id="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                id="country"
                value={shippingAddress.country}
                onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter country"
              />
            </div>
          </div>

          {/* Billing Address Section */}
          <div className="mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useSameAddress"
                checked={useSameAddress}
                onChange={(e) => setUseSameAddress(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="useSameAddress" className="ml-2 block text-sm text-gray-900">
                Same as shipping address
              </label>
            </div>

            {!useSameAddress && (
              <div className="mt-4 space-y-4">
                <h3 className="font-semibold">Billing Address</h3>

                <div>
                  <label htmlFor="billingStreet" className="block text-sm font-medium text-gray-700">Street Address</label>
                  <input
                    type="text"
                    id="billingStreet"
                    value={billingAddress.street}
                    onChange={(e) => setBillingAddress({...billingAddress, street: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Enter billing street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      id="billingCity"
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Enter billing city"
                    />
                  </div>

                  <div>
                    <label htmlFor="billingState" className="block text-sm font-medium text-gray-700">State/Province</label>
                    <input
                      type="text"
                      id="billingState"
                      value={billingAddress.state}
                      onChange={(e) => setBillingAddress({...billingAddress, state: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Enter billing state"
                    />
                  </div>

                  <div>
                    <label htmlFor="billingZipCode" className="block text-sm font-medium text-gray-700">ZIP/Postal Code</label>
                    <input
                      type="text"
                      id="billingZipCode"
                      value={billingAddress.zipCode}
                      onChange={(e) => setBillingAddress({...billingAddress, zipCode: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Enter billing ZIP code"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="billingCountry" className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    id="billingCountry"
                    value={billingAddress.country}
                    onChange={(e) => setBillingAddress({...billingAddress, country: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Enter billing country"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border p-6 rounded bg-white shadow">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          {cartItems.length ? (
            <ul className="space-y-2">
              {cartItems.map((item, idx) => (
                <li key={idx}>
                  {item.product?.name || 'Item'} ({item.selectedSize}/{item.selectedColor}) × {item.quantity} — ${(item.priceAtTime / 100).toFixed(2)}
                </li>
              ))}
            </ul>
          ) : (
            <p>Your cart is empty.</p>
          )}
          <div className="mt-4 font-bold">Total: ${(totalAmount / 100).toFixed(2)}</div>
        </div>

        <Button
          onClick={handlePlaceOrder}
          disabled={loading || !cartItems.length}
          variant="orange"
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </Button>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
