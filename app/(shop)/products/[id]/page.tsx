'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import ProductDetail from '@/components/products/ProductDetail';
import { Product } from '@/types';
import { useCart } from '@/lib/context/cart-context';
import { useAuth } from '@/lib/context/auth-context';
import Button from '@/components/ui/Button';
import { getProductById } from '@/firebase/firestore';
import WhatsAppOrderButton from '@/components/WhatsAppOrderButton';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart } = useCart();
  const { user, loading: authLoading } = useAuth(); // ✅ fixed

  // ⚡ State for WhatsApp / size / color / qty
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // 🔥 FETCH PRODUCT FROM FIRESTORE
  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data as Product | null);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ⚡ Set default size/color after product loads
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] ?? '');
      setSelectedColor(product.colors?.[0] ?? '');
    }
  }, [product]);

  const handleAddToCart = (
    productId: string,
    quantity: number,
    size: string,
    color: string
  ) => {
    if (!product) return;

    if (authLoading) return; // wait for auth to load

    // ✅ Pass user.uid if logged in, else guest cart
    addToCart(product, quantity, size, color);
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <MainLayout
        title="Loading Product..."
        description="Please wait while we load the product details"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ❌ NOT FOUND
  if (!product) {
    return (
      <MainLayout
        title="Product Not Found"
        description="The requested product could not be found"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Product Not Found</h1>
          <p className="mt-2 text-gray-600">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <Button>
              <a href="/products">Back to Products</a>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ✅ PRODUCT FOUND
  return (
    <MainLayout
      title={`${product.name} - IBFashionHub`}
      description={product.description}
    >
      {/* Product Details */}
      <ProductDetail
        product={product}
        onAddToCart={handleAddToCart}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        quantity={quantity}
        setQuantity={setQuantity}
      />

      {/* WhatsApp Order Button */}
      <div className="mt-4 flex justify-center">
        <WhatsAppOrderButton
          product={product}
          size={selectedSize}
          color={selectedColor}
          qty={quantity}
        />
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
