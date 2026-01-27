import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './config';

// ADD PRODUCT
export const addProduct = async (data: any) => {
  const docRef = await addDoc(collection(db, 'products'), {
    ...data,
    createdAt: new Date(),
  });
  return docRef.id;
};

// GET ALL PRODUCTS
export const getProducts = async () => {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// GET PRODUCT BY ID
export const getProductById = async (id: string) => {
  const { doc, getDoc } = await import('firebase/firestore');
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  } else {
    return null;
  }
};

// DELETE PRODUCT
export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, 'products', id));
};
