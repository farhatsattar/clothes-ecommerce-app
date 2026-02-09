'use client';

import React from 'react';
import { useWishlist } from '@/lib/context/wishlist-context';
import { useAuth } from '@/lib/context/auth-context';
import ProductCard from '@/components/products/ProductCard';
import MainLayout from '@/components/layout/MainLayout';

const WishlistPage = () => {
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  if (!user) {
    return (
      <MainLayout title="Wishlist - Please Log In">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Wishlist</h1>
            <p className="text-gray-600 mb-8">
              Please log in to view and manage your wishlist.
            </p>
            <a
              href="/login"
              className="inline-block bg-ibfashionhub-red text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Log In
            </a>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="My Wishlist">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {wishlist.loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ibfashionhub-red mb-4"></div>
            <p className="text-gray-600">Loading your wishlist...</p>
          </div>
        ) : wishlist.products.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">
              Start adding items you love to your wishlist for later.
            </p>
            <a
              href="/"
              className="inline-block bg-ibfashionhub-red text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                You have <span className="font-semibold">{wishlist.products.length}</span> item{wishlist.products.length !== 1 ? 's' : ''} in your wishlist
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default WishlistPage;