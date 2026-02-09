import {
  collection,
  collectionGroup,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Order } from '@/types';
import { convertTimestamps } from '@/lib/utils/firestore';

// Order service functions
export const createOrder = async (userId: string, orderData: Omit<Order, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const docRef = await addDoc(collection(db, `users/${userId}/orders`), {
      ...orderData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const getUserOrders = async (userId: string, constraints: QueryConstraint[] = []): Promise<{ success: boolean; orders: Order[]; error?: string }> => {
  try {
    const q = query(collection(db, `users/${userId}/orders`), ...constraints);
    const snapshot = await getDocs(q);

    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      const data = convertTimestamps(doc.data());
      orders.push({ id: doc.id, userId, ...data } as Order);
    });

    return { success: true, orders };
  } catch (error) {
    console.error(`Error getting orders for user (${userId}):`, error);
    return { success: false, orders: [], error: (error as Error).message };
  }
};

export const getAllUserOrders = async (userId: string): Promise<{ success: boolean; orders: Order[]; error?: string }> => {
  return await getUserOrders(userId, [orderBy('createdAt', 'desc')]);
};

/**
 * Fetches ALL orders across all users (admin). Uses Firestore collectionGroup('orders').
 * Requires a composite index on collection group "orders" for createdAt desc.
 */
export const getAllOrders = async (): Promise<{ success: boolean; orders: Order[]; error?: string }> => {
  try {
    const q = query(
      collectionGroup(db, 'orders'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);

    const orders: Order[] = [];
    snapshot.forEach((docSnap) => {
      const userId = docSnap.ref.parent.parent?.id ?? '';
      const data = convertTimestamps(docSnap.data());
      orders.push({ id: docSnap.id, userId, ...data } as Order);
    });

    return { success: true, orders };
  } catch (error) {
    console.error('Error fetching all orders (collectionGroup):', error);
    return { success: false, orders: [], error: (error as Error).message };
  }
};

export const getOrderById = async (userId: string, orderId: string): Promise<{ success: boolean; order?: Order; error?: string }> => {
  try {
    const docRef = doc(db, `users/${userId}/orders`, orderId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return { success: false, error: 'Order not found' };
    }

    const data = convertTimestamps(snapshot.data());
    const order = { id: snapshot.id, userId, ...data } as Order;

    return { success: true, order };
  } catch (error) {
    console.error(`Error getting order by ID (${orderId}) for user (${userId}):`, error);
    return { success: false, error: (error as Error).message };
  }
};

export const updateOrderStatus = async (userId: string, orderId: string, status: Order['status']): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, `users/${userId}/orders`, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error(`Error updating order status for order (${orderId}) of user (${userId}):`, error);
    return { success: false, error: (error as Error).message };
  }
};

export const getOrdersByStatus = async (userId: string, status: Order['status']): Promise<{ success: boolean; orders: Order[]; error?: string }> => {
  try {
    const q = query(
      collection(db, `users/${userId}/orders`),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      const data = convertTimestamps(doc.data());
      orders.push({ id: doc.id, userId, ...data } as Order);
    });

    return { success: true, orders };
  } catch (error) {
    console.error(`Error getting orders by status (${status}) for user (${userId}):`, error);
    return { success: false, orders: [], error: (error as Error).message };
  }
};

export const getRecentOrders = async (userId: string, limitCount: number = 5): Promise<{ success: boolean; orders: Order[]; error?: string }> => {
  try {
    const q = query(
      collection(db, `users/${userId}/orders`),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);

    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      const data = convertTimestamps(doc.data());
      orders.push({ id: doc.id, userId, ...data } as Order);
    });

    return { success: true, orders };
  } catch (error) {
    console.error(`Error getting recent orders for user (${userId}):`, error);
    return { success: false, orders: [], error: (error as Error).message };
  }
};