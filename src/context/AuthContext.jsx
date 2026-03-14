import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [token, setToken] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

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
                    // Supabase stores user metadata in user.user_metadata
                    const userProfile = {
                        name: session.user.user_metadata.full_name,
                        company_name: session.user.user_metadata.company_name,
                        role: session.user.user_metadata.role || 'HR'
                    };
                    setProfile(userProfile);
                    
                    const sub = await fetchSubscription(session.user.email);
                    if (isMounted) setSubscription(sub);
                } else {
                    setToken(null);
                    setUser(null);
                    setProfile(null);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error getting session:', err);
                if (isMounted) setLoading(false);
            }
        };

        getSession();

        const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session) {
                    setUser(session.user);
                    setToken(session.access_token);
                    const userProfile = {
                        name: session.user.user_metadata.full_name,
                        company_name: session.user.user_metadata.company_name,
                        role: session.user.user_metadata.role || 'HR'
                    };
                    setProfile(userProfile);
                    const sub = await fetchSubscription(session.user.email);
                    setSubscription(sub);
                } else {
                    setUser(null);
                    setToken(null);
                    setProfile(null);
                    setSubscription(null);
                }
                setLoading(true);
                setLoading(false);
            }
        );

        return () => {
            isMounted = false;
            authListener?.unsubscribe();
        };
    }, []);

    const signUp = async ({ email, password, fullName, companyName }) => {
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
    };

    const signIn = async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setSubscription(null);
        setToken(null);
        localStorage.clear();
        sessionStorage.clear();
    };

    const resetPasswordForEmail = async (email) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        return data;
    };

    const updatePassword = async (newPassword) => {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) throw error;
        return data;
    };

    const updateProfileData = async (userId, updates) => {
        const { data, error } = await supabase.auth.updateUser({
            data: updates
        });
        if (error) throw error;
        
        const newProfile = {
            name: data.user.user_metadata.full_name,
            company_name: data.user.user_metadata.company_name,
            role: data.user.user_metadata.role
        };
        setProfile(newProfile);
        return data;
    };

    const refreshSubscription = async () => {
        if (user) {
            const sub = await fetchSubscription(user.email);
            setSubscription(sub);
            return sub;
        }
    };

    const value = {
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
        isHR: () => profile?.role === 'HR',
        isAdmin: () => profile?.role === 'ADMIN',
        getCurrentUser: () => {
            if (!user) return null;
            return {
                id: user.id,
                email: user.email,
                fullName: profile?.name,
                companyName: profile?.company_name,
                role: profile?.role,
                token: token,
                subscription: subscription,
            };
        },
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
