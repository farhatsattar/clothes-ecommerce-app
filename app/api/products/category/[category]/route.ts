import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';
import { getProductsByCategory } from '@/lib/services/products';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');

    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    // Fetch products from Firestore by category
    const result = await getProductsByCategory(category, limit);

    return NextResponse.json({
      success: true,
      products: result.products,
      total: result.products.length,
      hasMore: result.hasMore
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        products: [],
        total: 0
      },
      { status: 500 }
    );
  }
}