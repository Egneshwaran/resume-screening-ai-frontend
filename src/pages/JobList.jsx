import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ChevronRight, Loader2, Briefcase, Trash2 } from 'lucide-react';
import jobService from '../services/jobs.service';
import { useAuth } from '../context/AuthContext';

const JobList = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [clearing, setClearing] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await jobService.getAllJobs();
            setJobs(response.data || []);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm("Are you sure you want to clear ALL job roles? This will also remove associated screening results.")) return;

        try {
            setClearing(true);
            await jobService.clearAllJobs(token);
            fetchJobs();
        } catch (error) {
            console.error('Failed to clear jobs:', error);
            alert("Failed to clear jobs.");
        } finally {
            setClearing(false);
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.required_skills && job.required_skills.toLowerCase().includes(searchQuery.toLowerCase()))
    );


    if (loading && !clearing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <p className="text-slate-400 animate-pulse">Loading job roles...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Job Roles</h1>
                    <p className="text-foreground-muted">Manage open positions and view rankings.</p>
                </div>
                <div className="flex gap-3">
                    {jobs.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            disabled={clearing}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 px-4 py-2 rounded-xl flex items-center gap-2 transition-all border border-rose-500/20 disabled:opacity-50"
                        >
                            {clearing ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                            <span>Clear All</span>
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/admin/jobs/new')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                    >
                        <Plus size={20} />
                        <span>Post New Job</span>
                    </button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl py-3 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </div>

            {filteredJobs.length > 0 ? (
                <div className="grid gap-4">
                    {filteredJobs.map(job => (
                        <div key={job.id} onClick={() => navigate(`/admin/rankings/${job.id}`)} className="glass-card p-6 flex items-center justify-between hover:border-primary/50 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all cursor-pointer group">
                            <div className="space-y-1">
                                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                                <div className="flex gap-4 text-sm text-foreground-muted">
                                    <span>{job.location || 'Remote'}</span>
                                    <span>•</span>
                                    <span className="text-primary font-medium">View Analysis Results</span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {(job.required_skills || '').split(',').map((skill, idx) => (
                                        skill.trim() && <span key={idx} className="bg-border px-2 py-0.5 rounded text-xs text-foreground-dim">{skill.trim()}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm(`Delete the "${job.title}" role?`)) {
                                            jobService.deleteJob(job.id, token).then(() => fetchJobs());
                                        }
                                    }}
                                    className="p-2 text-foreground-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <ChevronRight className="text-foreground-muted group-hover:text-foreground transition-all transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card p-16 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-4 bg-border rounded-full text-foreground-muted">
                        <Briefcase size={36} />
                    </div>
                    <p className="text-lg font-bold text-foreground">
                        {searchQuery ? 'No matching job roles' : 'No job roles available'}
                    </p>
                    <p className="text-foreground-muted text-sm">
                        {searchQuery
                            ? 'Try a different search term.'
                            : 'Please create a job role first to start screening candidates.'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={() => navigate('/admin/jobs/new')}
                            className="mt-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20"
                        >
                            Get Started
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobList;
