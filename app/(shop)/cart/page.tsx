'use client';

import React from 'react';
import { useCart } from '@/lib/context/cart-context';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const handleCheckout = () => {
    // Redirect to checkout page
    window.location.href = '/checkout';
  };

  return (
    <MainLayout title="Shopping Cart - IBFashionHub" description="Review your cart items">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0l-.3-1.4A.5.5 0 015 11.5v-3a.5.5 0 01.3-.5zM7 13l-1.9 4.5a.5.5 0 00.3.7H17a.5.5 0 00.5-.3l1.1-2.2M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
            <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
            <div className="mt-6">
              <Button variant="orange">
                <a href="/products">Continue Shopping</a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="divide-y divide-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Cart Items</h2>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <ul className="-my-6 divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <li key={item.id} className="py-6 flex">
                      <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                        {item.product?.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-center object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">No image</span>
                          </div>
                        )}
                      </div>

                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.product?.name}</h3>
                            <p className="ml-4">${(item.priceAtTime / 100).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.selectedSize}, {item.selectedColor}
                          </p>
                        </div>
                        <div className="flex-1 flex items-end justify-between text-sm">
                          <div className="flex items-center">
                            <label htmlFor={`quantity-${item.id}`} className="mr-2 text-sm font-medium text-gray-700">
                              Qty
                            </label>
                            <select
                              id={`quantity-${item.id}`}
                              name={`quantity-${item.id}`}
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                              className="max-w-full rounded-md border border-gray-300 py-1 pl-2 pr-7 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            >
                              {Array.from({ length: Math.min(10, item.product?.inStock || 10) }, (_, i) => i + 1).map((num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex">
                            <button
                              type="button"
                              className="font-medium text-red-600 hover:text-red-500"
                              onClick={() => removeFromCart(item.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-4 py-5 sm:p-6 bg-gray-50">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>${(cart.total / 100).toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <Button
                    variant="orange"
                    fullWidth
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    or{' '}
                    <Button
                      variant="outline"
                      onClick={() => (window.location.href = '/products')}
                    >
                      Continue Shopping
                    </Button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CartPage;