import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from 'firebase/auth';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export const authService = {
  // Sign up with email and password
  signUp: async (email: string, password: string, displayName?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential;
  },

  // Sign in with email and password
  signIn: (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  },

  // Sign out
  signOut: () => {
    return signOut(auth);
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // Update user profile
  updateUserProfile: (updates: { displayName?: string; photoURL?: string }) => {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    return updateProfile(user, updates);
  },

  // Send password reset email
  resetPassword: (email: string) => {
    return sendPasswordResetEmail(auth, email);
  },

  // Update password
  updateUserPassword: async (currentPassword: string, newPassword: string) => {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('No authenticated user');
    
    // Re-authenticate user before password update
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    return updatePassword(user, newPassword);
  },

  // Convert Firebase User to AuthUser
  formatUser: (user: User): AuthUser => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified
  })
};