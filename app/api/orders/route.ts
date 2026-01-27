// import { NextResponse } from 'next/server';
// import { Order, OrderItem } from '@/types';
// import { db } from '@/firebase/config'; // make sure you have firebase initialized
// import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';

// // GET - fetch orders for a user
// export async function GET(request: Request) {
//   try {
//     // In real app, get userId from auth token or session
//     const userId = 'demo_user_id';

//     const ordersRef = collection(db, 'orders');
//     const q = query(ordersRef, where('userId', '==', userId));
//     const snapshot = await getDocs(q);

//     const orders: Order[] = snapshot.docs.map(doc => doc.data() as Order);
//     const total = orders.length;

//     return NextResponse.json({ success: true, orders, total });
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch orders', orders: [], total: 0 },
//       { status: 500 }
//     );
//   }
// }

// // POST - create a new order
// export async function POST(request: Request) {
//   try {
//     const { userId, items, shippingAddress, billingAddress, paymentMethod, notes } = await request.json();

//     if (!userId || !items || !shippingAddress || !paymentMethod) {
//       return NextResponse.json(
//         { success: false, error: 'Missing required fields: userId, items, shippingAddress, or paymentMethod' },
//         { status: 400 }
//       );
//     }

//     if (paymentMethod !== 'COD') {
//       return NextResponse.json(
//         { success: false, error: 'Invalid payment method. Only COD is supported.' },
//         { status: 400 }
//       );
//     }

//     const totalAmount = items.reduce((sum: number, item: OrderItem) => sum + item.priceAtTime * item.quantity, 0);

//    const newOrder: Omit<Order, 'id'> = {
//     userId: userId, // string
//     items: items,   // OrderItem[]
//     totalAmount: totalAmount, // number
//     status: 'pending' ,
//     shippingAddress: shippingAddress, // string
//     paymentMethod: paymentMethod, // string
//     createdAt: new Date(),
//     updatedAt: new Date(),
// };


//     // Generate order id
//     const orderId = `order_${Date.now()}`;

//     const fullOrder: Order = { id: orderId, ...newOrder };

//     // Save to Firestore
//     await setDoc(doc(db, 'orders', fullOrder.id), fullOrder);

//     return NextResponse.json({ success: true, order: fullOrder });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import { OrderData, OrderItem } from '@/types';
import { db } from '@/firebase/config';
import { collection, doc, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

// GET - fetch orders for a user
export async function GET(request: Request) {
  try {
    // 🔹 In a real app, get userId from auth token/session
    const userId = 'demo_user_id';

    // Firestore query: fetch orders from subcollection users/{userId}/orders
    const ordersRef = collection(db, 'users', userId, 'orders');
    const snapshot = await getDocs(ordersRef);

    const orders: OrderData[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<OrderData, 'id'>)
    }));

    const total = orders.length;

    return NextResponse.json({ success: true, orders, total });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders', orders: [], total: 0 },
      { status: 500 }
    );
  }
}

// POST - create a new order
export async function POST(request: Request) {
  try {
    const { userId, items, shippingAddress, billingAddress, paymentMethod, notes } = await request.json();

    if (!userId || !items || items.length === 0 || !shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields or cart is empty' },
        { status: 400 }
      );
    }

    if (paymentMethod !== 'COD') {
      return NextResponse.json(
        { success: false, error: 'Invalid payment method. Only COD is supported.' },
        { status: 400 }
      );
    }

    const totalAmount = items.reduce((sum: number, item: OrderItem) => sum + item.priceAtTime * item.quantity, 0);

    // ✅ Order object
    const newOrder: Omit<OrderData, 'id'> = {
      userId,
      items,
      totalAmount,
      status: 'pending',
      shippingAddress: shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save order to Firestore under user subcollection
    const docRef = await addDoc(collection(db, 'users', userId, 'orders'), {
      ...newOrder,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const fullOrder: OrderData = { id: docRef.id, ...newOrder };
    return NextResponse.json({ success: true, order: fullOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}
