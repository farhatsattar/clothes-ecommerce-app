import React from 'react';
import { CartState } from '@/lib/context/cart-context';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';

interface CartSummaryProps {
  cart: CartState;
}

const CartSummary: React.FC<CartSummaryProps> = ({ cart }) => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (authLoading) return; // Wait for auth to load

    if (!user) {
      alert("Please login first to proceed to checkout");
      router.push('/login?redirect=/checkout');
      return;
    }

    if (cart.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Proceed to checkout page
    router.push('/checkout');
  };

  const isCheckoutDisabled = authLoading || cart.items.length === 0;

  return (
    <div className="bg-gray-50 px-4 py-6 sm:p-6">
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>${(cart.total / 100).toFixed(2)}</p>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <p>Shipping estimate</p>
          <p>$5.99</p>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <p>Tax estimate</p>
          <p>${(cart.total * 0.08 / 100).toFixed(2)}</p>
        </div>

        <div className="flex justify-between text-lg font-bold text-gray-900">
          <p>Order Total</p>
          <p>${((cart.total + 599 + (cart.total * 0.08)) / 100).toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6">
        <Button
          fullWidth
          onClick={handleCheckout}
          disabled={isCheckoutDisabled}
        >
          Checkout
        </Button>
      </div>

      <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
        <p>
          or{' '}
          <Button
            variant="outline"
            onClick={() => router.push('/products')}
          >
            Continue Shopping
          </Button>
        </p>
      </div>
    </div>
  );
};

export default CartSummary;


// 'use client';

// import { useCart } from '@/lib/context/cart-context';
// import Button from '@/components/ui/Button';
// import { useRouter } from 'next/navigation';

// export default function CartSummary() {
//   const { cart } = useCart();
//   const router = useRouter();

//   return (
//     <div className="border rounded-lg p-6 bg-white h-fit">
//       <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

//       <div className="flex justify-between text-sm mb-2">
//         <span>Subtotal</span>
//         <span>${(cart.total / 100).toFixed(2)}</span>
//       </div>

//       <div className="flex justify-between text-sm mb-2">
//         <span>Shipping</span>
//         <span>Calculated at checkout</span>
//       </div>

//       <hr className="my-4" />

//       <div className="flex justify-between font-semibold text-lg mb-6">
//         <span>Total</span>
//         <span>${(cart.total / 100).toFixed(2)}</span>
//       </div>

//       <Button fullWidth onClick={() => router.push('/checkout')}>
//         Proceed to Checkout
//       </Button>
//     </div>
//   );
// }
