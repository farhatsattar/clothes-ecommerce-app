import React from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import { searchProducts } from '@/lib/services/products';

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const searchTerm = Array.isArray(params.q) ? params.q[0] : params.q;
  const category = Array.isArray(params.category) ? params.category[0] : params.category;

  let products: Product[] = [];
  let error = null;

  if (searchTerm || category) {
    try {
      const result = await searchProducts(searchTerm || '', category);
      products = result.products;
    } catch (err) {
      error = err instanceof Error ? err.message : 'An unknown error occurred';
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {searchTerm ? `Search Results for "${searchTerm}"` : 'Search Results'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Error: {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            {searchTerm
              ? `No products found for "${searchTerm}". Try different keywords.`
              : 'No products found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {products.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Found {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchPage;