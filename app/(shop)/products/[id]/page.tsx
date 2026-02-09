'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/lib/context/auth-context';
import { useCart } from '@/lib/context/cart-context';
import { Product } from '@/types';
import { getProductById } from '@/lib/services/products';
import { addRating, getRatingByUser, getAverageRating } from '@/firebase/ratings';
import Button from '@/components/ui/Button';

const ProductDetailPageRoute: React.FC = () => {
  const { id } = useParams();
  const productId = Array.isArray(id) ? id[0] : id;

  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [ratingLoading, setRatingLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch product and ratings
  useEffect(() => {
    const fetchData = async () => {
      if (!productId) return;

      try {
        // Fetch product
        const productData = await getProductById(productId);
        if (productData) {
          setProduct(productData as Product);

          // Fetch average rating
          const avgRatingData = await getAverageRating(productId);
          if (avgRatingData.success) {
            setAverageRating(avgRatingData.rating || 0);
            setRatingCount(avgRatingData.numReviews || 0);
          }

          // Fetch user's rating if logged in
          if (user) {
            const userRatingData = await getRatingByUser(productId, user.uid);
            if (userRatingData) {
              setUserRating(userRatingData.rating);
            }
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, user]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }

    if (!product) return;

    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleRatingSubmit = async (rating: number) => {
    if (!user) {
      alert('Please log in to rate this product');
      return;
    }

    if (!product?.id) return;

    setRatingLoading(true);

    try {
      await addRating(product.id, user.uid, rating);
      setUserRating(rating);

      // Refresh average rating
      const avgRatingData = await getAverageRating(product.id);
      if (avgRatingData.success) {
        setAverageRating(avgRatingData.rating || 0);
        setRatingCount(avgRatingData.numReviews || 0);
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating');
    } finally {
      setRatingLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Loading Product...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Product Not Found">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout title="Product Not Found">
        <div className="flex justify-center items-center h-64">
          <p>Product not found</p>
        </div>
      </MainLayout>
    );
  }

  // Available sizes and colors for this product
  const availableSizes = product.sizes || ['S', 'M', 'L'];
  const availableColors = product.colors || ['Red', 'Blue', 'Black'];

  return (
    <MainLayout title={`${product.name} - IBFashionHub`} description={product.description}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Product Images */}
          <div>
            <div className="h-96 w-full">
              <img
                src={product.images?.[0] || '/images/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/images/placeholder.jpg';
                }}
              />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-4">
              {product.images?.slice(1).map((img, idx) => (
                <div key={idx} className="h-24 cursor-pointer">
                  <img
                    src={img}
                    alt={`${product.name} - ${idx + 2}`}
                    className="w-full h-full object-cover rounded"
                    onClick={() => {
                      // This would require state management to change the main image
                      // For now, just showing the thumbnails
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/placeholder.jpg';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-6 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">${(product.price / 100).toFixed(2)}</p>
            </div>

            {/* Star Rating Display */}
            <div className="mt-4">
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="ml-2 text-sm text-gray-600">
                  ({ratingCount} reviews)
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6 text-base text-gray-700">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Size Selector */}
            <div className="mt-10">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`py-3 px-4 text-sm font-medium rounded-md ${
                        selectedSize === size
                          ? 'bg-ibfashionhub-red text-white border-ibfashionhub-red'
                          : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Color Selector */}
            <div className="mt-10">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                <div className="mt-4 flex space-x-3">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`py-2 px-4 text-sm font-medium rounded-md ${
                        selectedColor === color
                          ? 'bg-ibfashionhub-red text-white border-ibfashionhub-red'
                          : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-10">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                <div className="mt-4 flex items-center">
                  <button
                    type="button"
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.inStock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(product.inStock, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="mx-4 w-16 text-center border border-gray-300 rounded-md py-2"
                  />
                  <button
                    type="button"
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => setQuantity(Math.min(product.inStock, quantity + 1))}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="mt-10">
              <Button
                variant="orange"
                fullWidth
                onClick={handleAddToCart}
                disabled={product.inStock <= 0}
              >
                {product.inStock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>

            {/* Rating Submission */}
            {user && (
              <div className="mt-10 border-t border-gray-200 pt-10">
                <h3 className="text-lg font-medium text-gray-900">Rate this product</h3>
                <div className="mt-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`text-2xl ${i < (hoverRating !== null ? hoverRating : userRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                        onClick={() => handleRatingSubmit(i + 1)}
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(null)}
                        disabled={ratingLoading}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  {ratingLoading && <p className="text-sm text-gray-500 mt-2">Submitting rating...</p>}
                  {userRating && <p className="text-sm text-gray-600 mt-2">You rated this product {userRating} stars</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailPageRoute;