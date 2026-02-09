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
  getUserCart,
  addToCart as addToFirestoreCart,
  updateCartItem as updateFirestoreCartItem,
  removeFromCart as removeFromFirestoreCart,
  clearCart as clearFirestoreCart,
} from '@/lib/services/cart';

/* ================= TYPES ================= */

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  priceAtTime: number;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

interface CartContextType {
  cart: CartState;
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

/* ================= HELPERS ================= */

const calculateTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0);

/* ================= STATE ================= */

const initialState: CartState = {
  items: [],
  total: 0,
};

/* ================= ACTIONS ================= */

type CartAction =
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

/* ================= REDUCER ================= */

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_CART':
      return { items: action.payload, total: calculateTotal(action.payload) };

    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        item =>
          item.productId === action.payload.productId &&
          item.selectedSize === action.payload.selectedSize &&
          item.selectedColor === action.payload.selectedColor
      );

      let updatedItems = [...state.items];

      if (existingIndex !== -1) {
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + action.payload.quantity,
        };
      } else {
        updatedItems.push(action.payload);
      }

      return { items: updatedItems, total: calculateTotal(updatedItems) };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return { items: updatedItems, total: calculateTotal(updatedItems) };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.itemId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return { items: updatedItems, total: calculateTotal(updatedItems) };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0 };

    default:
      return state;
  }
};

/* ================= CONTEXT ================= */

const CartContext = createContext<CartContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const { user, loading: authLoading } = useAuth();

  /* 🔹 LOAD CART */
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        try {
          dispatch({ type: 'SET_CART', payload: JSON.parse(storedCart) });
        } catch (err) {
          console.error('Cart parse error:', err);
        }
      }
      return;
    }

    const loadCart = async () => {
      try {
        const { items } = await getUserCart(user.uid);
        dispatch({ type: 'SET_CART', payload: items as CartItem[] });
      } catch (err) {
        console.error(err);
      }
    };

    loadCart();
  }, [user, authLoading]);

  /* 🔹 SAVE GUEST CART (FIXED ✅) */
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cart.items));
    }
  }, [cart.items, user]);

  /* ================= ACTIONS ================= */

  const addToCart = (product: Product, quantity = 1, size = 'M', color = 'Default') => {
    if (authLoading) return;

    const cartItem: CartItem = {
      id: `${product.id}-${size}-${color}-${Date.now()}`,
      userId: user?.uid || '',
      productId: product.id,
      quantity,
      selectedSize: size,
      selectedColor: color,
      priceAtTime: product.price,
      createdAt: new Date(),
      updatedAt: new Date(),
      product,
    };

    dispatch({ type: 'ADD_ITEM', payload: cartItem });

    if (user) {
      addToFirestoreCart(user.uid, {
        userId: cartItem.userId,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        selectedSize: cartItem.selectedSize,
        selectedColor: cartItem.selectedColor,
        priceAtTime: cartItem.priceAtTime,
      }).catch(console.error);
    }
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });

    if (user) {
      removeFromFirestoreCart(user.uid, itemId).catch(console.error);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(itemId);

    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });

    if (user) {
      updateFirestoreCartItem(user.uid, itemId, quantity).catch(console.error);
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });

    if (user) {
      clearFirestoreCart(user.uid).catch(console.error);
    } else {
      localStorage.removeItem('cart');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
