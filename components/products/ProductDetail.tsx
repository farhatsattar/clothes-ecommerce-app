'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { useAuth } from '@/lib/context/auth-context';
import { addRating, getRatingByUser } from '@/firebase/ratings';
import Button from '@/components/ui/Button';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (
    productId: string,
    quantity: number,
    size: string,
    color: string,
    userId: string
  ) => void;
  selectedSize?: string;
  setSelectedSize?: React.Dispatch<React.SetStateAction<string>>;
  selectedColor?: string;
  setSelectedColor?: React.Dispatch<React.SetStateAction<string>>;
  quantity?: number;
  setQuantity?: React.Dispatch<React.SetStateAction<number>>;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onAddToCart,
  selectedSize: propSelectedSize,
  setSelectedSize: propSetSelectedSize,
  selectedColor: propSelectedColor,
  setSelectedColor: propSetSelectedColor,
  quantity: propQuantity = 1,
  setQuantity: propSetQuantity
}) => {
  const { user } = useAuth();
  const [internalSelectedSize, setInternalSelectedSize] = React.useState<string>('');
  const [internalSelectedColor, setInternalSelectedColor] = React.useState<string>('');
  const [internalQuantity, setInternalQuantity] = React.useState<number>(1);
  const [userRating, setUserRating] = React.useState<number | null>(null);
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);
  const [loadingRating, setLoadingRating] = React.useState<boolean>(true);

  // Use props if provided, otherwise use internal state
  const selectedSize = propSelectedSize !== undefined ? propSelectedSize : internalSelectedSize;
  const setSelectedSize = propSetSelectedSize || setInternalSelectedSize;
  const selectedColor = propSelectedColor !== undefined ? propSelectedColor : internalSelectedColor;
  const setSelectedColor = propSetSelectedColor || setInternalSelectedColor;
  const quantity = propQuantity !== undefined ? propQuantity : internalQuantity;
  const setQuantity = propSetQuantity || setInternalQuantity;
  const [activeImage, setActiveImage] = React.useState<number>(0);

  React.useEffect(() => {
    if (product?.sizes?.length && !propSelectedSize) setSelectedSize(product.sizes[0]);
    if (product?.colors?.length && !propSelectedColor) setSelectedColor(product.colors[0]);
  }, [product, propSelectedSize, propSelectedColor]);

  // Fetch user's rating for this product
  React.useEffect(() => {
    const fetchUserRating = async () => {
      if (user && product?.id) {
        try {
          const rating = await getRatingByUser(product.id, user.uid);
          if (rating) {
            setUserRating(rating.rating);
          }
        } catch (error) {
          console.error('Error fetching user rating:', error);
        } finally {
          setLoadingRating(false);
        }
      } else {
        setLoadingRating(false);
      }
    };

    fetchUserRating();
  }, [user, product?.id]);

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity, selectedSize, selectedColor, '');
  };

  const handleRatingSubmit = async (rating: number) => {
    if (!user) {
      alert('Please log in to rate this product');
      return;
    }

    if (!product?.id) return;

    try {
      await addRating(product.id, user.uid, rating);
      setUserRating(rating);
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-10">

          {/* ================= IMAGES ================= */}
          <div>
            <div className="w-full aspect-[4/5] sm:aspect-[3/4] rounded-lg overflow-hidden border">
              {product.images?.length ? (
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  No image
                </div>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`thumb-${index}`}
                    onClick={() => setActiveImage(index)}
                    className={`w-20 h-20 object-cover cursor-pointer border rounded transition ${
                      activeImage === index
                        ? 'border-black scale-105'
                        : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ================= INFO ================= */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {/* Star Rating Display */}
            <div className="flex items-center mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                ({product.numReviews || 0} reviews)
              </span>
            </div>

            <p className="text-2xl font-semibold mt-2">
              ${(product.price / 100).toFixed(2)}
            </p>
            <p className="mt-4 text-gray-600">{product.description}</p>

            {/* Rating Submission */}
            {user && (
              <div className="mt-4">
                <h3 className="text-sm font-medium">Rate this product</h3>
                <div className="flex mt-2">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`text-xl ${i < (hoverRating !== null ? hoverRating : userRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      onClick={() => handleRatingSubmit(i + 1)}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(null)}
                      disabled={loadingRating}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {userRating && <p className="text-sm text-gray-600 mt-1">You rated this product {userRating} stars</p>}
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mt-6">
                <span className="block text-sm font-medium mb-2">Size</span>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 border rounded transition ${
                        selectedSize === size
                          ? 'bg-black text-white'
                          : 'bg-white text-gray-800 border-gray-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mt-4">
                <span className="block text-sm font-medium mb-2">Color</span>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition ${
                        selectedColor === color
                          ? 'border-black'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-lg font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={product.inStock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.min(Math.max(Number(e.target.value) || 1, 1), product.inStock)
                    )
                  }
                  className="w-16 text-center border-l border-r"
                />
                <button
                  onClick={() => setQuantity(Math.min(quantity + 1, product.inStock))}
                  className="px-3 py-1 text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-6">
              <Button
                variant="orange"
                fullWidth
                disabled={product.inStock <= 0}
                onClick={handleAddToCart}
              >
                {product.inStock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>

            {/* Extra Info */}
            <div className="mt-8 border-t pt-4 text-sm text-gray-600">
              <p>Category: {product.category}</p>
              <p>Subcategory: {product.subcategory || 'N/A'}</p>
              <p>Stock: {product.inStock > 0 ? 'Available' : 'Out of stock'}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
