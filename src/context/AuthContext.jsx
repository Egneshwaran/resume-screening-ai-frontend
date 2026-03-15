import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [token, setToken] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authInitialized, setAuthInitialized] = useState(false);


    const fetchSubscription = async (email) => {
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('email', email)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is code for 'no rows returned'
                console.error('Error fetching subscription:', error);
            }
            return data;
        } catch (err) {
            console.error('Error in fetchSubscription:', err);
            return null;
        }
    };

    useEffect(() => {
        let isMounted = true;

        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (!isMounted) return;

                if (session) {
                    setUser(session.user);
                    setToken(session.access_token);

                    // Sync with api.js requirement
                    localStorage.setItem('user', JSON.stringify({
                        ...session.user,
                        token: session.access_token
                    }));

                    const userProfile = {
                        full_name: session.user.user_metadata?.full_name || 'HR Manager',
                        company_name: session.user.user_metadata?.company_name || 'Recruitment AI',
                        role: session.user.user_metadata?.role || 'HR'
                    };
                    setProfile(userProfile);

                    const sub = await fetchSubscription(session.user.email);
                    if (isMounted) setSubscription(sub);
                } else {
                    setToken(null);
                    setUser(null);
                    setProfile(null);
                    localStorage.removeItem('user');
                }
            } catch (err) {
                console.error('Error getting session:', err);
                if (isMounted) {
                    setToken(null);
                    setUser(null);
                    setProfile(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setAuthInitialized(true);
                }
            }

        };

        getSession();

        // Safety timeout to prevent infinite loading if Supabase hangs
        const safetyTimeout = setTimeout(() => {
            if (isMounted) {
                console.warn('AuthContext: Safety timeout reached, forcing loading to false');
                setLoading(false);
            }
        }, 5000);

        const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session) {
                    setUser(session.user);
                    setToken(session.access_token);
                    const userProfile = {
                        full_name: session.user.user_metadata?.full_name || 'HR Manager',
                        company_name: session.user.user_metadata?.company_name || 'Recruitment AI',
                        role: session.user.user_metadata?.role || 'HR'
                    };
                    setProfile(userProfile);
                    const sub = await fetchSubscription(session.user.email);
                    setSubscription(sub);

                    // Sync with api.js requirement
                    localStorage.setItem('user', JSON.stringify({
                        ...session.user,
                        token: session.access_token
                    }));
                } else {
                    setUser(null);
                    setToken(null);
                    setProfile(null);
                    setSubscription(null);
                    localStorage.removeItem('user');
                }
                setLoading(false);
                clearTimeout(safetyTimeout);
            }
        );

        return () => {
            isMounted = false;
            authListener?.unsubscribe();
            clearTimeout(safetyTimeout);
        };
    }, []);

    const signUp = useCallback(async ({ email, password, fullName, companyName }) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    company_name: companyName,
                    role: 'HR'
                }
            }
        });

        if (error) throw error;
        return data;
    }, []);

    const signIn = useCallback(async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    }, []);

    const signOut = useCallback(async () => {
        try {
            console.log('AuthContext: Starting ultra-robust sign out...');

            // 1. Clear state IMMEDIATELY (Synchronous)
            setUser(null);
            setProfile(null);
            setSubscription(null);
            setToken(null);

            // 2. Clear all local storage IMMEDIATELY (Synchronous)
            localStorage.clear();
            sessionStorage.clear();

            // 3. Attempt Supabase sign out with a race condition (timeout)
            // We don't want to wait forever for a network request during logout
            await Promise.race([
                supabase.auth.signOut(),
                new Promise(resolve => setTimeout(resolve, 1500)) // 1.5s timeout
            ]);

            console.log('AuthContext: Sign out local data cleared');
        } catch (err) {
            console.error('Ultra-robust logout error:', err);
        } finally {
            // 4. Force hard redirect to clear everything and reset app state
            window.location.href = '/login';
        }
    }, []);

    const resetPasswordForEmail = useCallback(async (email) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        return data;
    }, []);

    const updatePassword = useCallback(async (newPassword) => {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) throw error;
        return data;
    }, []);

    const updateProfileData = useCallback(async (userId, updates) => {
        const { data, error } = await supabase.auth.updateUser({
            data: updates
        });
        if (error) throw error;

        const newProfile = {
            full_name: data.user.user_metadata.full_name,
            company_name: data.user.user_metadata.company_name,
            role: data.user.user_metadata.role
        };
        setProfile(newProfile);
        return data;
    }, []);

    const refreshSubscription = useCallback(async () => {
        if (user) {
            const sub = await fetchSubscription(user.email);
            setSubscription(sub);
            return sub;
        }
    }, [user]);

    const value = useMemo(() => ({
        user,
        profile,
        loading,
        token,
        subscription,
        refreshSubscription,
        signUp,
        signIn,
        signOut,
        resetPasswordForEmail,
        updatePassword,
        updateProfileData,
        isAuthenticated: () => !!user,
        isHR: () => profile?.role === 'HR' || profile?.role === 'ADMIN',
        isAdmin: () => profile?.role === 'ADMIN',
        getCurrentUser: () => {
            if (!user) return null;
            return {
                id: user.id,
                email: user.email,
                fullName: profile?.full_name,
                companyName: profile?.company_name,
                role: profile?.role,
                token: token,
                subscription: subscription,
            };
        },
    }), [user, profile, loading, token, subscription, refreshSubscription, signUp, signIn, signOut, resetPasswordForEmail, updatePassword, updateProfileData]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
