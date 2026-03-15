import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Building, Shield, CheckCircle, Loader2, Edit, Save, X, Lock, Camera, Key, BarChart3, Users } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import jobService from '../services/jobs.service';
import resumeService from '../services/resumes.service';

const Profile = () => {
    const { profile, user, loading, subscription, updateProfileData, updatePassword } = useAuth();
    const [stats, setStats] = useState({ jobs: 0, resumes: 0, accuracy: 98 });
    const [isFetchingStats, setIsFetchingStats] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        company_name: ''
    });
    const [savingDetails, setSavingDetails] = useState(false);
    const [detailsError, setDetailsError] = useState(null);
    const [detailsSuccess, setDetailsSuccess] = useState(null);

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passData, setPassData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [savingPass, setSavingPass] = useState(false);
    const [passError, setPassError] = useState(null);
    const [passSuccess, setPassSuccess] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                company_name: profile.company_name || ''
            });
        }
    }, [profile]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const jRes = await jobService.getAllJobs();
                const rRes = await resumeService.getAllResumes();
                setStats({
                    jobs: jRes?.data?.length || 0,
                    resumes: rRes?.data?.length || 0,
                    accuracy: 98
                });
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setIsFetchingStats(false);
            }
        };
        fetchStats();
    }, []);

    const handleSaveDetails = async () => {
        if (!user) return;
        setSavingDetails(true);
        setDetailsError(null);
        setDetailsSuccess(null);
        try {
            console.log("Saving details...", formData);
            await updateProfileData(user.id, formData);
            console.log("Details saved.");
            setDetailsSuccess("Profile updated successfully!");
            setTimeout(() => {
                setIsEditing(false);
                setDetailsSuccess(null);
            }, 1500);
        } catch (error) {
            console.error("Failed to update profile", error);
            setDetailsError(error.message || "Failed to update profile.");
        } finally {
            setSavingDetails(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPassError(null);
        setPassSuccess(null);

        if (passData.newPassword.length < 6) {
            setPassError("Password must be at least 6 characters.");
            return;
        }
        if (passData.newPassword !== passData.confirmPassword) {
            setPassError("Passwords do not match.");
            return;
        }

        setSavingPass(true);
        try {
            await updatePassword(passData.newPassword);
            setPassSuccess("Password updated successfully.");
            setPassData({ newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                setIsChangingPassword(false);
                setPassSuccess(null);
            }, 2000);
        } catch (err) {
            console.error(err);
            setPassError(err.message || "Failed to change password.");
        } finally {
            setSavingPass(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;

        // Ensure smaller than 2MB for base64 storage
        if (file.size > 2 * 1024 * 1024) {
            alert("Please select an image smaller than 2MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result;
            try {
                await updateProfileData(user.id, { avatar_url: base64String });
                setDetailsSuccess("Avatar updated successfully!");
                setTimeout(() => setDetailsSuccess(null), 2000);
            } catch (error) {
                console.error("Failed to upload avatar", error);
                setDetailsError("Failed to upload avatar");
                setTimeout(() => setDetailsError(null), 3000);
            }
        };
        reader.readAsDataURL(file);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Account Profile</h1>
                <p className="text-foreground-muted mt-1">Manage your professional identity and account settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card flex flex-col items-center text-center overflow-hidden">

                        {/* Avatar Header Background */}
                        <div className="h-24 w-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 mb-12 relative">
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-[3px] shadow-xl shadow-indigo-500/20 relative z-10 transition-transform group-hover:scale-105">
                                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                            {profile?.avatar_url ? (
                                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={36} className="text-indigo-500 dark:text-indigo-400" />
                                            )}
                                        </div>
                                    </div>
                                    {/* Edit Overlay */}
                                    <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center m-[3px]">
                                        <Camera size={20} className="text-white" />
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleAvatarUpload}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 pt-0 w-full flex flex-col items-center text-center">
                            <h2 className="text-2xl font-bold text-foreground">{profile?.full_name || 'Full Name'}</h2>
                            <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm">{profile?.role} Account</p>

                            <div className="mt-6 w-full space-y-4 pt-6 border-t border-border">
                                <div className="flex items-center gap-3 text-foreground-muted text-sm px-2">
                                    <Mail size={16} className="text-foreground-muted/70 min-w-[16px]" />
                                    <span className="truncate">{profile?.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-foreground-muted text-sm px-2">
                                    <Building size={16} className="text-foreground-muted/70 min-w-[16px]" />
                                    <span className="truncate">{profile?.company_name || 'Not Specified'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 border-indigo-500/10 dark:border-indigo-500/10 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 text-indigo-500/5">
                            <Shield size={120} />
                        </div>
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-4 relative z-10">Account Security</h3>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Shield size={16} className="text-emerald-500" />
                                    <span className="text-xs text-foreground-muted font-medium">Two-Factor Auth</span>
                                </div>
                                <span className="text-[10px] bg-black/10 dark:bg-white/10 text-foreground-muted px-2 py-0.5 rounded uppercase font-bold text-xs">Disabled</span>
                            </div>

                            {!isChangingPassword ? (
                                <button
                                    onClick={() => setIsChangingPassword(true)}
                                    className="w-full py-2 bg-black/5 dark:bg-white/5 hover:bg-indigo-500 hover:text-white border border-border hover:border-indigo-500 rounded-lg text-xs font-bold transition-all text-foreground flex items-center justify-center gap-2 group"
                                >
                                    <Key size={14} className="group-hover:text-white" /> Change Password
                                </button>
                            ) : (
                                <form onSubmit={handlePasswordChange} className="space-y-3 bg-background/50 p-4 rounded-xl border border-indigo-500/30 animate-in fade-in zoom-in-95">
                                    <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Update Password</h4>
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        value={passData.newPassword}
                                        onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                                        className="w-full bg-input border border-border rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500"
                                        required
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={passData.confirmPassword}
                                        onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                                        className="w-full bg-input border border-border rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500"
                                        required
                                    />
                                    {passError && <p className="text-[10px] text-rose-500 font-bold">{passError}</p>}
                                    {passSuccess && <p className="text-[10px] text-emerald-500 font-bold">{passSuccess}</p>}

                                    <div className="flex gap-2 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setIsChangingPassword(false)}
                                            className="flex-1 py-2 rounded-lg text-xs font-bold text-foreground-muted hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={savingPass}
                                            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-lg shadow-indigo-500/20 transition-colors disabled:opacity-50"
                                        >
                                            {savingPass ? 'Saving...' : 'Update'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Detail Sections */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h3 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                                <User size={20} className="text-indigo-500" />
                                Identity Information
                            </h3>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-indigo-500 hover:text-white border border-border hover:border-indigo-500 text-foreground font-bold transition-all flex items-center gap-2 text-xs shadow-sm hover:shadow-lg hover:shadow-indigo-500/20"
                                >
                                    <Edit size={12} /> Edit Details
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({ full_name: profile?.full_name || '', company_name: profile?.company_name || '' });
                                        }}
                                        className="p-1.5 rounded-lg border border-border text-foreground-muted hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                    <button
                                        onClick={handleSaveDetails}
                                        disabled={savingDetails}
                                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {savingDetails ? <Loader2 className="animate-spin" size={12} /> : <Save size={12} />}
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>

                        {detailsError && <p className="text-[10px] text-rose-500 font-bold mb-4 px-2">{detailsError}</p>}
                        {detailsSuccess && <p className="text-[10px] text-emerald-500 font-bold mb-4 px-2">{detailsSuccess}</p>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-foreground-muted block">Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full bg-input border border-indigo-500/50 rounded-lg p-2.5 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                        placeholder="Enter full name"
                                    />
                                ) : (
                                    <p className="text-foreground font-bold text-lg">{profile?.full_name}</p>
                                )}
                            </div>

                            {/* Company Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-foreground-muted block">Company Affiliation</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.company_name}
                                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                        className="w-full bg-input border border-indigo-500/50 rounded-lg p-2.5 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                        placeholder="Enter company name"
                                    />
                                ) : (
                                    <p className="text-foreground font-bold text-lg">{profile?.company_name || 'Not provided'}</p>
                                )}
                            </div>

                            {/* Immutable Fields Below */}
                            <div className="space-y-2 pt-4 border-t border-border">
                                <label className="text-[10px] uppercase tracking-widest font-black text-foreground-muted block flex items-center gap-1.5">
                                    <Mail size={12} /> Primary Email <Lock size={10} className="text-foreground-muted/50 ml-1" />
                                </label>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-foreground font-medium text-sm">{profile?.email}</p>
                                    <CheckCircle size={14} className="text-emerald-500" />
                                </div>
                            </div>
                            <div className="space-y-2 pt-4 border-t border-border">
                                <label className="text-[10px] uppercase tracking-widest font-black text-foreground-muted block flex items-center gap-1.5">
                                    <Shield size={12} /> Account Level <Lock size={10} className="text-foreground-muted/50 ml-1" />
                                </label>
                                <div className="inline-flex items-center px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md gap-2 mt-1">
                                    <Shield size={12} className="text-indigo-600 dark:text-indigo-400" />
                                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">{profile?.role} Access</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Section */}
                    <div className="glass-card p-8 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/10 dark:border-indigo-500/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Shield size={64} className="text-indigo-500" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                            <CheckCircle size={20} className="text-indigo-500" />
                            Subscription Plan
                        </h3>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-widest font-black text-foreground-muted">Current Plan</p>
                                <p className="text-2xl font-black text-foreground tracking-tight">
                                    {subscription ? subscription.plan_name : 'Free Trial'}
                                </p>
                                {subscription && (
                                    <p className="text-xs text-foreground-muted">
                                        Renews on {new Date(subscription.end_date).toLocaleDateString()}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-widest font-black text-foreground-muted">Usage</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-2xl font-black text-foreground tracking-tight">
                                        {subscription
                                            ? (subscription.resume_limit >= 999999
                                                ? `${subscription.resumes_used || 0} / Unlimited`
                                                : `${subscription.resumes_used || 0}/${subscription.resume_limit}`)
                                            : '0/5'}
                                    </p>
                                    <p className="text-xs text-foreground-muted mb-1.5 uppercase font-bold tracking-tighter">Resumes</p>
                                </div>
                                <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1 max-w-[150px]">
                                    <div
                                        className="h-full bg-indigo-500"
                                        style={{ width: `${Math.min(100, (subscription ? ((subscription.resumes_used || 0) / subscription.resume_limit) * 100 : 0))}%` }}
                                    ></div>
                                </div>
                            </div>

                            <button
                                onClick={() => window.location.href = '/#pricing'}
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/20"
                            >
                                {user?.subscription ? 'Upgrade Plan' : 'Get Started'}
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-foreground">Usage Statistics</h3>
                            {isFetchingStats && <Loader2 className="animate-spin text-indigo-500" size={18} />}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="p-6 bg-black/5 dark:bg-white/5 rounded-2xl border border-border relative overflow-hidden group">
                                <div className="absolute -right-4 -bottom-4 bg-indigo-500/10 p-4 rounded-full transition-transform group-hover:scale-150 group-hover:bg-indigo-500/20">
                                    <BarChart3 size={32} className="text-indigo-500/50" />
                                </div>
                                <p className="text-3xl font-black text-foreground relative z-10">{stats.jobs}</p>
                                <p className="text-[10px] text-foreground-muted uppercase font-bold tracking-wider mt-2 relative z-10">Jobs Posted</p>
                            </div>
                            <div className="p-6 bg-black/5 dark:bg-white/5 rounded-2xl border border-border relative overflow-hidden group">
                                <div className="absolute -right-4 -bottom-4 bg-purple-500/10 p-4 rounded-full transition-transform group-hover:scale-150 group-hover:bg-purple-500/20">
                                    <Users size={32} className="text-purple-500/50" />
                                </div>
                                <p className="text-3xl font-black text-foreground relative z-10">{stats.resumes}</p>
                                <p className="text-[10px] text-foreground-muted uppercase font-bold tracking-wider mt-2 relative z-10">Resumes Screened</p>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl border border-transparent shadow-xl shadow-indigo-500/20">
                                <p className="text-3xl font-black text-white">{stats.accuracy}%</p>
                                <p className="text-[10px] text-white/80 uppercase font-black tracking-wider mt-2">AI Accuracy Score</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
