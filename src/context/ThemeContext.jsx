import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Retrieve theme from localStorage or default to 'dark'
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedPrefs = window.localStorage.getItem('ui-theme');
            if (typeof storedPrefs === 'string') {
                return storedPrefs;
            }
            // Optional: fallback to system preference
            // const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
            // if (userMedia.matches) return 'dark';
        }
        return 'dark'; // Keep default as dark to match existing design
    });

    useEffect(() => {
        const root = window.document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('ui-theme', theme);
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
