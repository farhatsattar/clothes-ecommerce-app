import { NextResponse } from 'next/server';
import { CartItem } from '@/types';

// In-memory cart for demo purposes
// In a real implementation, this would be stored in a database
let cart: CartItem[] = [];

export async function GET(request: Request) {
  try {
    return NextResponse.json({
      success: true,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0),
      itemCount: cart.reduce((count, item) => count + item.quantity, 0)
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

    if (!productId || !quantity || !selectedSize || !selectedColor) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: productId, quantity, selectedSize, or selectedColor'
        },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item =>
      item.productId === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      cart[existingItemIndex] = {
        ...cart[existingItemIndex],
        quantity: cart[existingItemIndex].quantity + quantity,
        updatedAt: new Date()
      };
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        id: `${productId}-${selectedSize}-${selectedColor}`,
        userId: userId || 'guest',
        productId,
        quantity,
        selectedSize,
        selectedColor,
        priceAtTime: 0, // This would be populated from product data in a real implementation
        createdAt: new Date(),
        updatedAt: new Date()
      };
      cart.push(newItem);
    }

    return NextResponse.json({
      success: true,
      item: cart[existingItemIndex !== -1 ? existingItemIndex : cart.length - 1],
      total: cart.reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0),
      itemCount: cart.reduce((count, item) => count + item.quantity, 0)
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
    const { itemId, quantity } = await request.json();

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: itemId or quantity'
        },
        { status: 400 }
      );
    }

    const itemIndex = cart.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item not found in cart'
        },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart[itemIndex] = {
        ...cart[itemIndex],
        quantity,
        updatedAt: new Date()
      };
    }

    return NextResponse.json({
      success: true,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0),
      itemCount: cart.reduce((count, item) => count + item.quantity, 0)
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
    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: itemId'
        },
        { status: 400 }
      );
    }

    const initialLength = cart.length;
    cart = cart.filter(item => item.id !== itemId);

    if (cart.length === initialLength) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item not found in cart'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0),
      itemCount: cart.reduce((count, item) => count + item.quantity, 0)
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