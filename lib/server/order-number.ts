/**
 * Server-only: atomic order number generation and order creation in Firestore.
 * Uses a transaction to avoid duplicate order numbers under concurrency.
 */

import type { OrderItem, Address } from '@/types';
import type { Firestore } from 'firebase-admin/firestore';

const COUNTER_COLLECTION = 'counters';
const COUNTER_DOC_ID = 'orderNumber';
const COUNTER_FIELD = 'value';
const ORDER_NUMBER_PREFIX = 'ORD-';
const ORDERS_COLLECTION = 'orders';

/** Minimum numeric part of order number (e.g. ORD-10001). */
const ORDER_NUMBER_START = 10001;

export interface CreateOrderInput {
  userId: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'processing' | 'completed' | 'cancelled';
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address | null;
  notes?: string;
  paymentMethod: string;
}

export interface CreateOrderWithNumberResult {
  success: true;
  orderNumber: string;
}

export interface CreateOrderWithNumberError {
  success: false;
  error: string;
}

/**
 * Increments the order counter and creates an order document in a single transaction.
 * Returns only the customer-facing orderNumber; callers must not expose Firestore doc ID.
 */
export async function createOrderWithNumber(
  db: Firestore,
  input: CreateOrderInput
): Promise<CreateOrderWithNumberResult | CreateOrderWithNumberError> {
  try {
    const counterRef = db.collection(COUNTER_COLLECTION).doc(COUNTER_DOC_ID);
    const ordersRef = db.collection(ORDERS_COLLECTION);

    const result = await db.runTransaction(async (transaction) => {
      const counterSnap = await transaction.get(counterRef);
      const nextValue = counterSnap.exists
        ? (counterSnap.data()?.[COUNTER_FIELD] as number) + 1
        : ORDER_NUMBER_START;

      transaction.set(counterRef, { [COUNTER_FIELD]: nextValue });

      const orderNumber = `${ORDER_NUMBER_PREFIX}${nextValue}`;
      const now = new Date();

      const orderData = {
        orderNumber,
        userId: input.userId,
        totalAmount: input.totalAmount,
        paymentStatus: input.paymentStatus,
        orderStatus: input.orderStatus,
        items: input.items,
        shippingAddress: input.shippingAddress,
        billingAddress: input.billingAddress ?? input.shippingAddress,
        notes: input.notes ?? '',
        paymentMethod: input.paymentMethod,
        createdAt: now,
        updatedAt: now,
      };

      const newOrderRef = ordersRef.doc();
      transaction.set(newOrderRef, orderData);

      return { orderNumber };
    });

    return { success: true, orderNumber: result.orderNumber };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('createOrderWithNumber error:', message);
    return { success: false, error: message };
  }
}
