import React, { useState } from 'react';
import { Bell, Search, User, Menu, ChevronDown, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ toggleSidebar }) => {
    const { profile, signOut } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Screening Complete', message: 'Frontend Dev screening for 12 candidates is done.', time: '2m ago', type: 'success', unread: true },
        { id: 2, title: 'New Application', message: 'John Doe applied for Backend Engineer role.', time: '1h ago', type: 'info', unread: true },
        { id: 3, title: 'System Update', message: 'AI Engine updated to v2.4 for better accuracy.', time: '5h ago', type: 'system', unread: false },
    ]);
    const navigate = useNavigate();

    const unreadCount = notifications.filter(n => n.unread).length;

    const handleLogout = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        console.log('Navbar: Sign out button clicked');
        signOut(); 
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
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

                    <div className="relative">
                        <button 
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowUserMenu(false);
                            }}
                            className={`relative p-2 rounded-xl transition-all duration-200 ${showNotifications ? 'bg-indigo-500/10 text-indigo-500' : 'hover:bg-black/5 dark:hover:bg-white/5 text-foreground-muted'}`}
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-background animate-pulse"></span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <div className="p-4 border-b border-border flex items-center justify-between bg-black/5 dark:bg-white/5">
                                    <h3 className="font-bold text-foreground">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button 
                                            onClick={markAllAsRead}
                                            className="text-[10px] uppercase font-black text-indigo-500 hover:text-indigo-400 transition-colors"
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                                    {notifications.length > 0 ? (
                                        notifications.map((n) => (
                                            <div 
                                                key={n.id} 
                                                className={`p-4 border-b border-border/50 flex gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer ${n.unread ? 'bg-indigo-500/5' : ''}`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                                                    n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    n.type === 'info' ? 'bg-blue-500/10 text-blue-500' :
                                                    'bg-indigo-500/10 text-indigo-500'
                                                }`}>
                                                    <Bell size={18} />
                                                </div>
                                                <div className="space-y-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className={`text-sm font-bold truncate ${n.unread ? 'text-foreground' : 'text-foreground-muted'}`}>{n.title}</p>
                                                        <span className="text-[10px] text-foreground-muted whitespace-nowrap font-medium">{n.time}</span>
                                                    </div>
                                                    <p className="text-xs text-foreground-muted leading-relaxed line-clamp-2">{n.message}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-12 text-center text-foreground-muted">
                                            <Bell size={40} className="mx-auto mb-4 opacity-20" />
                                            <p className="font-medium">All caught up!</p>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => {
                                        navigate('/admin/notifications');
                                        setShowNotifications(false);
                                    }}
                                    className="w-full p-3 text-xs font-bold text-foreground-muted hover:text-indigo-500 hover:bg-indigo-500/5 transition-all text-center border-t border-border mt-auto"
                                >
                                    View All Notifications
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="h-8 w-[1px] bg-border hidden sm:block"></div>

                    <div className="relative">
                        <div
                            className="flex items-center gap-3 pl-2 cursor-pointer group"
                            onClick={() => {
                                setShowUserMenu(!showUserMenu);
                                setShowNotifications(false);
                            }}
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-foreground">{profile?.full_name || 'HR Manager'}</p>
                                <p className="text-[10px] text-foreground-muted uppercase tracking-wider">{profile?.role || 'HR'} Access</p>
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
