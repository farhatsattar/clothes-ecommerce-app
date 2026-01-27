import { NextRequest, NextResponse } from 'next/server';
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
    rating: 4.5,
    numReviews: 12,
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
    rating: 4.7,
    numReviews: 8,
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
    isFeatured: false,
    tags: ['winter', 'hoodie'],
    rating: 4.3,
    numReviews: 5,
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find product by ID
    const product = mockProducts.find(p => p.id === id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // In a real implementation, this would update the product
    // For now, we'll just return an error since this is a mock API
    return NextResponse.json(
      {
        success: false,
        error: 'Updating products is not supported in demo mode'
      },
      { status: 405 } // Method not allowed
    );
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update product'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // In a real implementation, this would delete the product
    // For now, we'll just return an error since this is a mock API
    return NextResponse.json(
      {
        success: false,
        error: 'Deleting products is not supported in demo mode'
      },
      { status: 405 } // Method not allowed
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete product'
      },
      { status: 500 }
    );
  }
}