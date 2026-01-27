import { NextResponse } from 'next/server';
import { Product } from '@/types';

// Mock data for products
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Men\'s Cotton T-Shirt',
    description: 'Comfortable cotton t-shirt for everyday wear',
    price: 1999, // $19.99 in cents
    category: 'men',
    subcategory: 'shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Blue'],
    images: ['/images/men-tshirt.jpg'],
    inStock: 50,
    isFeatured: true,
    tags: ['casual', 'summer'],
    rating: 5,
    numReviews: 24,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  },
  {
    id: '2',
    name: 'Women\'s Summer Dress',
    description: 'Lightweight summer dress perfect for warm days',
    price: 3999, // $39.99 in cents
    category: 'women',
    subcategory: 'dresses',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Red', 'Pink', 'Yellow'],
    images: ['/images/women-dress.jpg'],
    inStock: 25,
    isFeatured: true,
    tags: ['summer', 'casual'],
    rating: 5,
    numReviews: 18,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  },
  {
    id: '3',
    name: 'Kids\' Hoodie',
    description: 'Warm and cozy hoodie for kids',
    price: 2999, // $29.99 in cents
    category: 'kids',
    subcategory: 'tops',
    sizes: ['S', 'M', 'L'],
    colors: ['Green', 'Gray', 'Purple'],
    images: ['/images/kids-hoodie.jpg'],
    inStock: 30,
    isFeatured: true,
    tags: ['winter', 'hoodie'],
    rating: 5,
    numReviews: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  },
  {
    id: '4',
    name: 'Men\'s Denim Jeans',
    description: 'Classic straight-fit denim jeans',
    price: 4999, // $49.99 in cents
    category: 'men',
    subcategory: 'pants',
    sizes: ['30', '32', '34', '36'],
    colors: ['Blue', 'Black', 'Gray'],
    images: ['/images/men-jeans.jpg'],
    inStock: 40,
    isFeatured: false,
    tags: ['casual', 'denim'],
    rating: 4.6,
    numReviews: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  }
];

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    // Filter products by category if provided
    let filteredProducts = [...mockProducts];
    if (category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply pagination
    const limitNum = limit ? parseInt(limit, 10) : filteredProducts.length;
    const offsetNum = offset ? parseInt(offset, 10) : 0;

    const paginatedProducts = filteredProducts.slice(offsetNum, offsetNum + limitNum);

    return NextResponse.json({
      success: true,
      products: paginatedProducts,
      total: filteredProducts.length
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
    // In a real implementation, this would create a new product
    // For now, we'll just return an error since this is a mock API
    return NextResponse.json(
      {
        success: false,
        error: 'Creating products is not supported in demo mode'
      },
      { status: 405 } // Method not allowed
    );
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