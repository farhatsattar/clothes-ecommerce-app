import { NextResponse } from 'next/server';
import { Product } from '@/types';
import { getProducts, createProduct } from '@/lib/services/products';

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const limitParam = searchParams.get('limit');

    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    // Fetch products from Firestore
    const result = await getProducts(category, limit);

    return NextResponse.json({
      success: true,
      products: result.products,
      total: result.products.length,
      hasMore: result.hasMore
    });
  } catch (error) {
    console.error('Error fetching products:', error);
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

export async function POST(request: Request) {
  try {
    const productData = await request.json();

    // Validate required fields
    if (!productData.name || !productData.description || !productData.price || !productData.category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, description, price, or category'
        },
        { status: 400 }
      );
    }

    const productId = await createProduct(productData);

    return NextResponse.json({
      success: true,
      id: productId,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create product'
      },
      { status: 500 }
    );
  }
}