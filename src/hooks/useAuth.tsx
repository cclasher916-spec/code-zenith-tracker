import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  roll_number?: string;
  phone?: string;
  department_id?: string;
  section_id?: string;
  role: 'student' | 'team_lead' | 'advisor' | 'hod' | 'admin';
  academic_year?: string;
  is_active: boolean;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign In Failed",
          description: error.message,
        });
        throw error;
      }

      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    try {
      setLoading(true);
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: authError.message,
        });
        throw authError;
      }

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            email: authData.user.email!,
            full_name: userData.full_name!,
            roll_number: userData.roll_number,
            phone: userData.phone,
            department_id: userData.department_id,
            section_id: userData.section_id,
            role: userData.role || 'student',
            academic_year: userData.academic_year,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          toast({
            variant: "destructive",
            title: "Profile Creation Failed",
            description: profileError.message,
          });
          throw profileError;
        }

        // Create default user preferences
        await supabase
          .from('user_preferences')
          .insert({
            user_id: authData.user.id,
          });

        toast({
          title: "Account Created!",
          description: "Your account has been created successfully. You can now sign in.",
        });
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          variant: "destructive",
          title: "Sign Out Failed",
          description: error.message,
        });
        throw error;
      }

      setUser(null);
      setProfile(null);
      setSession(null);
      
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        refreshProfile();
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await refreshProfile();
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};