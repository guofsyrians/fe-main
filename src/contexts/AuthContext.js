import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, username, metadata = {}) => {
    if (!supabase) {
      return { error: { message: 'Database not configured' } };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...metadata,
          username: username,
        },
      },
    });
    
    // After successful signup, create/update the user profile with username
    if (data?.user && !error) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: data.user.id,
          username: username,
          full_name: metadata.full_name || '',
        }, {
          onConflict: 'id'
        });
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
      }
    }
    
    return { data, error };
  };

  const signIn = async (username, password) => {
    if (!supabase) {
      return { error: { message: 'Database not configured' } };
    }

    // First, try to get email by username from user_profiles
    let email = username;
    let usernameNotFound = false;
    
    // Check if username contains @ (it's an email) or look it up in user_profiles
    if (!username.includes('@')) {
      try {
        // Get the user's email from auth.users by username using database function
        const { data: emailData, error: emailError } = await supabase.rpc(
          'get_user_email_by_username',
          { username_param: username }
        );
        
        if (!emailError && emailData && emailData.trim() !== '') {
          email = emailData;
        } else {
          // Username not found, but we'll still try to authenticate
          // This allows for fallback to email-based login if username lookup fails
          usernameNotFound = true;
        }
      } catch (error) {
        // If RPC fails, try using username as email (fallback)
        console.warn('Failed to lookup email by username:', error);
      }
    }
    
    // Sign in with email (which might be looked up from username)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // If login failed and we couldn't find the username, provide a helpful error
    if (error && usernameNotFound && !username.includes('@')) {
      error.message = error.message || 'Invalid username or password';
    }
    
    return { data, error };
  };

  const signOut = async () => {
    if (!supabase) {
      return { error: null };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email) => {
    if (!supabase) {
      return { error: { message: 'Database not configured' } };
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

