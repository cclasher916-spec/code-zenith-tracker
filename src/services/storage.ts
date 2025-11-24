import { storage } from '@/lib/firebase';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  StorageReference
} from 'firebase/storage';

export const storageService = {
  /**
   * Upload a file to Firebase Storage
   * @param path - The path where the file should be stored (e.g., 'avatars/userId')
   * @param file - The file to upload
   * @returns Promise resolving to the download URL
   */
  uploadFile: async (path: string, file: File): Promise<string> => {
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  /**
   * Delete a file from Firebase Storage
   * @param path - The path of the file to delete
   */
  deleteFile: async (path: string): Promise<void> => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  /**
   * Get the download URL for a file
   * @param path - The path of the file
   * @returns Promise resolving to the download URL
   */
  getFileUrl: async (path: string): Promise<string> => {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  }
};
