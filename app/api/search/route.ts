import { NextResponse } from 'next/server';
import { Product } from '@/types';
import { searchProducts } from '@/lib/services/products';

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('q') || '';
    const category = searchParams.get('category') || undefined;
    const limitParam = searchParams.get('limit');

    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    if (!searchTerm && !category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Either search term (q) or category is required'
        },
        { status: 400 }
      );
    }

    // Perform search
    const result = await searchProducts(searchTerm, category, limit);

    return NextResponse.json({
      success: true,
      products: result.products,
      total: result.products.length,
      hasMore: result.hasMore
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search products',
        products: [],
        total: 0
      },
      { status: 500 }
    );
  }
}