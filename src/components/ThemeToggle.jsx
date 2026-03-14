import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-white/5 transition-all outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
            <div className="relative w-5 h-5 flex items-center justify-center">
                <Sun
                    size={20}
                    className={`absolute transition-all duration-300 transform ${theme === 'dark'
                            ? 'opacity-0 scale-50 rotate-90'
                            : 'opacity-100 scale-100 rotate-0 text-amber-500'
                        }`}
                />
                <Moon
                    size={20}
                    className={`absolute transition-all duration-300 transform ${theme === 'dark'
                            ? 'opacity-100 scale-100 rotate-0'
                            : 'opacity-0 scale-50 -rotate-90'
                        }`}
                />
            </div>
        </button>
    );
};

export default ThemeToggle;
