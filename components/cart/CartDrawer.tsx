import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CartItem } from '@/types';
import { useCart } from '@/lib/context/cart-context';
import Button from '@/components/ui/Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const handleCheckout = () => {
    onClose(); // Close the drawer
    window.location.href = '/checkout'; // Navigate to checkout
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
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
                            </div>
                          ) : (
                            <ul className="-my-6 divide-y divide-gray-200">
                              {cart.items.map((item) => (
                                <li key={item.id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    {item.product?.images && item.product.images.length > 0 ? (
                                      <img
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        className="h-full w-full object-cover object-center"
                                      />
                                    ) : (
                                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-xs text-gray-500">No image</span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>{item.product?.name}</h3>
                                        <p className="ml-4">${(item.priceAtTime / 100).toFixed(2)}</p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        {item.selectedSize}, {item.selectedColor}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
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
                          )}
                        </div>
                      </div>
                    </div>

                    {cart.items.length > 0 && (
                      <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>${(cart.total / 100).toFixed(2)}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                        <div className="mt-6">
                          <Button
                            fullWidth
                            onClick={handleCheckout}
                          >
                            Checkout
                          </Button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            or{' '}
                            <button
                              type="button"
                              className="font-medium text-blue-600 hover:text-blue-500"
                              onClick={onClose}
                            >
                              Continue Shopping<span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CartDrawer;