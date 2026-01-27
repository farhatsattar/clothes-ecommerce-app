// 'use client';

// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/context/auth-context';
// import MainLayout from '@/components/layout/MainLayout';
// import Button from '@/components/ui/Button';

// export default function CheckoutConfirmation() {
//   const router = useRouter();
//   const { user } = useAuth();

//   const handleViewOrders = () => {
//     if (!user) {
//       router.push('/login?redirect=/profile/orders');
//     } else {
//       router.push('/profile/orders');
//     }
//   };

//   return (
//     <MainLayout title="Order Placed - IBFashionHub">
//       <div className="max-w-2xl mx-auto py-20 text-center">
//         <h1 className="text-3xl font-bold mb-4">
//           🎉 Order Placed Successfully!
//         </h1>

//         <p className="text-gray-600 mb-8">
//           Thank you for shopping with us. You can view your orders anytime.
//         </p>

//         <Button variant="orange" onClick={handleViewOrders}>
//           View My Orders
//         </Button>
//       </div>
//     </MainLayout>
//   );
// }

'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';

const CheckoutConfirmation: React.FC = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const handleViewOrders = () => {
    // 🔐 Agar auth loading ho rahi ho, button disable kar sakte ho (optional)
    if (!user) {
      // Guest user ko login page pe redirect kare aur redirect query set kare
      router.push('/login?redirect=/profile/orders');
      return;
    }

    // Logged-in user ko orders page pe bhej do
    router.push('/profile/orders');
  };

  return (
    <MainLayout title="Order Placed - IBFashionHub">
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">
          🎉 Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mb-8">
          Thank you for shopping with us. You can view your orders anytime in your profile.
        </p>

        <Button
          variant="orange"
          onClick={handleViewOrders}
          disabled={authLoading} // optional: disable button while auth state loading
        >
          {authLoading ? 'Loading...' : 'View My Orders'}
        </Button>
      </div>
    </MainLayout>
  );
};

export default CheckoutConfirmation;
