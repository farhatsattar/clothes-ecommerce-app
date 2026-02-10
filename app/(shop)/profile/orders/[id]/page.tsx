'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/lib/context/auth-context';
import { OrderItem, Address } from '@/types';

interface MyOrderDetail {
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod?: string;
  createdAt: Date | unknown;
}

const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const orderNumber = params?.id as string;

  const { user } = useAuth();
  const [order, setOrder] = useState<MyOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowAuthModal(true);
      setLoading(false);
      return;
    }

    if (!orderNumber) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/my-orders/${encodeURIComponent(orderNumber)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok || !data.success || !data.order) {
          router.replace('/profile/orders');
          return;
        }

        setOrder(data.order);
      } catch (err) {
        console.error(err);
        router.replace('/profile/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user, orderNumber, router]);

  if (!user) {
    return (
      <MainLayout>
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
              <p className="mb-6">You need to be logged in to view order details.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    router.push(`/login?redirect=${encodeURIComponent('/profile/orders/' + encodeURIComponent(orderNumber ?? ''))}`);
                    setShowAuthModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    router.push(`/signup?redirect=${encodeURIComponent('/profile/orders/' + encodeURIComponent(orderNumber ?? ''))}`);
                    setShowAuthModal(false);
                  }}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </MainLayout>
    );
  }

  if (loading)
    return (
      <MainLayout title="Order Details">
        <p>Loading...</p>
      </MainLayout>
    );

  if (!order)
    return (
      <MainLayout title="Order Details">
        <p>Order not found.</p>
      </MainLayout>
    );

  return (
    <MainLayout title={`Order ${order.orderNumber}`}>
      <div className="max-w-5xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Order Details</h1>

        <div className="border rounded p-6 space-y-4 bg-white shadow">
          <div className="flex justify-between">
            <span>Order #</span>
            <span className="font-semibold">{order.orderNumber}</span>
          </div>

          <div className="flex justify-between">
            <span>Status:</span>
            <span className="font-semibold text-orange-600">
              {(order.orderStatus ?? 'processing').toString().charAt(0).toUpperCase() +
                (order.orderStatus ?? 'processing').toString().slice(1)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Payment:</span>
            <span className="font-semibold">
              {(order.paymentStatus ?? 'pending').toString().charAt(0).toUpperCase() +
                (order.paymentStatus ?? 'pending').toString().slice(1)}
            </span>
          </div>

          <div>
            <h2 className="font-semibold mt-4">Items:</h2>
            <ul className="list-disc list-inside">
              {(order.items ?? []).map((item, idx) => (
                <li key={idx}>
                  {item.name} ({item.selectedSize} / {item.selectedColor}) × {item.quantity}
                </li>
              ))}
            </ul>
          </div>

          {order.shippingAddress && (
            <div className="mt-4">
              <h2 className="font-semibold">Shipping Address:</h2>
              <p>
                {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state}, {order.shippingAddress.country}
              </p>
            </div>
          )}

          <div className="mt-4 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${(Number(order.totalAmount) / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderDetailPage;

export const dynamic = 'force-dynamic';
