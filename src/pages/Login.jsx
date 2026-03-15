import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signIn, user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/admin');
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        try {
            if (typeof signIn !== 'function') {
                throw new Error('Authentication service is not initialized properly. Please refresh the page.');
            }
            await signIn({ email, password });
            navigate('/admin', { replace: true });
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Invalid email or password.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-500/30">
            <div className="noise-overlay hidden dark:block"></div>

            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full -z-10 animate-float"></div>

            <div className="w-full max-w-lg relative z-10 transition-all duration-700 animate-in fade-in slide-in-from-bottom-8">
                {/* Brand Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-8 overflow-hidden border border-border group hover:rotate-6 transition-transform duration-500 bg-white">
                        <img src="/logo.png" alt="RecruitAI Logo" className="w-full h-full object-cover" />
                    </div>
                    <div className="headline-glow">
                        <h1 className="text-4xl font-black text-foreground tracking-tight leading-none mb-2">Recruit<span className="gradient-text">AI</span></h1>
                    </div>
                    <p className="text-foreground-muted font-bold uppercase tracking-[0.2em] text-[10px] bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full border border-border">Enterprise Intelligence</p>
                </div>

                {/* Login Card */}
                <div className="glass-card p-10 md:p-14 border-border shadow-2xl backdrop-blur-3xl relative overflow-hidden">
                    {/* Subtle Internal Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full"></div>

                    <div className="mb-10 text-center relative z-10">
                        <h2 className="text-3xl font-black text-foreground mb-2 tracking-tight">Welcome Back</h2>
                        <p className="text-foreground-muted font-medium">Log in to access your dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-sm font-medium animate-in slide-in-from-top-2">
                            <AlertCircle size={20} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        <div className="space-y-2.5">
                            <label className="text-xs font-black text-foreground-muted ml-1 uppercase tracking-widest">Email Address</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-indigo-400 transition-colors duration-300">
                                    <User size={22} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email..."
                                    className="w-full bg-input border border-border rounded-2xl py-5 pl-14 pr-6 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40 transition-all placeholder:text-foreground-muted font-medium text-lg"
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-xs font-black text-foreground-muted ml-1 uppercase tracking-widest">Password</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-indigo-400 transition-colors duration-300">
                                    <Lock size={22} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password..."
                                    className="w-full bg-input border border-border rounded-2xl py-5 pl-14 pr-6 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40 transition-all placeholder:text-foreground-muted font-medium text-lg"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm font-bold px-1">
                            <label className="flex items-center gap-2.5 text-foreground-muted cursor-pointer hover:text-foreground transition-all group">
                                <input type="checkbox" className="rounded-lg border-border bg-black/5 dark:bg-white/5 text-indigo-600 focus:ring-indigo-500/20 w-5 h-5 shadow-inner transition-all group-hover:bg-black/10 dark:group-hover:bg-white/10" />
                                Remember Me
                            </label>
                            <Link to="/forgot-password" size="sm" className="text-indigo-400 hover:text-indigo-300 transition-all border-b border-indigo-500/20 hover:border-indigo-400">Forgot Password?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full premium-button disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 group mt-6 text-lg tracking-tight"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    <span>Log In</span>
                                    <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center relative z-10 pt-8 border-t border-border">
                        <p className="text-foreground-muted font-medium">
                            New here? {' '}
                            <Link to="/signup" className="text-indigo-400 font-black hover:text-indigo-300 transition-all ml-1 border-b-2 border-indigo-500/20 hover:border-indigo-400">
                                Create an Account
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="mt-10 text-center text-[10px] text-foreground-muted uppercase tracking-[0.4em] font-black opacity-50">
                    &copy; MMXXVI RecruitAI / SECURED-ENCRYPTED-AI
                </p>
            </div>
        </div>
    );
};

export default Login;
