"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    profile: any | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    isLoading: true,
    signOut: async () => { },
    signInWithGoogle: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error || !session) {
                setUser(null);
                setProfile(null);
                setIsLoading(false);
                return;
            }
            
            setUser(session.user);
            fetchProfile(session.user.id);
        };

        checkSession();

        // Listen for changes on auth state (sign in, sign out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || !profile) {
                    await fetchProfile(currentUser.id);
                }
            } else {
                setProfile(null);
                setIsLoading(false);
            }
        });

        // Tab visibility listener: Re-check session when user returns to tab
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkSession();
            }
        };
        
        if (typeof window !== 'undefined') {
            document.addEventListener('visibilitychange', handleVisibilityChange);
        }

        return () => {
            subscription.unsubscribe();
            if (typeof window !== 'undefined') {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            }
        };
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
            } else {
                setProfile(data);
            }
        } catch (err) {
            console.error('Unexpected error fetching profile:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        // 1. Optimistically clear state for instant UI update
        setUser(null);
        setProfile(null);

        // 2. Clear local storage immediately
        if (typeof window !== 'undefined') {
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
        }

        // 3. Attempt API signout but with a hard 2-second timeout so it never hangs
        try {
            await Promise.race([
                supabase.auth.signOut(), 
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
            ]);
        } catch (error) {
            console.error('Logout error (handled silently):', error);
        } finally {
            // 4. Force reload to clear all caches
            if (typeof window !== 'undefined') {
                window.location.href = '/';
            }
        }
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{ user, profile, isLoading, signOut, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
