import React, { useState } from 'react';
import { Bell, Search, User, Menu, ChevronDown, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ toggleSidebar }) => {
    const { profile, signOut } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-30 px-4 lg:px-8 transition-colors duration-300">
            <div className="h-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-foreground-muted lg:hidden transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="hidden md:flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-border px-4 py-2 rounded-xl w-64 lg:w-96 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
                        <Search size={18} className="text-foreground-muted" />
                        <input
                            type="text"
                            placeholder="Search resumes, jobs..."
                            className="bg-transparent border-none focus:ring-0 text-sm w-full text-foreground placeholder-foreground-muted"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 lg:gap-6">
                    <ThemeToggle />

                    <button className="relative p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-foreground-muted transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-background"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-border hidden sm:block"></div>

                    <div className="relative">
                        <div
                            className="flex items-center gap-3 pl-2 cursor-pointer group"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-foreground">{profile?.full_name || 'Guest user'}</p>
                                <p className="text-[10px] text-foreground-muted uppercase tracking-wider">{profile?.role || 'Basic'} Access</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px]">
                                <div className="w-full h-full rounded-[10px] bg-card flex items-center justify-center">
                                    <User size={20} className="text-indigo-400" />
                                </div>
                            </div>
                            <ChevronDown size={16} className={`text-foreground-muted group-hover:text-foreground transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                        </div>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-3 w-56 bg-card border border-border rounded-2xl shadow-2xl z-[60] py-2 animate-in fade-in slide-in-from-top-2">
                                <Link
                                    to="/admin/profile"
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-colors"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <User size={16} className="text-indigo-400" />
                                    Your Profile
                                </Link>
                                <Link
                                    to="/admin/settings"
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-colors"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <Settings size={16} className="text-foreground-muted" />
                                    Account Settings
                                </Link>
                                <div className="h-[1px] bg-border my-1 mx-2"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
