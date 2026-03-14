import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
const LandingNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const isAuthenticated = !!user;

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'ATS Checker', href: '/resume-checker', internal: true },
        { name: 'AI Screening', href: '/admin/jobs', internal: true },
        { name: 'Features', href: '#features', internal: false },
        { name: 'How It Works', href: '#how-it-works', internal: false },
        { name: 'Pricing', href: '#pricing', internal: false },
    ];

    return (
        <nav className={`fixed top-4 left-0 right-0 z-50 transition-all duration-500 transform ${isScrolled ? 'px-4' : 'px-8'}`}>
            <div className={`max-w-7xl mx-auto px-6 py-3 transition-all duration-500 ${isScrolled ? 'glass-card bg-background/80 backdrop-blur-xl border border-border shadow-2xl rounded-[2rem]' : 'bg-transparent'}`}>
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden bg-white">
                            <img src="/logo.png" alt="RecruitAI Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-foreground">
                            Recruit<span className="gradient-text">AI</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-10">
                        {navLinks.map((link) => (
                            link.internal ? (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="text-sm font-semibold text-foreground-muted hover:text-foreground transition-colors relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full"></span>
                                </Link>
                            ) : (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-semibold text-foreground-muted hover:text-foreground transition-colors relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full"></span>
                                </a>
                            )
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden lg:flex items-center gap-6">
                        <ThemeToggle />
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/admin"
                                    className="flex items-center gap-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground px-6 py-2.5 rounded-xl text-sm font-bold transition-all border border-border"
                                >
                                    <LayoutDashboard size={18} /> Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-rose-500/10"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-bold text-foreground-muted hover:text-foreground transition-colors">
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="premium-button px-7 py-3 rounded-xl text-sm font-bold flex items-center gap-2"
                                >
                                    Join Now <ArrowRight size={16} />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 text-foreground bg-black/5 dark:bg-white/5 rounded-xl border border-border"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-4 right-4 mt-4 glass-card bg-background/95 backdrop-blur-2xl border border-border p-6 rounded-[2rem] shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col gap-5">
                        {navLinks.map((link) => (
                            link.internal ? (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="text-foreground-muted hover:text-foreground font-bold p-2 text-lg"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ) : (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-foreground-muted hover:text-foreground font-bold p-2 text-lg"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            )
                        ))}
                        <div className="h-px bg-border my-2"></div>
                        <div className="flex items-center justify-between py-2 px-2">
                            <span className="text-foreground-muted font-bold text-lg">Theme</span>
                            <ThemeToggle />
                        </div>
                        <div className="h-px bg-border my-2"></div>
                        {isAuthenticated ? (
                            <div className="flex flex-col gap-4">
                                <Link
                                    to="/admin"
                                    className="premium-button text-white text-center py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <LayoutDashboard size={20} /> Pro Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-rose-500/10 text-rose-400 text-center py-4 rounded-xl font-bold border border-rose-500/10 flex items-center justify-center gap-2"
                                >
                                    <LogOut size={20} /> Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <Link
                                    to="/login"
                                    className="text-foreground-muted hover:text-foreground font-bold py-3 text-center text-lg"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="premium-button text-white text-center py-4 rounded-xl font-bold text-lg"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};


export default LandingNavbar;
