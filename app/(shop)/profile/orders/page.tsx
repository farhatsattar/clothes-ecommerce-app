'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/lib/context/auth-context';
import { getUserOrders } from '@/firebase/orders';
import { OrderData } from '@/types';
import Link from 'next/link';

const OrdersPage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (loading) return; // wait for auth to load

      if (!user) {
        router.replace('/login?redirect=/profile/orders');
        return;
      }

      try {
        const response = await getUserOrders(user.uid); // ✅ returns { success, orders, error }

        if (!response.success) {
          console.error('Failed to fetch orders:', response.error);
          setOrders([]);
          return;
        }

        // map the orders array
        const mappedOrders: OrderData[] = response.orders.map((item: any) => ({
          id: item.id,
          userId: item.userId,
          items: item.items || [],
          totalAmount: item.totalAmount || 0,
          status: (item.status || 'pending') as 'pending' | 'delivered' | 'cancelled',
          shippingAddress: item.shippingAddress || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
          },
          billingAddress: item.billingAddress || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
          },
          paymentMethod: item.paymentMethod || '',
          notes: item.notes || '',
          createdAt: item.createdAt ? (item.createdAt.seconds ? new Date(item.createdAt.seconds * 1000) : new Date(item.createdAt)) : new Date(),
          updatedAt: item.updatedAt ? (item.updatedAt.seconds ? new Date(item.updatedAt.seconds * 1000) : new Date(item.updatedAt)) : new Date(),
        }));

        setOrders(mappedOrders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
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
                key={order.id}
                href={`/profile/orders/${order.id}`}
                className="block border rounded p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between">
                  <span>Order ID: {order.id}</span>
                  <span
                    className={`font-semibold ${
                      order.status === 'pending'
                        ? 'text-orange-600'
                        : 'text-green-600'
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span>
                    Total: ${(order.totalAmount / 100).toFixed(2)}
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
