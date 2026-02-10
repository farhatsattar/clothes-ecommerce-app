'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/lib/context/auth-context';
import Link from 'next/link';

interface MyOrder {
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: Date | unknown;
  items?: unknown[];
  shippingAddress?: unknown;
}

const OrdersPage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (loading || !user) {
        if (!user) router.replace('/login?redirect=/profile/orders');
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/my-orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!data.success || !Array.isArray(data.orders)) {
          setOrders([]);
          return;
        }

        setOrders(data.orders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setOrders([]);
      } finally {
        setPageLoading(false);
      }
    };

    fetchOrders();
  }, [user, loading, router]);

  if (pageLoading)
    return (
      <MainLayout title="My Orders" description="Loading your order history">
        <p>Loading...</p>
      </MainLayout>
    );

  return (
    <MainLayout title="My Orders" description="View your order history">
      <div className="max-w-5xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <p>You have not placed any orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.orderNumber}
                href={`/profile/orders/${encodeURIComponent(order.orderNumber)}`}
                className="block border rounded p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between">
                  <span>Order #{order.orderNumber}</span>
                  <span
                    className={`font-semibold ${
                      order.orderStatus === 'processing' || order.orderStatus === 'pending'
                        ? 'text-orange-600'
                        : order.orderStatus === 'cancelled'
                          ? 'text-red-600'
                          : 'text-green-600'
                    }`}
                  >
                    {(order.orderStatus ?? 'processing').toString().charAt(0).toUpperCase() +
                      (order.orderStatus ?? 'processing').toString().slice(1)}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span>
                    Total: ${(Number(order.totalAmount) / 100).toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OrdersPage;

export const dynamic = 'force-dynamic';
