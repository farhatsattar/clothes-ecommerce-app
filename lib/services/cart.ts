import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { CartItem } from '@/types';
import { convertTimestamps } from '@/lib/utils/firestore';

// Cart service functions
export const getUserCart = async (userId: string): Promise<{ success: boolean; items: CartItem[]; error?: string }> => {
  try {
    const q = query(
      collection(db, `users/${userId}/cart`)
    );

    const snapshot = await getDocs(q);

    const items: CartItem[] = [];
    snapshot.forEach((doc) => {
      const data = convertTimestamps(doc.data());
      items.push({ id: doc.id, ...data } as CartItem);
    });

    return { success: true, items };
  } catch (error) {
    console.error(`Error getting user cart (${userId}):`, error);
    return { success: false, items: [], error: (error as Error).message };
  }
};

export const addItemToCart = async (userId: string, itemData: Omit<CartItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    // Check if item already exists in cart
    const cartRef = collection(db, `users/${userId}/cart`);
    const q = query(cartRef, where('productId', '==', itemData.productId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // Item already exists, update quantity
      const existingItem = snapshot.docs[0];
      const existingItemRef = existingItem.ref;
      const existingItemData = existingItem.data();

      await updateDoc(existingItemRef, {
        quantity: existingItemData.quantity + itemData.quantity,
        updatedAt: serverTimestamp()
      });

      return { success: true, id: existingItem.id };
    } else {
      // Item doesn't exist, create new
      const cartCollectionRef = collection(db, `users/${userId}/cart`);
      const newDocRef = doc(cartCollectionRef);
      await setDoc(newDocRef, {
        ...itemData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return { success: true, id: newDocRef.id };
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const updateCartItem = async (userId: string, itemId: string, updates: Partial<Omit<CartItem, 'id' | 'userId' | 'productId' | 'createdAt' | 'updatedAt'>>): Promise<{ success: boolean; error?: string }> => {
  try {
    const itemRef = doc(db, `users/${userId}/cart`, itemId);
    await updateDoc(itemRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error(`Error updating cart item (${itemId}) for user (${userId}):`, error);
    return { success: false, error: (error as Error).message };
  }
};

export const removeItemFromCart = async (userId: string, itemId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const itemRef = doc(db, `users/${userId}/cart`, itemId);
    await deleteDoc(itemRef);

    return { success: true };
  } catch (error) {
    console.error(`Error removing item from cart (${itemId}) for user (${userId}):`, error);
    return { success: false, error: (error as Error).message };
  }
};

export const clearUserCart = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const cartItems = await getUserCart(userId);
    if (!cartItems.success) {
      return { success: false, error: cartItems.error };
    }

    // Delete all items in the cart
    for (const item of cartItems.items) {
      await removeItemFromCart(userId, item.id);
    }

    return { success: true };
  } catch (error) {
    console.error(`Error clearing cart for user (${userId}):`, error);
    return { success: false, error: (error as Error).message };
  }
};

export const getCartItemCount = async (userId: string): Promise<{ success: boolean; count: number; error?: string }> => {
  try {
    const cart = await getUserCart(userId);
    if (!cart.success) {
      return { success: false, count: 0, error: cart.error };
    }

    const count = cart.items.reduce((total, item) => total + item.quantity, 0);
    return { success: true, count };
  } catch (error) {
    console.error(`Error getting cart item count for user (${userId}):`, error);
    return { success: false, count: 0, error: (error as Error).message };
  }
};