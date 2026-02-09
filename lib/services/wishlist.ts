import {
  doc,
  getDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Product } from '@/types';

export interface WishlistItem {
  productId: string;
  addedAt: Date;
}

export interface Wishlist {
  items: WishlistItem[];
  updatedAt: Date;
}

/**
 * Gets the user's wishlist from Firestore
 */
export const getUserWishlist = async (userId: string): Promise<Wishlist> => {
  try {
    const wishlistRef = doc(db, 'users', userId, 'wishlist', 'items');
    const wishlistSnapshot = await getDoc(wishlistRef);

    if (!wishlistSnapshot.exists()) {
      return {
        items: [],
        updatedAt: new Date()
      };
    }

    const wishlistData = wishlistSnapshot.data();
    const items = wishlistData.items || [];

    // Convert timestamps to dates
    const itemsWithDates = items.map((item: any) => ({
      ...item,
      addedAt: item.addedAt instanceof Timestamp ? item.addedAt.toDate() : item.addedAt
    }));

    return {
      items: itemsWithDates,
      updatedAt: wishlistData.updatedAt instanceof Timestamp
        ? wishlistData.updatedAt.toDate()
        : wishlistData.updatedAt || new Date()
    };
  } catch (error) {
    console.error('Error getting user wishlist:', error);
    throw error;
  }
};

/**
 * Adds a product to the user's wishlist in Firestore
 */
export const addToWishlist = async (userId: string, productId: string): Promise<void> => {
  try {
    const wishlistRef = doc(db, 'users', userId, 'wishlist', 'items');

    // Get current wishlist
    const wishlistSnapshot = await getDoc(wishlistRef);
    const currentWishlist = wishlistSnapshot.exists() ? wishlistSnapshot.data() : { items: [] };
    const currentItems = currentWishlist.items || [];

    // Check if product is already in wishlist
    const alreadyExists = currentItems.some((item: any) => item.productId === productId);

    if (alreadyExists) {
      // Item already in wishlist, nothing to do
      return;
    }

    // Add item to wishlist
    const newItem = {
      productId,
      addedAt: new Date()
    };

    await setDoc(wishlistRef, {
      items: arrayUnion(newItem),
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

/**
 * Removes a product from the user's wishlist in Firestore
 */
export const removeFromWishlist = async (userId: string, productId: string): Promise<void> => {
  try {
    const wishlistRef = doc(db, 'users', userId, 'wishlist', 'items');

    // Remove item from wishlist
    const itemToRemove = { productId }; // We only need the productId to remove

    await setDoc(wishlistRef, {
      items: arrayRemove(itemToRemove),
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

/**
 * Checks if a product is in the user's wishlist
 */
export const isInWishlist = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const wishlist = await getUserWishlist(userId);
    return wishlist.items.some(item => item.productId === productId);
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    return false;
  }
};

/**
 * Gets all wishlist items with full product details
 */
export const getWishlistWithProducts = async (userId: string): Promise<Product[]> => {
  try {
    const wishlist = await getUserWishlist(userId);

    // Fetch product details for each wishlist item
    const productPromises = wishlist.items.map(async (item) => {
      // Import dynamically to avoid circular dependencies
      const { getProductById } = await import('./products');
      return getProductById(item.productId);
    });

    const products = await Promise.all(productPromises);

    // Filter out any null products (in case some were deleted)
    return products.filter(product => product !== null) as Product[];
  } catch (error) {
    console.error('Error getting wishlist with products:', error);
    throw error;
  }
};