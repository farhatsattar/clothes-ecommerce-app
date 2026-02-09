'use client';

import React, { useState, useEffect } from 'react';
import { useWishlist } from '@/lib/context/wishlist-context';
import { useAuth } from '@/lib/context/auth-context';
import { Product } from '@/types';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  className = '',
  size = 'medium'
}) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const [isInWL, setIsInWL] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsInWL(isInWishlist(productId));
    } else {
      setIsInWL(false);
    }
  }, [productId, user, isInWishlist]);

  const handleToggleWishlist = async () => {
    if (!user) {
      alert('Please log in to use the wishlist');
      return;
    }

    setLoading(true);
    try {
      if (isInWL) {
        await removeFromWishlist(productId);
        setIsInWL(false);
      } else {
        await addToWishlist(productId);
        setIsInWL(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  // Determine icon size based on props
  const iconSize = size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`flex items-center justify-center rounded-full transition-colors ${
        isInWL
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-red-500'
      } ${className}`}
      aria-label={isInWL ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {loading ? (
        <svg className={`${iconSize} animate-spin`} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg
          className={`${iconSize} ${isInWL ? 'fill-current' : 'stroke-current fill-none'}`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
};

export default WishlistButton;