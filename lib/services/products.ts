import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Product } from '@/types';
import { convertTimestamps, getDocumentsWithConversion, addDocumentWithTimestamps, updateDocumentWithTimestamp } from '@/lib/utils/firestore';

// Product service functions
export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const getAllProducts = async (constraints: QueryConstraint[] = []): Promise<{ success: boolean; products: Product[]; error?: string }> => {
  try {
    const q = query(collection(db, 'products'), ...constraints);
    const snapshot = await getDocs(q);

    const products: Product[] = [];
    snapshot.forEach((doc) => {
      const data = convertTimestamps(doc.data());
      products.push({ id: doc.id, ...data } as Product);
    });

    return { success: true, products };
  } catch (error) {
    console.error('Error getting all products:', error);
    return { success: false, products: [], error: (error as Error).message };
  }
};

export const getActiveProducts = async (): Promise<{ success: boolean; products: Product[]; error?: string }> => {
  return await getAllProducts([where('isActive', '==', true), orderBy('createdAt', 'desc')]);
};

export const getProductById = async (id: string): Promise<{ success: boolean; product?: Product; error?: string }> => {
  try {
    const docRef = doc(db, 'products', id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return { success: false, error: 'Product not found' };
    }

    const data = convertTimestamps(snapshot.data());
    const product = { id: snapshot.id, ...data } as Product;

    return { success: true, product };
  } catch (error) {
    console.error(`Error getting product by ID (${id}):`, error);
    return { success: false, error: (error as Error).message };
  }
};

export const getProductsByCategory = async (category: string): Promise<{ success: boolean; products: Product[]; error?: string }> => {
  try {
    const q = query(
      collection(db, 'products'),
      where('category', '==', category),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    const products: Product[] = [];
    snapshot.forEach((doc) => {
      const data = convertTimestamps(doc.data());
      products.push({ id: doc.id, ...data } as Product);
    });

    return { success: true, products };
  } catch (error) {
    console.error(`Error getting products by category (${category}):`, error);
    return { success: false, products: [], error: (error as Error).message };
  }
};

export const getFeaturedProducts = async (): Promise<{ success: boolean; products: Product[]; error?: string }> => {
  try {
    const q = query(
      collection(db, 'products'),
      where('isFeatured', '==', true),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    const products: Product[] = [];
    snapshot.forEach((doc) => {
      const data = convertTimestamps(doc.data());
      products.push({ id: doc.id, ...data } as Product);
    });

    return { success: true, products };
  } catch (error) {
    console.error('Error getting featured products:', error);
    return { success: false, products: [], error: (error as Error).message };
  }
};

export const updateProduct = async (id: string, productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error(`Error updating product (${id}):`, error);
    return { success: false, error: (error as Error).message };
  }
};

export const deleteProduct = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);

    return { success: true };
  } catch (error) {
    console.error(`Error deleting product (${id}):`, error);
    return { success: false, error: (error as Error).message };
  }
};

export const getProductsByPriceRange = async (minPrice: number, maxPrice: number): Promise<{ success: boolean; products: Product[]; error?: string }> => {
  try {
    const q = query(
      collection(db, 'products'),
      where('price', '>=', minPrice),
      where('price', '<=', maxPrice),
      where('isActive', '==', true),
      orderBy('price', 'asc')
    );

    const snapshot = await getDocs(q);

    const products: Product[] = [];
    snapshot.forEach((doc) => {
      const data = convertTimestamps(doc.data());
      products.push({ id: doc.id, ...data } as Product);
    });

    return { success: true, products };
  } catch (error) {
    console.error(`Error getting products by price range (${minPrice}-${maxPrice}):`, error);
    return { success: false, products: [], error: (error as Error).message };
  }
};