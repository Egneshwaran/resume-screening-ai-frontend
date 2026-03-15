import axios from 'axios';
import { supabase } from '../lib/supabase';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 15000, // Increased to 15 seconds for slower deployments
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add auth token
// Interceptor to add auth token
api.interceptors.request.use((config) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error getting session for API request:', error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Check if we're already on login to avoid loops
            if (!window.location.pathname.includes('/login')) {
                console.warn('Auth Error: Redirecting to login...');
                localStorage.removeItem('user');
                window.location.href = '/login?expired=true';
            }
        }
        return Promise.reject(error);
    }
);


export default api;
