import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './config';

// Add or update a rating for a product by a user
export const addRating = async (productId: string, userId: string, rating: number) => {
  try {
    // Create or update the rating document with userId as the document ID
    const ratingRef = doc(db, 'products', productId, 'ratings', userId);
    await setDoc(ratingRef, {
      userId,
      productId,
      rating,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Update the average rating for the product
    await updateProductAverageRating(productId);

    return { success: true };
  } catch (error) {
    console.error('Error adding rating:', error);
    return { success: false, error };
  }
};

// Get a user's rating for a specific product
export const getRatingByUser = async (productId: string, userId: string): Promise<Rating | null> => {
  try {
    const ratingRef = doc(db, 'products', productId, 'ratings', userId);
    const ratingSnap = await getDoc(ratingRef);

    if (!ratingSnap.exists()) {
      return null;
    }

    return {
      id: ratingSnap.id,
      ...ratingSnap.data() as Omit<Rating, 'id'>
    };
  } catch (error) {
    console.error('Error getting user rating:', error);
    return null;
  }
};

// Update a user's existing rating for a product
export const updateRating = async (productId: string, userId: string, newRating: number) => {
  try {
    const ratingRef = doc(db, 'products', productId, 'ratings', userId);
    await updateDoc(ratingRef, {
      rating: newRating,
      updatedAt: serverTimestamp()
    });

    // Update the average rating for the product
    await updateProductAverageRating(productId);

    return { success: true };
  } catch (error) {
    console.error('Error updating rating:', error);
    return { success: false, error };
  }
};

// Delete a user's rating for a product
export const deleteRating = async (productId: string, userId: string) => {
  try {
    const ratingRef = doc(db, 'products', productId, 'ratings', userId);
    await deleteDoc(ratingRef);

    // Update the average rating for the product
    await updateProductAverageRating(productId);

    return { success: true };
  } catch (error) {
    console.error('Error deleting rating:', error);
    return { success: false, error };
  }
};

// Define rating interface
interface Rating {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  createdAt?: any;
  updatedAt?: any;
}

// Get all ratings for a specific product
export const getProductRatings = async (productId: string): Promise<{ success: boolean; ratings: Rating[]; error?: any }> => {
  try {
    const ratingsRef = collection(db, 'products', productId, 'ratings');
    const q = query(ratingsRef);
    const snapshot = await getDocs(q);

    const ratings: Rating[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Rating, 'id'>
    }));

    return { success: true, ratings };
  } catch (error) {
    console.error('Error getting product ratings:', error);
    return { success: false, ratings: [], error };
  }
};

// Calculate and update the average rating for a product
export const updateProductAverageRating = async (productId: string) => {
  try {
    const { success, ratings } = await getProductRatings(productId);
    if (!success) return;

    if (ratings.length === 0) {
      // If no ratings, set average to 0
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        rating: 0,
        numReviews: 0
      });
      return;
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / ratings.length;

    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      rating: averageRating,
      numReviews: ratings.length
    });
  } catch (error) {
    console.error('Error updating product average rating:', error);
  }
};

// Get the average rating for a product
export const getAverageRating = async (productId: string) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return { success: false, rating: 0, numReviews: 0 };
    }

    const productData = productSnap.data();
    return {
      success: true,
      rating: productData.rating || 0,
      numReviews: productData.numReviews || 0
    };
  } catch (error) {
    console.error('Error getting average rating:', error);
    return { success: false, rating: 0, numReviews: 0, error };
  }
};