import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  serverTimestamp,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Product } from '@/types';

/**
 * Fetches all products from Firestore with optional filtering and pagination
 */
export const getProducts = async (
  category?: string,
  limitCount?: number,
  lastVisible?: QueryDocumentSnapshot<DocumentData>
): Promise<{ products: Product[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null; hasMore: boolean }> => {
  try {
    let q = query(collection(db, 'products'));

    // Add category filter if provided
    if (category) {
      q = query(q, where('category', '==', category.toLowerCase()));
    }

    // Add ordering by createdAt
    q = query(q, orderBy('createdAt', 'desc'));

    // Add limit if provided
    if (limitCount) {
      q = query(q, limit(limitCount + 1)); // Get one extra to check if there are more
    }

    // Add cursor if provided
    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }

    const snapshot = await getDocs(q);

    let products: Product[] = [];
    let hasMore = false;

    if (limitCount && snapshot.size > limitCount) {
      // Remove the extra document we fetched to check if there are more
      products = snapshot.docs.slice(0, -1).map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Product));
      hasMore = true;
    } else {
      products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Product));
    }

    const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1] || null;

    return {
      products,
      lastVisible: hasMore ? lastVisibleDoc : null,
      hasMore
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetches a single product by ID from Firestore
 */
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, 'products', productId);
    const snapshot = await getDoc(productRef);

    if (!snapshot.exists()) {
      return null;
    }

    const productData = snapshot.data();
    return {
      id: snapshot.id,
      ...productData,
    } as Product;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

/**
 * Fetches products by category from Firestore
 */
export const getProductsByCategory = async (
  category: string,
  limitCount?: number,
  lastVisible?: QueryDocumentSnapshot<DocumentData>
): Promise<{ products: Product[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null; hasMore: boolean }> => {
  try {
    let q = query(
      collection(db, 'products'),
      where('category', '==', category.toLowerCase()),
      orderBy('createdAt', 'desc')
    );

    // Add limit if provided
    if (limitCount) {
      q = query(q, limit(limitCount + 1)); // Get one extra to check if there are more
    }

    // Add cursor if provided
    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }

    const snapshot = await getDocs(q);

    let products: Product[] = [];
    let hasMore = false;

    if (limitCount && snapshot.size > limitCount) {
      // Remove the extra document we fetched to check if there are more
      products = snapshot.docs.slice(0, -1).map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Product));
      hasMore = true;
    } else {
      products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Product));
    }

    const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1] || null;

    return {
      products,
      lastVisible: hasMore ? lastVisibleDoc : null,
      hasMore
    };
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

/**
 * Creates a new product in Firestore
 */
export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const productRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true, // Default to active
    });

    return productRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Updates an existing product in Firestore
 */
export const updateProduct = async (productId: string, productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  try {
    const productRef = doc(db, 'products', productId);

    await updateDoc(productRef, {
      ...productData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Deletes a product from Firestore
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const productRef = doc(db, 'products', productId);

    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Converts Firestore Timestamps to Date objects in a product
 */
export const convertTimestampsInProduct = (product: any): Product => {
  return {
    ...product,
    createdAt: product.createdAt instanceof Timestamp ? product.createdAt.toDate() : product.createdAt,
    updatedAt: product.updatedAt instanceof Timestamp ? product.updatedAt.toDate() : product.updatedAt,
  } as Product;
};

/**
 * Converts Firestore Timestamps to Date objects in an array of products
 */
export const convertTimestampsInProducts = (products: any[]): Product[] => {
  return products.map(convertTimestampsInProduct);
};

/**
 * Search for products by name, description, category, or tags
 */
export const searchProducts = async (
  searchTerm: string,
  category?: string,
  limitCount?: number,
  lastVisible?: QueryDocumentSnapshot<DocumentData>
): Promise<{ products: Product[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null; hasMore: boolean }> => {
  try {
    // Build the query
    let q = query(collection(db, 'products'));

    // Add category filter if provided
    if (category) {
      q = query(q, where('category', '==', category.toLowerCase()));
    }

    // Add ordering by name for consistent results
    q = query(q, orderBy('name', 'asc'));

    // Add limit if provided
    if (limitCount) {
      q = query(q, limit(limitCount + 1)); // Get one extra to check if there are more
    }

    // Add cursor if provided
    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }

    const snapshot = await getDocs(q);

    let allProducts: Product[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Product));

    // If there's a search term, filter results on the client side
    // Note: For production apps, you'd want to use a search service like Algolia or Elasticsearch
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      allProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.tags?.some(tag => tag.toLowerCase().includes(term)) ||
        product.category.toLowerCase().includes(term)
      );
    }

    let products: Product[] = [];
    let hasMore = false;

    if (limitCount && allProducts.length > limitCount) {
      // Remove the extra document we fetched to check if there are more
      products = allProducts.slice(0, limitCount);
      hasMore = true;
    } else {
      products = allProducts;
    }

    // Since we're filtering on client side, we need to determine the last visible doc differently
    // We'll return the last doc from the original query results
    const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1] || null;

    return {
      products,
      lastVisible: hasMore ? lastVisibleDoc : null,
      hasMore
    };
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};
