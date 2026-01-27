import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { User } from '@/types';
import { convertTimestamps } from '@/lib/utils/firestore';

// User service functions
export const createUserProfile = async (userId: string, userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error?: string }> => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      id: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const getUserProfile = async (userId: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const userRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      return { success: false, error: 'User not found' };
    }

    const data = convertTimestamps(snapshot.data());
    const user = { id: snapshot.id, ...data } as User;

    return { success: true, user };
  } catch (error) {
    console.error(`Error getting user profile (${userId}):`, error);
    return { success: false, error: (error as Error).message };
  }
};

export const updateUserProfile = async (userId: string, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<{ success: boolean; error?: string }> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error(`Error updating user profile (${userId}):`, error);
    return { success: false, error: (error as Error).message };
  }
};

export const getUsersByEmail = async (email: string): Promise<{ success: boolean; users: User[]; error?: string }> => {
  try {
    const q = query(
      collection(db, 'users'),
      where('email', '==', email)
    );

    const snapshot = await getDocs(q);

    const users: User[] = [];
    snapshot.forEach((doc) => {
      const data = convertTimestamps(doc.data());
      users.push({ id: doc.id, ...data } as User);
    });

    return { success: true, users };
  } catch (error) {
    console.error(`Error getting users by email (${email}):`, error);
    return { success: false, users: [], error: (error as Error).message };
  }
};