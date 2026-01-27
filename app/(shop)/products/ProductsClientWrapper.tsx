'use client';

import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import CategoryFilter from '@/components/products/CategoryFilter';
import { Product } from '@/types';
import { fetchAllProducts } from '@/lib/fetchAllproducts';
import { useSearchParams } from 'next/navigation';

const ProductsClientWrapper: React.FC = () => {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') || 'all').toLowerCase();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [loading, setLoading] = useState<boolean>(true);

  // 🔥 FETCH ALL PRODUCTS FROM FIRESTORE
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchAllProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // 🔥 CATEGORY FILTER
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      // Normalize the selected category
      let normalizedCategory = selectedCategory.toLowerCase();
      // Handle both 'juniors' and 'kids' as the same category
      if (normalizedCategory === 'juniors') {
        normalizedCategory = 'kids';
      }

      setFilteredProducts(
        products.filter(
          (p) => {
            const productCategory = p.category?.toLowerCase();
            // Normalize product category as well
            let normalizedProductCategory = productCategory;
            if (normalizedProductCategory === 'juniors') {
              normalizedProductCategory = 'kids';
            }

            return normalizedProductCategory === normalizedCategory;
          }
        )
      );
    }
  }, [selectedCategory, products]);

  const categories = ['all', 'men', 'women', 'kids'];

  return (
    <MainLayout title="Products" description="Browse our products">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Our Products</h1>

        <div className="flex gap-8">
          {/* CATEGORY FILTER */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* PRODUCTS GRID */}
          {loading ? (
            <div className="flex justify-center w-full">
              <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductsClientWrapper;