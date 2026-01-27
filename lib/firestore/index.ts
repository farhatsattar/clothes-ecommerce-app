import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/firebase/config';

// Firestore service for products
export const productsCollection = collection(db, 'products');

// Firestore service for orders
export const ordersCollection = collection(db, 'orders');

// Firestore service for users
export const usersCollection = collection(db, 'users');

// Firestore service for cart
export const cartCollection = collection(db, 'cart');

// Firestore service for reviews
export const reviewsCollection = collection(db, 'reviews');

// Generic CRUD operations
export const createDocument = async (collectionPath: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionPath), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error(`Error creating document in ${collectionPath}:`, error);
    return { success: false, error: (error as Error).message };
  }
};

export const getDocuments = async (collectionPath: string, constraints: QueryConstraint[] = []) => {
  try {
    const q = query(collection(db, collectionPath), ...constraints);
    const snapshot = await getDocs(q);
    return {
      success: true,
      data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    };
  } catch (error) {
    console.error(`Error getting documents from ${collectionPath}:`, error);
    return { success: false, error: (error as Error).message, data: [] };
  }
};

export const getDocumentById = async (collectionPath: string, id: string) => {
  try {
    const docRef = doc(db, collectionPath, id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return { success: false, error: 'Document not found', data: null };
    }

    return { success: true, data: { id: snapshot.id, ...snapshot.data() } };
  } catch (error) {
    console.error(`Error getting document from ${collectionPath}/${id}:`, error);
    return { success: false, error: (error as Error).message, data: null };
  }
};

export const updateDocument = async (collectionPath: string, id: string, data: any) => {
  try {
    const docRef = doc(db, collectionPath, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error(`Error updating document in ${collectionPath}/${id}:`, error);
    return { success: false, error: (error as Error).message };
  }
};

export const deleteDocument = async (collectionPath: string, id: string) => {
  try {
    const docRef = doc(db, collectionPath, id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting document from ${collectionPath}/${id}:`, error);
    return { success: false, error: (error as Error).message };
  }
};

// Product-specific operations
export const createProduct = async (productData: any) => {
  return await createDocument('products', productData);
};

export const getAllProducts = async () => {
  return await getDocuments('products', [orderBy('createdAt', 'desc')]);
};

export const getProductById = async (id: string) => {
  return await getDocumentById('products', id);
};

export const updateProduct = async (id: string, productData: any) => {
  return await updateDocument('products', id, productData);
};

export const deleteProduct = async (id: string) => {
  return await deleteDocument('products', id);
};

// User-specific operations
export const createUserProfile = async (userId: string, userData: any) => {
  return await createDocument(`users/${userId}/profile`, userData);
};

export const getUserProfile = async (userId: string) => {
  return await getDocumentById(`users/${userId}/profile`, 'profile');
};

export const updateUserProfile = async (userId: string, userData: any) => {
  return await updateDocument(`users/${userId}/profile`, 'profile', userData);
};

// Cart-specific operations
export const getUserCart = async (userId: string) => {
  return await getDocuments(`users/${userId}/cart`);
};

export const addToCart = async (userId: string, cartItem: any) => {
  return await createDocument(`users/${userId}/cart`, cartItem);
};

export const updateCartItem = async (userId: string, itemId: string, data: any) => {
  return await updateDocument(`users/${userId}/cart`, itemId, data);
};

export const removeFromCart = async (userId: string, itemId: string) => {
  return await deleteDocument(`users/${userId}/cart`, itemId);
};

// Order-specific operations
export const createOrder = async (userId: string, orderData: any) => {
  return await createDocument(`users/${userId}/orders`, orderData);
};

export const getUserOrders = async (userId: string) => {
  return await getDocuments(`users/${userId}/orders`, [orderBy('createdAt', 'desc')]);
};

export const getOrderById = async (userId: string, orderId: string) => {
  return await getDocumentById(`users/${userId}/orders`, orderId);
};

export const updateOrder = async (userId: string, orderId: string, data: any) => {
  return await updateDocument(`users/${userId}/orders`, orderId, data);
};

// Review-specific operations
export const createReview = async (productId: string, reviewData: any) => {
  return await createDocument(`products/${productId}/reviews`, reviewData);
};

export const getProductReviews = async (productId: string) => {
  return await getDocuments(`products/${productId}/reviews`, [orderBy('createdAt', 'desc')]);
};

export const getAverageRating = async (productId: string) => {
  const reviewsResult = await getProductReviews(productId);
  if (!reviewsResult.success || !reviewsResult.data.length) {
    return { success: true, average: 0, count: 0 };
  }

  const totalRating = reviewsResult.data.reduce((sum: number, review: any) => sum + (review.rating || 0), 0);
  const average = totalRating / reviewsResult.data.length;

  return {
    success: true,
    average: parseFloat(average.toFixed(2)),
    count: reviewsResult.data.length
  };
};