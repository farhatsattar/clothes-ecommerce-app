import { Timestamp } from 'firebase/firestore';


// User interface based on data-model.md
export interface User {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  addresses?: Address[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Address interface for user profiles
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  isDefault?: boolean;
}

// Product interface based on data-model.md
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Price in smallest currency unit (e.g., cents)
  category: 'men' | 'women' | 'kids' | string;
  subcategory?: string;
  sizes: string[];
  colors: string[];
  images: string[]; // URLs to product images
  inStock: number;
  isFeatured?: boolean;
  tags?: string[];
  rating?: number; // Average customer rating (0-5)
  numReviews?: number; // Number of customer reviews
  createdAt: Timestamp | Date; // ✅ allow Firestore Timestamp
  updatedAt: Timestamp | Date; // ✅ allow Firestore Timestamp
  isActive: boolean;
}

// CartItem interface based on data-model.md
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
  // Extended with product details for display
  product?: Product;
}

// OrderItem interface based on data-model.md
export interface OrderItem {
  productId: string;
  name: string;
  priceAtTime: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  rating?: number;
  review?: string;

}
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type Order = OrderData;

// Order number system: customer-facing ID, not Firestore doc ID
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatusStored = 'processing' | 'completed' | 'cancelled';

/** Stored in top-level Firestore collection "orders". Doc ID is internal; use orderNumber for customers. */
export interface OrderRecord {
  orderNumber: string;
  userId: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatusStored;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address | null;
  notes?: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Order interface based on data-model.md
export interface OrderData {
  id?: string; // Firestore will generate ID
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address | null;
  notes?: string;
  paymentMethod: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ChatSession interface based on data-model.md
export interface ChatSession {
  id: string;
  userId?: string; // Reference to user (if authenticated)
  phoneNumber?: string; // WhatsApp phone number (if not registered)
  sessionId: string; // Session identifier from WhatsApp API
  messages: ChatMessage[];
  currentIntent: 'browsing' | 'viewing_product' | 'placing_order' | 'support';
  associatedOrderId?: string; // Reference to order if one was created from this session
  status: 'active' | 'ended' | 'converted_to_order';
  createdAt: Date;
  updatedAt: Date;
}

// ChatMessage interface for ChatSession
export interface ChatMessage {
  sender: 'user' | 'bot';
  message: string;
  timestamp: Date;
  type: 'text' | 'image' | 'order_confirmation' | string;
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Cart API Response
export interface CartResponse {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Product API Response
export interface ProductResponse {
  products: Product[];
  total: number;
}

// Order API Response
export interface OrderResponse {
  orders: OrderData[];
  total: number;
}