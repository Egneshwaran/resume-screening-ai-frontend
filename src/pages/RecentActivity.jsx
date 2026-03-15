import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    ArrowLeft,
    Search,
    Filter,
    Briefcase,
    ChevronRight,
    Clock,
    ShieldCheck,
    Zap,
    TrendingUp,
    FileText,
    Users
} from 'lucide-react';
import screeningService from '../services/screening.service';
import jobService from '../services/jobs.service';

const RecentActivity = () => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resultsRes, jobsRes] = await Promise.all([
                screeningService.getAllResultsCombined(), // Aggregate all sources
                jobService.getAllJobs()
            ]);

            setActivities(resultsRes.data || []);
            setJobs(jobsRes.data || []);
        } catch (error) {
            console.error("Failed to fetch activity data:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredActivities = activities.filter(activity => {
        const matchesJob = selectedJobId === 'all' || String(activity.job?.id) === selectedJobId;
        const name = activity.resume?.candidateName || activity.resume?.filename || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesJob && matchesSearch;
    });

    const getStatusColor = (score) => {
        if (score >= 75) return 'bg-emerald-500';
        if (score >= 50) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-foreground-muted hover:text-indigo-500 transition-colors mb-2 text-sm font-bold"
                    >
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
                        <Activity className="text-indigo-500" />
                        Global Activity Log
                    </h1>
                    <p className="text-foreground-muted mt-1">Detailed history of all AI screening evaluations across the organization.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search candidates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-64"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                        <select
                            value={selectedJobId}
                            onChange={(e) => setSelectedJobId(e.target.value)}
                            className="bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none min-w-[200px]"
                        >
                            <option value="all">All Job Roles</option>
                            {jobs.map(job => (
                                <option key={job.id} value={job.id}>{job.title}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="glass-card shadow-2xl overflow-hidden border-indigo-500/10">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <Activity className="animate-spin text-indigo-500" size={40} />
                        <span className="text-foreground-muted font-black uppercase tracking-widest text-xs">Accessing Neural Logs...</span>
                    </div>
                ) : filteredActivities.length > 0 ? (
                    <div className="divide-y divide-border">
                        {filteredActivities.map((activity, idx) => (
                            <div key={activity.id} className="p-6 hover:bg-white/[0.02] transition-all group flex items-start gap-6">
                                <div className={`mt-2 w-3 h-3 rounded-full ${getStatusColor(activity.totalScore)} ring-4 ring-black/10 shadow-[0_0_15px_rgba(99,102,241,0.3)]`}></div>

                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                                                {activity.resume?.candidateName || activity.resume?.filename}
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest ${activity.totalScore >= 75 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : activity.totalScore >= 50 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                                    {activity.totalScore >= 75 ? 'High Potential' : activity.totalScore >= 50 ? 'Medium Match' : 'Low Match'}
                                                </span>
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-4 mt-2">
                                                <div className="flex items-center gap-2 text-sm text-foreground-muted font-bold">
                                                    <Briefcase size={14} className="text-indigo-500" />
                                                    {activity.job?.title || 'Unknown Role'}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-foreground-muted font-medium">
                                                    <Clock size={14} />
                                                    {new Date(activity.resume?.uploadedAt || Date.now()).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-foreground-muted font-medium">
                                                    <ShieldCheck size={14} className="text-emerald-500" />
                                                    AI Verified
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right flex flex-col items-end gap-1">
                                            <div className="text-3xl font-black text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.3)]">{Math.round(activity.totalScore)}%</div>
                                            <div className="text-[10px] text-foreground-muted font-black uppercase tracking-[0.2em]">Match Confidence</div>
                                        </div>
                                    </div>

                                    <div className="bg-black/20 rounded-2xl p-4 border border-border group-hover:border-indigo-500/20 transition-all">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                                <Zap size={14} />
                                            </div>
                                            <p className="text-xs font-bold text-foreground-muted uppercase tracking-widest">Neural Analysis Snippet</p>
                                        </div>
                                        <p className="text-sm text-foreground-muted leading-relaxed italic">
                                            "{activity.explanation || 'No detailed analysis generated for this candidate.'}"
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex flex-wrap gap-2">
                                            {(activity.matchedSkills || '').split(',').slice(0, 5).map(skill => (
                                                skill.trim() && <span key={skill} className="px-2 py-1 bg-white/[0.03] border border-border rounded text-[10px] font-bold text-foreground-muted uppercase tracking-wider group-hover:text-indigo-400 transition-colors">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => navigate(`/admin/rankings/${activity.job?.id}`)}
                                            className="px-4 py-2 bg-indigo-600/10 text-indigo-400 text-xs font-bold rounded-lg hover:bg-indigo-600 hover:text-white transition-all border border-indigo-500/20 flex items-center gap-2"
                                        >
                                            View in Rankings <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-20 text-center space-y-4">
                        <Users size={60} className="mx-auto text-foreground-muted/20" />
                        <h3 className="text-2xl font-bold text-foreground">No Activity Found</h3>
                        <p className="text-foreground-muted max-w-xs mx-auto">Try adjusting your filters or run new evaluations to see activity logs.</p>
                        <button
                            onClick={() => navigate('/admin')}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-600/30 hover:bg-indigo-500"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
