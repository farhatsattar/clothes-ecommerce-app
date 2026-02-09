'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import Button from '@/components/ui/Button';
import { useCart } from '@/lib/context/cart-context';
import WishlistButton from '@/components/wishlist/WishlistButton';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    addToCart(product, 1, 'M', 'Default');
    console.log('✅ Added to cart:', product.name);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* 🔹 ONLY image + info wrapped in Link */}
      <Link href={`/products/${product.id}`}>
        <div className="cursor-pointer relative">
          {(product.images && product.images.length > 0 && product.images[0]) ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-64 object-cover"
              onError={(e) => {
                // Fallback to default image if the image fails to load
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite loop
                target.src = '/images/image.jpg'; // Default fallback image
              }}
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <span>No image</span>
            </div>
          )}

          {/* Wishlist button positioned at top-right corner */}
          <div className="absolute top-2 right-2">
            <WishlistButton productId={product.id} size="medium" />
          </div>

          <div className="p-4">
            <h3 className="text-lg font-medium">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>

            {/* Rating Stars */}
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-gray-500 ml-1">({product.numReviews || 0})</span>
            </div>

            <div className="mt-2 flex justify-between items-center">
              <span className="text-lg font-semibold">
                ${(product.price / 100).toFixed(2)}
              </span>
              <span
                className={`text-sm ${
                  product.inStock > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {product.inStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* 🔴 Button Link ke bahar */}
      <div className="p-4 pt-0">
        <Button
          variant="orange"
          fullWidth
          disabled={product.inStock <= 0}
          onClick={handleAddToCart}
        >
          {product.inStock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;

