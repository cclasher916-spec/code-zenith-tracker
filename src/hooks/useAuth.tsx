import { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { authService, AuthUser } from '@/services/auth';
import { dbService } from '@/services/database';
import { useToast } from '@/hooks/use-toast';
import { Timestamp } from 'firebase/firestore';

interface Profile {
  id: string;
  uid: string; // Firebase UID
  email: string;
  fullName: string;
  rollNumber?: string;
  phone?: string;
  departmentId?: string;
  sectionId?: string;
  role: 'student' | 'team_lead' | 'advisor' | 'hod' | 'admin';
  academicYear?: string;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshProfile = async (userId?: string) => {
    const targetUserId = userId || user?.uid;
    
    if (!targetUserId) {
      console.log('No user ID provided, clearing profile');
      setProfile(null);
      return;
    }
    
    console.log('Refreshing profile for user:', targetUserId);
    
    try {
      // Query profiles collection where uid matches the Firebase user UID
      const profiles = await dbService.query('profiles', {
        where: [['uid', '==', targetUserId]],
        limit: 1
      });

      const profileData = profiles.length > 0 ? profiles[0] as Profile : null;
      console.log('Profile data retrieved:', profileData);
      setProfile(profileData);
    } catch (error: any) {
      console.error('Error refreshing profile:', error);
      toast({
        variant: "destructive",
        title: "Profile Loading Error",
        description: "Failed to load user profile",
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await authService.signIn(email, password);
      
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error.message || "Failed to sign in",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    try {
      setLoading(true);
      
      // Create Firebase auth user
      const userCredential = await authService.signUp(email, password, userData.fullName);
      const firebaseUser = userCredential.user;

      if (firebaseUser) {
        // Create profile document in Firestore
        const profileData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          fullName: userData.fullName!,
          rollNumber: userData.rollNumber,
          phone: userData.phone,
          departmentId: userData.departmentId,
          sectionId: userData.sectionId,
          role: userData.role || 'student',
          academicYear: userData.academicYear,
          isActive: true,
          avatarUrl: userData.avatarUrl
        };

        await dbService.create('profiles', profileData);

        // Create default user preferences
        await dbService.create('userPreferences', {
          uid: firebaseUser.uid,
          theme: 'system',
          notifications: {
            email: true,
            push: true,
            taskAssigned: true,
            taskCompleted: false,
            projectUpdates: true
          }
        });

        // Refresh profile after creation
        setTimeout(() => {
          refreshProfile(firebaseUser.uid);
        }, 100);

        toast({
          title: "Account Created!",
          description: "Your account has been created successfully and you are now signed in!",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message || "Failed to create account",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
      
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Sign Out Failed",
        description: error.message || "Failed to sign out",
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    // Listen for Firebase auth state changes
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser: User | null) => {
      if (!isMounted) return;
      
      console.log('Auth state change:', firebaseUser?.uid);
      
      if (firebaseUser) {
        const authUser = authService.formatUser(firebaseUser);
        setUser(authUser);
        
        // Load user profile
        setTimeout(() => {
          if (isMounted) refreshProfile(firebaseUser.uid);
        }, 100);
      } else {
        setUser(null);
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};