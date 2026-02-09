import { NextResponse } from 'next/server';
import { CartItem } from '@/types';
import {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart
} from '@/lib/services/cart';

export async function GET(request: Request) {
  try {
    // Extract user ID from headers or query parameters
    // In a real app, this would come from authentication
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required to access cart'
        },
        { status: 400 }
      );
    }

    const cartData = await getUserCart(userId);

    return NextResponse.json({
      success: true,
      ...cartData
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cart',
        items: [],
        total: 0,
        itemCount: 0
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { productId, quantity, selectedSize, selectedColor, userId } = await request.json();

    if (!productId || !quantity || !selectedSize || !selectedColor || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: productId, quantity, selectedSize, selectedColor, or userId'
        },
        { status: 400 }
      );
    }

    const cartData = await addToCart(userId, {
      userId,
      productId,
      quantity,
      selectedSize,
      selectedColor,
      priceAtTime: 0, // This would be populated from product data in a real implementation
    });

    return NextResponse.json({
      success: true,
      ...cartData
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add item to cart'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { itemId, quantity, userId } = await request.json();

    if (!itemId || quantity === undefined || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: itemId, quantity, or userId'
        },
        { status: 400 }
      );
    }

    const cartData = await updateCartItem(userId, itemId, quantity);

    return NextResponse.json({
      success: true,
      ...cartData
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update cart'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { itemId, userId } = await request.json();

    if (!itemId || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: itemId or userId'
        },
        { status: 400 }
      );
    }

    const cartData = await removeFromCart(userId, itemId);

    return NextResponse.json({
      success: true,
      ...cartData
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to remove item from cart'
      },
      { status: 500 }
    );
  }
}