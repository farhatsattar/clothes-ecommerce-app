'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../layout';
import type { OrderItem, Address } from '@/types';

interface AdminOrderDetail {
  id: string;
  orderNumber: string;
  userId: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address | null;
  notes?: string;
  paymentMethod?: string;
  createdAt: unknown;
  updatedAt?: unknown;
}

export default function AdminOrderViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('Missing order id');
      return;
    }

    const fetchOrder = async () => {
      setError(null);
      try {
        const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.error ?? 'Failed to load order');
          setOrder(null);
          return;
        }

        setOrder(data.order);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="px-4 py-6 sm:px-0 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ibfashionhub-red" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <div className="px-4 py-6 sm:px-0">
          <p className="text-red-600 mb-4">{error ?? 'Order not found'}</p>
          <Link href="/admin/orders" className="text-indigo-600 hover:underline">
            ← Back to Orders
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const createdDate = order.createdAt instanceof Date
    ? order.createdAt
    : order.createdAt
      ? new Date(String(order.createdAt))
      : null;

  return (
    <AdminLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
          >
            ← Back to Orders
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Firestore doc ID (admin)</span>
              <span className="font-mono text-gray-700">{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order # (customer)</span>
              <span className="font-semibold">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">User ID</span>
              <span className="font-mono text-gray-700">{order.userId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment</span>
              <span className="font-medium capitalize">{order.paymentStatus}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="font-medium capitalize">{order.orderStatus}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-semibold">${(Number(order.totalAmount) / 100).toFixed(2)}</span>
            </div>
            {createdDate && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Created</span>
                <span>{createdDate.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Items</h3>
            <ul className="divide-y divide-gray-100">
              {(order.items ?? []).map((item, idx) => (
                <li key={idx} className="py-2 flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity} ({item.selectedSize} / {item.selectedColor})
                  </span>
                  <span>${(Number(item.priceAtTime) / 100).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          {order.shippingAddress && (
            <div className="px-6 py-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Shipping Address</h3>
              <p className="text-sm text-gray-600">
                {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} {order.shippingAddress.zipCode ?? ''},{' '}
                {order.shippingAddress.country}
              </p>
            </div>
          )}

          {order.notes && (
            <div className="px-6 py-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
