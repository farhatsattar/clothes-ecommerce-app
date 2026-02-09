import { collectionGroup, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from './config';
import { Order } from '@/types';
import { convertTimestamps } from '@/lib/utils/firestore';

/**
 * Fetches all orders across all users (admin). Uses collectionGroup('orders').
 * Requires a COLLECTION GROUP index: orders, field createdAt DESCENDING.
 * Deploy with: firebase deploy --only firestore:indexes (see firestore.indexes.json)
 */
export const getAllOrdersForAdmin = async (): Promise<Order[]> => {
  const q = query(
    collectionGroup(db, 'orders'),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const userId = docSnap.ref.parent.parent?.id ?? '';
    const data = convertTimestamps(docSnap.data());
    return { id: docSnap.id, userId, ...data } as Order;
  });
};
