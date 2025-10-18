import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentSnapshot,
  QueryConstraint,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';

export interface DbDocument {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  [key: string]: any;
}

export interface PaginationOptions {
  limit?: number;
  startAfter?: DocumentSnapshot;
}

export interface QueryOptions {
  where?: Array<[string, any, any]>;
  orderBy?: Array<[string, 'asc' | 'desc']>;
  limit?: number;
  startAfter?: DocumentSnapshot;
}

export const dbService = {
  // Create a new document
  create: async (collectionName: string, data: any): Promise<string> => {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  // Read a single document by ID
  read: async (collectionName: string, id: string): Promise<DbDocument | null> => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as DbDocument;
    }
    return null;
  },

  // Update a document
  update: async (collectionName: string, id: string, data: any): Promise<void> => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  },

  // Delete a document
  delete: async (collectionName: string, id: string): Promise<void> => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  },

  // Get all documents from a collection
  getAll: async (collectionName: string): Promise<DbDocument[]> => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DbDocument[];
  },

  // Query documents with conditions
  query: async (collectionName: string, options: QueryOptions = {}): Promise<DbDocument[]> => {
    const constraints: QueryConstraint[] = [];
    
    // Add where clauses
    if (options.where) {
      options.where.forEach(([field, operator, value]) => {
        constraints.push(where(field, operator, value));
      });
    }
    
    // Add orderBy clauses
    if (options.orderBy) {
      options.orderBy.forEach(([field, direction]) => {
        constraints.push(orderBy(field, direction));
      });
    }
    
    // Add limit
    if (options.limit) {
      constraints.push(limit(options.limit));
    }
    
    // Add pagination
    if (options.startAfter) {
      constraints.push(startAfter(options.startAfter));
    }
    
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DbDocument[];
  },

  // Real-time listener for a document
  onDocumentChange: (collectionName: string, id: string, callback: (doc: DbDocument | null) => void) => {
    const docRef = doc(db, collectionName, id);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({
          id: docSnap.id,
          ...docSnap.data()
        } as DbDocument);
      } else {
        callback(null);
      }
    });
  },

  // Real-time listener for a collection
  onCollectionChange: (collectionName: string, callback: (docs: DbDocument[]) => void, options: QueryOptions = {}) => {
    const constraints: QueryConstraint[] = [];
    
    if (options.where) {
      options.where.forEach(([field, operator, value]) => {
        constraints.push(where(field, operator, value));
      });
    }
    
    if (options.orderBy) {
      options.orderBy.forEach(([field, direction]) => {
        constraints.push(orderBy(field, direction));
      });
    }
    
    if (options.limit) {
      constraints.push(limit(options.limit));
    }
    
    const q = query(collection(db, collectionName), ...constraints);
    
    return onSnapshot(q, (querySnapshot) => {
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DbDocument[];
      callback(docs);
    });
  },

  // Batch operations
  batch: () => {
    const batch = writeBatch(db);
    
    return {
      create: (collectionName: string, data: any) => {
        const docRef = doc(collection(db, collectionName));
        batch.set(docRef, {
          ...data,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        return docRef.id;
      },
      
      update: (collectionName: string, id: string, data: any) => {
        const docRef = doc(db, collectionName, id);
        batch.update(docRef, {
          ...data,
          updatedAt: Timestamp.now()
        });
      },
      
      delete: (collectionName: string, id: string) => {
        const docRef = doc(db, collectionName, id);
        batch.delete(docRef);
      },
      
      commit: () => batch.commit()
    };
  }
};