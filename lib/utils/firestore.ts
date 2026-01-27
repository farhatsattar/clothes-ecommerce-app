import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  doc,
  getDoc,
  serverTimestamp,
  QueryConstraint,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Timestamp } from 'firebase/firestore';

// ✅ Utility: recursively convert Firestore Timestamps to JS Date
export const convertTimestamps = (obj: any): any => {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Timestamp) {
      result[key] = value.toDate();
    } else if (value && typeof value === 'object') {
      result[key] = convertTimestamps(value);
    } else {
      result[key] = value;
    }
  }
  return result;
};

// ✅ Add document with timestamps
export const addDocumentWithTimestamps = async (collectionPath: string, data: any) => {
  const docData = { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  try {
    const docRef = await addDoc(collection(db, collectionPath), docData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error(`Error adding document to ${collectionPath}:`, error);
    return { success: false, error: (error as Error).message };
  }
};

// ✅ Update document with updatedAt
export const updateDocumentWithTimestamp = async (collectionPath: string, id: string, data: any) => {
  try {
    const docRef = doc(db, collectionPath, id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    console.error(`Error updating document in ${collectionPath}/${id}:`, error);
    return { success: false, error: (error as Error).message };
  }
};

// ✅ Get single document with timestamp conversion
export const getDocumentWithConversion = async (collectionPath: string, id: string) => {
  try {
    const docRef = doc(db, collectionPath, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return { success: false, error: 'Document not found', data: null };
    const data = convertTimestamps(snapshot.data());
    return { success: true, data: { id: snapshot.id, ...data } };
  } catch (error) {
    console.error(`Error getting document from ${collectionPath}/${id}:`, error);
    return { success: false, error: (error as Error).message, data: null };
  }
};

// ✅ Get multiple documents with optional constraints and timestamp conversion
export const getDocumentsWithConversion = async (
  collectionPath: string,
  constraints: QueryConstraint[] = [],
  options: { convertTimestamps?: boolean; limitResults?: number } = {}
) => {
  try {
    let q = query(collection(db, collectionPath), ...constraints);
    if (options.limitResults) q = query(q, limit(options.limitResults));

    const snapshot = await getDocs(q);
    let docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (options.convertTimestamps !== false) docs = docs.map(doc => convertTimestamps(doc));

    return { success: true, data: docs, count: docs.length };
  } catch (error) {
    console.error(`Error getting documents from ${collectionPath}:`, error);
    return { success: false, error: (error as Error).message, data: [], count: 0 };
  }
};

// ✅ Paginated fetch
export const getDocumentsPaginated = async (
  collectionPath: string,
  lastVisible: DocumentSnapshot | null,
  constraints: QueryConstraint[] = [],
  pageSize: number = 10
) => {
  try {
    let q = query(collection(db, collectionPath), ...constraints);
    if (lastVisible) q = query(q, startAfter(lastVisible), limit(pageSize));
    else q = query(q, limit(pageSize));

    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const convertedDocs = docs.map(doc => convertTimestamps(doc));
    const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

    return { success: true, data: convertedDocs, lastVisible: lastDoc, hasMore: snapshot.docs.length === pageSize };
  } catch (error) {
    console.error(`Error getting paginated documents from ${collectionPath}:`, error);
    return { success: false, error: (error as Error).message, data: [], lastVisible: null, hasMore: false };
  }
};

// ✅ Check if document exists
export const documentExists = async (collectionPath: string, id: string) => {
  try {
    const snapshot = await getDoc(doc(db, collectionPath, id));
    return snapshot.exists();
  } catch (error) {
    console.error(`Error checking if document exists in ${collectionPath}/${id}:`, error);
    return false;
  }
};

// ✅ Batch write operations
export const batchWrite = async (operations: Array<{ type: 'set' | 'update' | 'delete'; collectionPath: string; id?: string; data?: any }>) => {
  try {
    const results: any[] = [];

    for (const op of operations) {
      let result;

      if (op.type === 'set') {
        if (!op.id) {
          const docRef = await addDoc(collection(db, op.collectionPath), { ...op.data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
          result = { success: true, id: docRef.id };
        } else {
          const docRef = doc(db, op.collectionPath, op.id);
          await setDoc(docRef, { ...op.data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
          result = { success: true, id: op.id };
        }
      } else if (op.type === 'update') {
        if (!op.id) throw new Error('ID is required for update operations');
        await updateDoc(doc(db, op.collectionPath, op.id), { ...op.data, updatedAt: serverTimestamp() });
        result = { success: true, id: op.id };
      } else if (op.type === 'delete') {
        if (!op.id) throw new Error('ID is required for delete operations');
        await deleteDoc(doc(db, op.collectionPath, op.id));
        result = { success: true, id: op.id };
      } else {
        throw new Error(`Unsupported operation type: ${op.type}`);
      }

      results.push(result);
    }

    return { success: true, results };
  } catch (error) {
    console.error('Error performing batch write operations:', error);
    return { success: false, error: (error as Error).message, results: [] };
  }
};
