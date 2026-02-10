'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const orderNumber = searchParams.get('orderNumber') ?? '';

  const handleViewOrders = () => {
    if (!user) {
      router.push('/login?redirect=/profile/orders');
    } else {
      router.push('/profile/orders');
    }
  };

  return (
    <MainLayout title="Order Placed - IBFashionHub">
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Order Placed Successfully
        </h1>

        {orderNumber ? (
          <p className="text-lg text-gray-700 mb-2">
            Your order number is <strong className="font-semibold text-gray-900">{orderNumber}</strong>.
          </p>
        ) : null}

        <p className="text-gray-600 mb-8">
          Thank you for shopping with us. You can view your orders anytime.
        </p>

        <Button variant="orange" onClick={handleViewOrders}>
          View My Orders
        </Button>
      </div>
    </MainLayout>
  );
}

export default function CheckoutConfirmationPage() {
  return (
    <Suspense
      fallback={
        <MainLayout title="Order Placed - IBFashionHub">
          <div className="max-w-2xl mx-auto py-20 text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        </MainLayout>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
