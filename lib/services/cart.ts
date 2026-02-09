import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { CartItem, CartResponse } from '@/types';
import { getProductById } from './products';

/**
 * Gets the user's cart from Firestore
 */
export const getUserCart = async (userId: string): Promise<CartResponse> => {
  try {
    const cartRef = doc(db, 'users', userId, 'cart', 'items');
    const cartSnapshot = await getDoc(cartRef);

    if (!cartSnapshot.exists()) {
      return {
        items: [],
        total: 0,
        itemCount: 0
      };
    }

    const cartData = cartSnapshot.data();
    let items = cartData.items || [];

    // Fetch product details for each item in the cart
    const itemsWithProducts = await Promise.all(items.map(async (item: any) => {
      if (!item.product) {
        // If product details are not stored in the cart item, fetch them
        const product = await getProductById(item.productId);
        return {
          ...item,
          product: product || undefined
        };
      }
      return item;
    }));

    // Calculate total and item count
    const total = itemsWithProducts.reduce((sum: number, item: any) => sum + (item.priceAtTime || 0) * (item.quantity || 0), 0);
    const itemCount = itemsWithProducts.reduce((count: number, item: any) => count + (item.quantity || 0), 0);

    return {
      items: itemsWithProducts,
      total,
      itemCount
    };
  } catch (error) {
    console.error('Error getting user cart:', error);
    throw error;
  }
};

/**
 * Adds an item to the user's cart in Firestore
 */
export const addToCart = async (
  userId: string,
  cartItem: Omit<CartItem, 'id' | 'createdAt' | 'updatedAt' | 'product'>
): Promise<CartResponse> => {
  try {
    const cartRef = doc(db, 'users', userId, 'cart', 'items');

    // Get current cart
    const cartSnapshot = await getDoc(cartRef);
    const currentCart = cartSnapshot.exists() ? cartSnapshot.data() : { items: [] };
    const currentItems = currentCart.items || [];

    // Check if item already exists in cart
    const existingItemIndex = currentItems.findIndex((item: any) =>
      item.productId === cartItem.productId &&
      item.selectedSize === cartItem.selectedSize &&
      item.selectedColor === cartItem.selectedColor
    );

    let updatedItems = [...currentItems];

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + (cartItem.quantity || 1),
        updatedAt: new Date()
      };
    } else {
      // Fetch product details to get the price
      const product = await getProductById(cartItem.productId);

      // Add new item to cart
      const newItem = {
        ...cartItem,
        id: `${cartItem.productId}-${cartItem.selectedSize}-${cartItem.selectedColor}`,
        priceAtTime: product ? product.price : 0, // Use product price or default to 0
        createdAt: new Date(),
        updatedAt: new Date(),
        product: product || undefined // Add product details if available
      };
      updatedItems.push(newItem);
    }

    // Fetch product details for each updated item if needed
    const updatedItemsWithProducts = await Promise.all(updatedItems.map(async (item: any) => {
      if (!item.product) {
        const product = await getProductById(item.productId);
        return {
          ...item,
          product: product || undefined
        };
      }
      return item;
    }));

    // Update cart in Firestore
    await setDoc(cartRef, {
      items: updatedItems,
      updatedAt: serverTimestamp()
    });

    // Calculate total and item count
    const total = updatedItemsWithProducts.reduce((sum: number, item: any) => sum + (item.priceAtTime || 0) * (item.quantity || 0), 0);
    const itemCount = updatedItemsWithProducts.reduce((count: number, item: any) => count + (item.quantity || 0), 0);

    return {
      items: updatedItemsWithProducts,
      total,
      itemCount
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

/**
 * Updates an item in the user's cart in Firestore
 */
export const updateCartItem = async (
  userId: string,
  itemId: string,
  quantity: number
): Promise<CartResponse> => {
  try {
    const cartRef = doc(db, 'users', userId, 'cart', 'items');

    // Get current cart
    const cartSnapshot = await getDoc(cartRef);
    if (!cartSnapshot.exists()) {
      throw new Error('Cart not found');
    }

    const currentCart = cartSnapshot.data();
    const currentItems = currentCart.items || [];

    // Find the item to update
    const itemIndex = currentItems.findIndex((item: any) => item.id === itemId);

    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    let updatedItems = [...currentItems];

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      updatedItems = updatedItems.filter((_, index) => index !== itemIndex);
    } else {
      // Update quantity
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity,
        updatedAt: new Date()
      };
    }

    // Fetch product details for each updated item if needed
    const updatedItemsWithProducts = await Promise.all(updatedItems.map(async (item: any) => {
      if (!item.product) {
        const product = await getProductById(item.productId);
        return {
          ...item,
          product: product || undefined
        };
      }
      return item;
    }));

    // Update cart in Firestore
    await setDoc(cartRef, {
      items: updatedItems,
      updatedAt: serverTimestamp()
    });

    // Calculate total and item count
    const total = updatedItemsWithProducts.reduce((sum: number, item: any) => sum + (item.priceAtTime || 0) * (item.quantity || 0), 0);
    const itemCount = updatedItemsWithProducts.reduce((count: number, item: any) => count + (item.quantity || 0), 0);

    return {
      items: updatedItemsWithProducts,
      total,
      itemCount
    };
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

/**
 * Removes an item from the user's cart in Firestore
 */
export const removeFromCart = async (
  userId: string,
  itemId: string
): Promise<CartResponse> => {
  try {
    const cartRef = doc(db, 'users', userId, 'cart', 'items');

    // Get current cart
    const cartSnapshot = await getDoc(cartRef);
    if (!cartSnapshot.exists()) {
      throw new Error('Cart not found');
    }

    const currentCart = cartSnapshot.data();
    const currentItems = currentCart.items || [];

    // Filter out the item to remove
    const updatedItems = currentItems.filter((item: any) => item.id !== itemId);

    if (updatedItems.length === currentItems.length) {
      throw new Error('Item not found in cart');
    }

    // Fetch product details for each remaining item if needed
    const updatedItemsWithProducts = await Promise.all(updatedItems.map(async (item: any) => {
      if (!item.product) {
        const product = await getProductById(item.productId);
        return {
          ...item,
          product: product || undefined
        };
      }
      return item;
    }));

    // Update cart in Firestore
    await setDoc(cartRef, {
      items: updatedItems,
      updatedAt: serverTimestamp()
    });

    // Calculate total and item count
    const total = updatedItemsWithProducts.reduce((sum: number, item: any) => sum + (item.priceAtTime || 0) * (item.quantity || 0), 0);
    const itemCount = updatedItemsWithProducts.reduce((count: number, item: any) => count + (item.quantity || 0), 0);

    return {
      items: updatedItemsWithProducts,
      total,
      itemCount
    };
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

/**
 * Clears the user's cart in Firestore
 */
export const clearCart = async (userId: string): Promise<void> => {
  try {
    const cartRef = doc(db, 'users', userId, 'cart', 'items');

    // Set cart to empty
    await setDoc(cartRef, {
      items: [],
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};