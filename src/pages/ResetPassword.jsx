import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
    const navigate = useNavigate();
    const { updatePassword, user, loading } = useAuth();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // If auth state is resolved and no user session exists,
        // it means they didn't come from a valid recovery link.
        if (!loading && !user && status !== 'success') {
            setStatus('error');
            setMessage('Invalid or expired reset token. Please request a new link.');
        } else if (!loading && user && status === 'error' && message.includes('expired')) {
            // Reset error if user successfully authenticates via token
            setStatus('idle');
            setMessage('');
        }
    }, [user, loading, status, message]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            setStatus('error');
            setMessage('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match.');
            return;
        }

        setStatus('loading');
        try {
            await updatePassword(password);
            setStatus('success');
            setMessage('Your password has been successfully reset.');

            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setStatus('error');
            setMessage(err.message || 'Failed to reset password. The link may be expired.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-in fade-in duration-500">
                {/* Brand Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
                        <span className="text-2xl font-bold text-white">AI</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">AI-Recruiter</h1>
                </div>

                {/* Reset Card */}
                <div className="glass-card p-8 border border-white/10 shadow-2xl">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-white">Set New Password</h2>
                        <p className="text-slate-400 text-sm mt-1">Please enter your new secure password below.</p>
                    </div>

                    {status === 'success' ? (
                        <div className="space-y-6">
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-sm animate-in slide-in-from-top-2">
                                <CheckCircle size={18} />
                                <span>{message}</span>
                            </div>
                            <p className="text-center text-slate-500 text-sm">Redirecting you to login page...</p>
                            <Link
                                to="/login"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={18} />
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {status === 'error' && (
                                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm animate-in slide-in-from-top-2">
                                    <AlertCircle size={18} />
                                    <span>{message}</span>
                                </div>
                            )}

                            {!loading && user && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400 ml-1">New Password</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                                <Lock size={20} />
                                            </div>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400 ml-1">Confirm New Password</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                                <Lock size={20} />
                                            </div>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group mt-2"
                                    >
                                        {status === 'loading' ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <span>Update Password</span>
                                        )}
                                    </button>
                                </>
                            )}

                            <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-white transition-colors group">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Back to Login
                            </Link>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
