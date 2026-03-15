import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    CheckCircle2,
    AtSign,
    Building2,
    User,
    Lock,
    ShieldCheck,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            await signUp({
                email: formData.email,
                password: formData.password,
                fullName: formData.name,
                companyName: formData.company,
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.message || 'Registration failed.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden relative selection:bg-indigo-500/30">
            <div className="noise-overlay hidden dark:block"></div>

            {/* Ambient Background Light */}
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/10 blur-[150px] rounded-full -z-0 animate-pulse-slow"></div>

            {/* Left Side: AI Benefits Panel */}
            <div className="lg:w-1/2 p-8 lg:p-24 flex flex-col justify-center text-foreground relative z-10 border-r border-border bg-gradient-to-br from-indigo-500/5 to-transparent">
                <div className="max-w-xl space-y-12 animate-in fade-in slide-in-from-left-8 duration-700">
                    <div>
                        <div className="flex items-center gap-4 mb-12 group">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 overflow-hidden border border-border group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shrink-0 bg-white">
                                <img src="/logo.png" alt="RecruitAI Logo" className="w-full h-full object-cover" />
                            </div>
                            <div className="headline-glow">
                                <span className="text-3xl font-black tracking-tighter text-foreground">Recruit<span className="gradient-text">AI</span></span>
                            </div>
                        </div>
                        <h1 className="text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight text-foreground">
                            Elevate your <br />
                            <span className="gradient-text">Hiring Potential</span>
                        </h1>
                        <p className="mt-8 text-foreground-muted text-xl font-medium max-w-md leading-relaxed">
                            Join the elite tier of recruitment. Automated intelligence with human-level <span className="text-foreground">nuance</span>.
                        </p>
                    </div>

                    <div className="space-y-10">
                        {[
                            { title: 'Neural Skill Analysis', desc: 'Identify top-tier candidates using deep semantic understanding.' },
                            { title: 'Explainable AI Ranking', desc: 'Detailed reasoning behind every evaluation metric.' },
                            { title: 'Predictive Culture Fit', desc: 'Align candidate trajectory with your organizational DNA.' }
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-start gap-6 group">
                                <div className="mt-1 p-3 bg-indigo-500/5 rounded-2xl text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/40 transition-all duration-500 group-hover:scale-110">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors">{benefit.title}</h3>
                                    <p className="text-foreground-muted leading-relaxed font-medium group-hover:text-foreground transition-colors">{benefit.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-12 border-t border-border">
                        <div className="flex items-center gap-6">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-2xl border-4 border-background bg-card shadow-xl overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-black/5 dark:from-white/10 to-transparent"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-foreground-muted text-[10px] font-black uppercase tracking-[0.2em]">Verified Network</p>
                                <p className="text-foreground font-bold text-sm tracking-tight">500+ Engineering Teams Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative z-10">
                <div className="w-full max-w-xl glass-card p-10 lg:p-14 border-border shadow-2xl backdrop-blur-3xl relative overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700">
                    {/* Atmospheric Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] -z-10 animate-pulse-slow"></div>

                    <div className="mb-12 text-center relative z-10">
                        <h2 className="text-4xl font-black text-foreground mb-3 tracking-tight">Create Your Account</h2>
                        <p className="text-foreground-muted font-medium">Set up your company workspace</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-sm font-medium animate-in slide-in-from-top-2">
                            <Lock size={18} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success ? (
                        <div className="text-center py-20 space-y-8 animate-in zoom-in duration-500">
                            <div className="w-28 h-28 bg-emerald-500/10 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 group animate-float">
                                <ShieldCheck size={56} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-foreground tracking-tight">Registration Successful</h3>
                                <p className="text-foreground-muted font-medium text-lg leading-relaxed italic opacity-80">Setting up your account... Redirecting to login.</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="space-y-2.5">
                                <label className="text-xs font-black text-foreground-muted uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-indigo-400 transition-colors duration-300" size={20} />
                                    <input
                                        type="text" name="name" required placeholder="John Doe"
                                        value={formData.name} onChange={handleChange}
                                        className="w-full bg-input border border-border rounded-2xl py-5 pl-14 pr-6 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40 text-foreground placeholder:text-foreground-muted transition-all font-medium text-lg"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-xs font-black text-foreground-muted uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-indigo-400 transition-colors duration-300" size={20} />
                                    <input
                                        type="email" name="email" required placeholder="you@company.com"
                                        value={formData.email} onChange={handleChange}
                                        className="w-full bg-input border border-border rounded-2xl py-5 pl-14 pr-6 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40 text-foreground placeholder:text-foreground-muted transition-all font-medium text-lg"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-xs font-black text-foreground-muted uppercase tracking-widest ml-1">Company / Organization</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-indigo-400 transition-colors duration-300" size={20} />
                                    <input
                                        type="text" name="company" required placeholder="Enter company name"
                                        value={formData.company} onChange={handleChange}
                                        className="w-full bg-input border border-border rounded-2xl py-5 pl-14 pr-6 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40 text-foreground placeholder:text-foreground-muted transition-all font-medium text-lg"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2.5">
                                    <label className="text-xs font-black text-foreground-muted uppercase tracking-widest ml-1">Password</label>
                                    <input
                                        type="password" name="password" required placeholder="At least 6 characters"
                                        value={formData.password} onChange={handleChange}
                                        className="w-full bg-input border border-border rounded-2xl py-5 px-6 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40 text-foreground placeholder:text-foreground-muted transition-all font-medium text-lg"
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-xs font-black text-foreground-muted uppercase tracking-widest ml-1">Confirm Password</label>
                                    <input
                                        type="password" name="confirmPassword" required placeholder="Re-enter password"
                                        value={formData.confirmPassword} onChange={handleChange}
                                        className="w-full bg-input border border-border rounded-2xl py-5 px-6 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40 text-foreground placeholder:text-foreground-muted transition-all font-medium text-lg"
                                    />
                                </div>
                            </div>

                            <div className="pt-8">
                                <button
                                    type="submit" disabled={loading}
                                    className="w-full premium-button py-5 rounded-2xl font-black flex items-center justify-center gap-3 group text-xl transition-all shadow-2xl tracking-tight"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={26} /> : (
                                        <>
                                            <span>Create Account</span>
                                            <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {!success && (
                        <div className="mt-12 text-center relative z-10 pt-8 border-t border-border">
                            <p className="text-foreground-muted font-medium">
                                Already have an account? {' '}
                                <Link to="/login" className="text-indigo-400 font-black hover:text-indigo-300 transition-all ml-1 border-b-2 border-indigo-500/20 hover:border-indigo-400">
                                    Log In
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-foreground-muted uppercase tracking-[0.5em] font-black opacity-30 pointer-events-none hidden lg:block">
                SECURE ACCESS - ENCRYPTED CHANNEL - MMXXVI
            </p>
        </div>
    );
};

export default Signup;
