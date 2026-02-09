'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';

export default function CheckoutConfirmation() {
  const router = useRouter();
  const { user } = useAuth();

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
          🎉 Order Placed Successfully!
        </h1>

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

