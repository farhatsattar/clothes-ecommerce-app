'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';
import { Product } from '@/types';
import { useAuth } from '@/lib/context/auth-context';
import {
  getUserWishlist,
  addToWishlist as addToWishlistService,
  removeFromWishlist as removeFromWishlistService,
  isInWishlist,
  getWishlistWithProducts
} from '@/lib/services/wishlist';

/* ================= TYPES ================= */

export interface WishlistItem {
  productId: string;
  addedAt: Date;
}

export interface WishlistState {
  items: WishlistItem[];
  products: Product[];
  loading: boolean;
}

interface WishlistContextType {
  wishlist: WishlistState;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => void;
}

/* ================= STATE ================= */

const initialState: WishlistState = {
  items: [],
  products: [],
  loading: false,
};

/* ================= ACTIONS ================= */

type WishlistAction =
  | { type: 'SET_WISHLIST'; payload: { items: WishlistItem[]; products: Product[] } }
  | { type: 'ADD_TO_WISHLIST'; payload: { item: WishlistItem; product: Product } }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

/* ================= REDUCER ================= */

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'SET_WISHLIST':
      return {
        ...state,
        items: action.payload.items,
        products: action.payload.products,
        loading: false
      };

    case 'ADD_TO_WISHLIST': {
      // Check if item already exists
      const exists = state.items.some(item => item.productId === action.payload.item.productId);

      if (exists) {
        return state;
      }

      return {
        ...state,
        items: [...state.items, action.payload.item],
        products: [...state.products, action.payload.product],
      };
    }

    case 'REMOVE_FROM_WISHLIST': {
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload),
        products: state.products.filter(product => product.id !== action.payload),
      };
    }

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    default:
      return state;
  }
};

/* ================= CONTEXT ================= */

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, dispatch] = useReducer(wishlistReducer, initialState);
  const { user, loading: authLoading } = useAuth();

  /* 🔹 LOAD WISHLIST */
  useEffect(() => {
    if (authLoading || !user) return;

    const loadWishlist = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const wishlistItems = await getUserWishlist(user.uid);
        const wishlistProducts = await getWishlistWithProducts(user.uid);

        dispatch({
          type: 'SET_WISHLIST',
          payload: {
            items: wishlistItems.items,
            products: wishlistProducts
          }
        });
      } catch (err) {
        console.error('Error loading wishlist:', err);
        dispatch({ type: 'SET_WISHLIST', payload: { items: [], products: [] } });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadWishlist();
  }, [user, authLoading]);

  /* ================= ACTIONS ================= */

  const addToWishlist = async (productId: string) => {
    if (!user) return;

    try {
      // Add to Firestore
      await addToWishlistService(user.uid, productId);

      // Update local state
      let product = wishlist.products.find(p => p.id === productId);
      if (!product) {
        const productService = (await import('@/lib/services/products')).getProductById(productId);
        const fetchedProduct = await productService;
        if (!fetchedProduct) return; // Exit if product not found
        product = fetchedProduct;
      }

      dispatch({
        type: 'ADD_TO_WISHLIST',
        payload: {
          item: {
            productId,
            addedAt: new Date()
          },
          product
        }
      });
    } catch (err) {
      console.error('Error adding to wishlist:', err);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      // Remove from Firestore
      await removeFromWishlistService(user.uid, productId);

      // Update local state
      dispatch({
        type: 'REMOVE_FROM_WISHLIST',
        payload: productId
      });
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  const checkIfInWishlist = (productId: string): boolean => {
    return wishlist.items.some(item => item.productId === productId);
  };

  const refreshWishlist = async () => {
    if (!user) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const wishlistItems = await getUserWishlist(user.uid);
      const wishlistProducts = await getWishlistWithProducts(user.uid);

      dispatch({
        type: 'SET_WISHLIST',
        payload: {
          items: wishlistItems.items,
          products: wishlistProducts
        }
      });
    } catch (err) {
      console.error('Error refreshing wishlist:', err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist: checkIfInWishlist,
        refreshWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};