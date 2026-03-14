import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Code2,
    Clock,
    FileText,
    Plus,
    X,
    ArrowLeft,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import jobService from '../services/jobs.service';

const CreateJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requiredSkills: '',
        experience: '2-4 years',
        location: 'Remote',
        skillWeight: 50,
        experienceWeight: 30,
        descriptionWeight: 20
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        if (!formData.title || !formData.description || !formData.requiredSkills.trim()) {
            setError('Please fill in all required fields (Title, Description, and Skills).');
            return;
        }

        const totalWeight = parseInt(formData.skillWeight) + parseInt(formData.experienceWeight) + parseInt(formData.descriptionWeight);
        if (totalWeight !== 100) {
            setError(`Total weight must be exactly 100%. Current total: ${totalWeight}%`);
            return;
        }

        setError('');
        setLoading(true);

        try {
            await jobService.createJob({
                title: formData.title,
                description: formData.description,
                requiredSkills: formData.requiredSkills,
                requiredExperience: formData.experience,
                location: formData.location,
                skillWeight: formData.skillWeight,
                experienceWeight: formData.experienceWeight,
                descriptionWeight: formData.descriptionWeight
            });

            setSuccess(true);
            setTimeout(() => {
                navigate('/admin/jobs');
            }, 1500);
        } catch (err) {
            console.error("Job Creation Error:", err);
            setError(err.message || 'Failed to create job role. Please check your connection or try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Job Role Created!</h2>
                <p className="text-foreground-muted">Redirecting you back to the job list...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/jobs')}
                        className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground-muted hover:text-foreground transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Create Job Role</h1>
                        <p className="text-foreground-muted">Define the requirements for your new position.</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center gap-3 text-rose-400 text-sm animate-in shake duration-500">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="glass-card p-6 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-2">
                            <Briefcase size={14} /> Basic Information
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-foreground-muted uppercase ml-1">Job Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Senior Java Developer"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="sm:col-span-3 space-y-1">
                                <label className="text-xs font-bold text-foreground-muted uppercase ml-1">Required Experience</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                                    <select
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        className="w-full bg-input border border-border rounded-xl pl-12 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                                    >
                                        <option>0-1 years</option>
                                        <option>2-4 years</option>
                                        <option>5-8 years</option>
                                        <option>8+ years</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-indigo-400 uppercase ml-1">Weight %</label>
                                <input
                                    type="number"
                                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    value={formData.experienceWeight}
                                    onChange={(e) => setFormData({ ...formData, experienceWeight: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-foreground-muted uppercase ml-1">Job Location</label>
                            <input
                                type="text"
                                placeholder="e.g. Remote, New York, NY"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-sans"
                            />
                        </div>
                    </div>

                    {/* Skills Selection */}
                    <div className="glass-card p-6 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-2">
                            <Code2 size={14} /> Skills & Qualifications
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="sm:col-span-3 space-y-1">
                                <label className="text-xs font-bold text-foreground-muted uppercase ml-1">Key Skills (Comma separated)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Java, Spring Boot, MySQL"
                                    value={formData.requiredSkills}
                                    onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-sans"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-indigo-400 uppercase ml-1">Weight %</label>
                                <input
                                    type="number"
                                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    value={formData.skillWeight}
                                    onChange={(e) => setFormData({ ...formData, skillWeight: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="glass-card p-6 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-2">
                        <FileText size={14} /> Detailed Description
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="sm:col-span-3 space-y-1">
                            <label className="text-xs font-bold text-foreground-muted uppercase ml-1">Roles & Responsibilities</label>
                            <textarea
                                rows="8"
                                placeholder="Describe the job role, matching criteria, and expectations..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none font-sans"
                            ></textarea>
                            <div className="flex justify-between items-center px-1">
                                <p className="text-[10px] text-foreground-muted font-medium italic">Supports Markdown-style formatting when displayed.</p>
                                <p className="text-[10px] text-foreground-muted font-medium">{formData.description.length} characters</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-indigo-400 uppercase ml-1">Weight %</label>
                            <input
                                type="number"
                                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                value={formData.descriptionWeight}
                                onChange={(e) => setFormData({ ...formData, descriptionWeight: parseInt(e.target.value) || 0 })}
                            />
                            <div className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                                <p className="text-[9px] uppercase font-black text-indigo-400 mb-1">Combined Score</p>
                                <p className={`text-xl font-bold ${parseInt(formData.skillWeight) + parseInt(formData.experienceWeight) + parseInt(formData.descriptionWeight) === 100 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {parseInt(formData.skillWeight) + parseInt(formData.experienceWeight) + parseInt(formData.descriptionWeight)}%
                                </p>
                                <p className="text-[8px] text-slate-400 leading-tight mt-1">Total must equal 100%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/jobs')}
                        className="px-8 py-3 rounded-xl text-sm font-bold text-foreground-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-10 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {loading ? 'Creating...' : 'Create Job Role'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateJob;
