// import {
//   addDoc,
//   collection,
//   getDocs,
//   query,
//   doc,
//   getDoc,
//   serverTimestamp,
//   Timestamp,
// } from 'firebase/firestore';
// import { db } from './config';
// import { Order, OrderItem, Address } from '@/types';

// // -------------------- TYPES --------------------
// export interface CreateOrderData {
//   items: OrderItem[];
//   shippingAddress: Address;
//   billingAddress?: Address;
//   notes?: string;
//   paymentMethod: string;
//   totalAmount: number;
//   status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
// }

// // -------------------- CREATE ORDER --------------------
// export const createOrder = async (
//   userId: string,
//   orderData: CreateOrderData
// ) => {
//   try {
//     const docRef = await addDoc(collection(db, 'users', userId, 'orders'), {
//       ...orderData,
//       status: orderData.status || 'pending',
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });

//     return { success: true, id: docRef.id };
//   } catch (error) {
//     console.error('Error creating order:', error);
//     return { success: false, error };
//   }
// };

// // -------------------- GET USER ORDERS --------------------
// export const getUserOrders = async (userId: string) => {
//   try {
//     const q = query(collection(db, 'users', userId, 'orders'));
//     const snapshot = await getDocs(q);

//     const orders: Order[] = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     } as Order));

//     return { success: true, orders };
//   } catch (error) {
//     console.error('Error fetching user orders:', error);
//     return { success: false, orders: [], error };
//   }
// };


// // -------------------- GET SINGLE ORDER --------------------
// export const getOrderById = async (
//   userId: string,
//   orderId: string
// ): Promise<{ success: boolean; order: Order | null; error?: unknown }> => {
//   try {
//     const orderRef = doc(db, 'users', userId, 'orders', orderId);
//     const docSnap = await getDoc(orderRef);

//     if (!docSnap.exists()) {
//       return { success: false, order: null };
//     }

//     return {
//       success: true,
//       order: {
//         id: docSnap.id,
//         ...(docSnap.data() as Omit<Order, 'id'>),
//       },
//     };
//   } catch (error) {
//     console.error('Error fetching order by ID:', error);
//     return { success: false, order: null, error };
//   }
// };

import {
  addDoc,
  collection,
  getDocs,
  query,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Order, OrderItem, Address } from '@/types';

// -------------------- TYPES --------------------
export interface CreateOrderData {
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  notes?: string;
  paymentMethod: string;
  totalAmount: number;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

// -------------------- CREATE ORDER --------------------
export const createOrder = async (
  userId: string,
  orderData: CreateOrderData
): Promise<{ success: boolean; id?: string; error?: unknown }> => {
  try {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const docRef = await addDoc(
      collection(db, 'users', userId, 'orders'), // ✅ RULE-COMPATIBLE PATH
      {
        ...orderData,
        status: orderData.status ?? 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error };
  }
};

// -------------------- GET USER ORDERS --------------------
export const getUserOrders = async (
  userId: string
): Promise<{ success: boolean; orders: Order[]; error?: unknown }> => {
  try {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const q = query(collection(db, 'users', userId, 'orders'));
    const snapshot = await getDocs(q);

    const orders: Order[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Order, 'id'>),
    }));

    return { success: true, orders };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return { success: false, orders: [], error };
  }
};

// -------------------- GET SINGLE ORDER --------------------
export const getOrderById = async (
  userId: string,
  orderId: string
): Promise<{ success: boolean; order: Order | null; error?: unknown }> => {
  try {
    if (!userId || !orderId) {
      throw new Error('Missing userId or orderId');
    }

    const orderRef = doc(db, 'users', userId, 'orders', orderId);
    const docSnap = await getDoc(orderRef);

    if (!docSnap.exists()) {
      return { success: false, order: null };
    }

    return {
      success: true,
      order: {
        id: docSnap.id,
        ...(docSnap.data() as Omit<Order, 'id'>),
      },
    };
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return { success: false, order: null, error };
  }
};
