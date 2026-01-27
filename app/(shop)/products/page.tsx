
import { Suspense } from 'react';
import ProductsClientWrapper from './ProductsClientWrapper';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading products...</div>}>
      <ProductsClientWrapper />
    </Suspense>
  );
}
