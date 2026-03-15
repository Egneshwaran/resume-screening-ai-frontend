/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: { DEFAULT: 'var(--primary)', hover: 'var(--primary-hover)' },
                accent: { purple: 'var(--accent-purple)', pink: 'var(--accent-pink)', cyan: 'var(--accent-cyan)' },
                success: 'var(--success)',
                background: 'var(--background)',
                card: 'var(--card)',
                surface: 'var(--surface)',
                foreground: { DEFAULT: 'var(--foreground)', dim: 'var(--foreground-dim)', muted: 'var(--foreground-muted)' },
                border: 'var(--border-color)',
                input: 'var(--input)',
            },
            fontFamily: { inter: ['Inter', 'sans-serif'], outfit: ['Outfit', 'sans-serif'] },
            animation: { 'fade-in': 'fadeIn 0.5s ease-out forwards' },
            keyframes: {
                fadeIn: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                shimmer: { '100%': { transform: 'translateX(100%)' } }
            },
        },
    },
    plugins: [],
}
