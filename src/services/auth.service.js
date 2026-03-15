import { supabase } from '../lib/supabase';

class AuthService {
    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;

        const metadata = data.user.user_metadata || {};
        const userData = {
            id: data.user.id,
            email: data.user.email,
            fullName: metadata.full_name,
            companyName: metadata.company_name,
            role: metadata.role || 'HR',
            token: data.session?.access_token,
        };

        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    }

    async signup({ name, email, company, password }) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    company_name: company,
                    role: 'HR'
                }
            }
        });

        if (error) throw error;

        return { message: 'Signup successful! Please check your email to confirm.' };
    }

    async logout() {
        await supabase.auth.signOut();
        localStorage.removeItem('user');
        localStorage.clear();
        sessionStorage.clear();
    }

    getCurrentUser() {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return null;
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            localStorage.removeItem('user');
            return null;
        }
    }

    isAuthenticated() {
        return !!this.getCurrentUser();
    }

    isHR() {
        const user = this.getCurrentUser();
        return user && (user.role === 'HR' || user.role === 'ADMIN');
    }

    async forgotPassword(email) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        return { message: 'Password reset email sent!' };
    }

    async resetPassword(token, newPassword) {
        // In Supabase, resetPassword usually involves updating the user's password 
        // after they've clicked the link and are in a session.
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) throw error;
        return { message: 'Password updated successfully!' };
    }
}

export default new AuthService();
