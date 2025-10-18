import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { dbService, DbDocument, QueryOptions } from '@/services/database';
import { useCallback } from 'react';

// Hook for querying a single document
export const useFirebaseDocument = (
  collectionName: string, 
  id: string | undefined,
  options?: Omit<UseQueryOptions<DbDocument | null>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['firebase', collectionName, id],
    queryFn: () => id ? dbService.read(collectionName, id) : Promise.resolve(null),
    enabled: !!id && !!collectionName,
    ...options
  });
};

// Hook for querying multiple documents
export const useFirebaseCollection = (
  collectionName: string,
  queryOptions?: QueryOptions,
  options?: Omit<UseQueryOptions<DbDocument[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['firebase', collectionName, 'collection', queryOptions],
    queryFn: () => queryOptions 
      ? dbService.query(collectionName, queryOptions)
      : dbService.getAll(collectionName),
    enabled: !!collectionName,
    ...options
  });
};

// Hook for creating documents
export const useFirebaseCreate = (collectionName: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => dbService.create(collectionName, data),
    onSuccess: () => {
      // Invalidate all queries for this collection
      queryClient.invalidateQueries({ 
        queryKey: ['firebase', collectionName] 
      });
    }
  });
};

// Hook for updating documents
export const useFirebaseUpdate = (collectionName: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      dbService.update(collectionName, id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific document and collection queries
      queryClient.invalidateQueries({ 
        queryKey: ['firebase', collectionName] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['firebase', collectionName, id] 
      });
    }
  });
};

// Hook for deleting documents
export const useFirebaseDelete = (collectionName: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => dbService.delete(collectionName, id),
    onSuccess: (_, id) => {
      // Remove specific document from cache and invalidate collection
      queryClient.removeQueries({ 
        queryKey: ['firebase', collectionName, id] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['firebase', collectionName] 
      });
    }
  });
};

// Generic mutation hook for Firebase operations
export const useFirebaseMutation = (collectionName: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      action, 
      id, 
      data 
    }: { 
      action: 'create' | 'update' | 'delete'; 
      id?: string; 
      data?: any 
    }) => {
      switch (action) {
        case 'create':
          return await dbService.create(collectionName, data);
        case 'update':
          if (!id) throw new Error('ID required for update');
          return await dbService.update(collectionName, id, data);
        case 'delete':
          if (!id) throw new Error('ID required for delete');
          return await dbService.delete(collectionName, id);
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    },
    onSuccess: (_, { action, id }) => {
      if (action === 'delete' && id) {
        queryClient.removeQueries({ 
          queryKey: ['firebase', collectionName, id] 
        });
      }
      queryClient.invalidateQueries({ 
        queryKey: ['firebase', collectionName] 
      });
    }
  });
};

// Hook for real-time document listening
export const useFirebaseDocumentListener = (
  collectionName: string, 
  id: string | undefined
) => {
  const queryClient = useQueryClient();
  
  const startListening = useCallback(() => {
    if (!id || !collectionName) return;
    
    const unsubscribe = dbService.onDocumentChange(
      collectionName, 
      id, 
      (doc) => {
        queryClient.setQueryData(
          ['firebase', collectionName, id], 
          doc
        );
      }
    );
    
    return unsubscribe;
  }, [collectionName, id, queryClient]);
  
  return { startListening };
};

// Hook for real-time collection listening
export const useFirebaseCollectionListener = (
  collectionName: string,
  queryOptions?: QueryOptions
) => {
  const queryClient = useQueryClient();
  
  const startListening = useCallback(() => {
    if (!collectionName) return;
    
    const unsubscribe = dbService.onCollectionChange(
      collectionName,
      (docs) => {
        queryClient.setQueryData(
          ['firebase', collectionName, 'collection', queryOptions],
          docs
        );
      },
      queryOptions
    );
    
    return unsubscribe;
  }, [collectionName, queryOptions, queryClient]);
  
  return { startListening };
};