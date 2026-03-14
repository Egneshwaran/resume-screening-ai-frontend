import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
} from 'chart.js';
import {
    Users,
    CheckCircle,
    XCircle,
    Clock,
    Zap,
    Download,
    TrendingUp,
    FileText,
    Target,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    ChevronRight,
    ExternalLink,
    MoreHorizontal,
    Loader2,
    Activity,
    Briefcase,
    ShieldCheck,
    BarChart3,
    LayoutDashboard,
    Gauge,
    History,
    ChevronDown,
    AlertCircle,
    CheckCircle2,
    Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import exportService from '../services/export.service';
import jobService from '../services/jobs.service';
import screeningService from '../services/screening.service';
import resumeService from '../services/resumes.service';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
);

const StatCard = ({ icon: Icon, label, value, trend, trendUp, color, description }) => {
    return (
        <div className="glass-card p-6 flex flex-col justify-between hover-scale group min-h-[160px]">
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 transition-colors group-hover:bg-opacity-20`}>
                    {Icon && <Icon size={24} className={color} />}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {trend}
                    </div>
                )}
            </div>
            <div className="mt-4">
                <div className="text-foreground-muted text-sm font-medium">{label}</div>
                <div className="text-3xl font-bold mt-1 tracking-tight text-foreground">{value}</div>
                <p className="text-[10px] text-foreground-muted mt-2 uppercase tracking-wider font-semibold">{description}</p>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { profile } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [exportLoading, setExportLoading] = useState(false);
    const [screeningLoading, setScreeningLoading] = useState(false);
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [screeningResults, setScreeningResults] = useState([]);
    const [activeTab, setActiveTab] = useState(location.pathname.includes('analytics') ? 'analytics' : 'overview');

    // Sync tab state with URL changes (e.g. from Sidebar)
    useEffect(() => {
        if (location.pathname.includes('analytics')) {
            setActiveTab('analytics');
        } else {
            setActiveTab('overview');
        }

        // Fetch jobs on mount
        fetchJobs();
    }, [location.pathname]);

    const fetchJobs = async () => {
        try {
            const response = await jobService.getAllJobs();
            setJobs(response.data);
            if (response.data.length > 0) {
                setSelectedJobId(response.data[0].id);
                fetchResults(response.data[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        }
    };

    const fetchResults = async (jobId) => {
        try {
            // Fetch combined results from both Resume Bank and AI Screening
            const response = await screeningService.getResultsCombined(jobId);
            setScreeningResults(response.data);
        } catch (error) {
            console.error("Failed to fetch results:", error);
        }
    };

    const handleJobChange = (jobId) => {
        setSelectedJobId(jobId);
        fetchResults(jobId);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'analytics') {
            navigate('/admin/analytics');
        } else {
            navigate('/admin');
        }
    };

    const handleRunScreening = async () => {
        if (!selectedJobId) {
            alert("Please select a job role first.");
            return;
        }

        setScreeningLoading(true);
        try {
            await screeningService.runScreening(selectedJobId);
            // Re-fetch combined results to include the new screening data
            await fetchResults(selectedJobId);
            alert("Screening completed successfully!");
        } catch (error) {
            console.error("Screening failed:", error);
            alert("Failed to run AI screening. Ensure AI Engine is running.");
        } finally {
            setScreeningLoading(false);
        }
    };

    const handleExport = async (type) => {
        setExportLoading(true);
        setShowExportOptions(false);
        try {
            if (type === 'excel') {
                await exportService.exportExcel(selectedJobId || null);
            } else {
                await exportService.exportPdf(selectedJobId || null);
            }
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export results.");
        } finally {
            setExportLoading(false);
        }
    };

    const handleDeleteCandidate = async (resultId, resumeId) => {
        if (!window.confirm("Are you sure you want to delete this candidate?")) return;

        try {
            if (resumeId) {
                await resumeService.deleteResume(resumeId);
            }
            setScreeningResults(prev => prev.filter(r => r.id !== resultId));
        } catch (error) {
            console.error("Failed to delete candidate:", error);
            alert("Failed to delete candidate.");
        }
    };

    // Dynamic Stats Calculation
    const totalApplicants = screeningResults.length;
    const shortlistedCount = screeningResults.filter(r => (r.total_score || 0) >= 75).length;
    const rejectedCount = screeningResults.filter(r => (r.total_score || 0) < 50).length;
    const pendingCount = screeningResults.filter(r => (r.total_score || 0) >= 50 && (r.total_score || 0) < 75).length;

    const stats = [
        { icon: Users, label: "Total Screened", value: totalApplicants, trend: "", trendUp: true, color: "text-indigo-400", description: "Uploaded resumes analyzed" },
        { icon: CheckCircle, label: "High Potential", value: shortlistedCount, trend: "", trendUp: true, color: "text-emerald-400", description: "Score above 75%" },
        { icon: XCircle, label: "Low Matching", value: rejectedCount, trend: "", trendUp: false, color: "text-rose-400", description: "Score below 50%" },
        { icon: Clock, label: "Medium Match", value: pendingCount, trend: "", trendUp: true, color: "text-amber-400", description: "Requires manual check" },
    ];

    const doughnutData = {
        labels: ['High Match', 'Medium Match', 'Low Match'],
        datasets: [{
            data: [shortlistedCount, pendingCount, rejectedCount],
            backgroundColor: ['#10b981', '#6366f1', '#f43f5e'],
            borderWidth: 0,
            hoverOffset: 10,
        }]
    };

    const recentActivity = screeningResults.slice(0, 4).map(r => ({
        id: r.id,
        type: (r.total_score || 0) >= 75 ? 'screen' : 'reject',
        user: 'AI System',
        action: `evaluated ${r.resume?.candidate_name || r.resume?.filename}`,
        role: (r.total_score || 0) >= 75 ? 'Qualified' : 'Low Match',
        time: 'Just now'
    }));

    const statusHighlights = [
        { label: "Active Job Roles", value: jobs.length, icon: Briefcase, color: "text-blue-400" },
        { label: "AI Screening Status", value: screeningLoading ? "Running..." : "System Idle", icon: ShieldCheck, color: "text-emerald-400" },
        { label: "System Confidence", value: "98.4%", icon: Target, color: "text-purple-400" },
    ];

    const performanceMetrics = [
        { label: "High Confidence", value: `${totalApplicants > 0 ? Math.round((shortlistedCount / totalApplicants) * 100) : 0}%`, subValue: "Candidates above 75%", icon: ShieldCheck, color: "text-emerald-400" },
        { label: "Avg Match Score", value: `${totalApplicants > 0 ? Math.round(screeningResults.reduce((acc, curr) => acc + (curr.total_score || 0), 0) / totalApplicants) : 0}%`, subValue: "Across current selection", icon: Gauge, color: "text-indigo-400" },
        { label: "Candidates", value: totalApplicants, subValue: "Processed in current run", icon: Clock, color: "text-amber-400" },
    ];

    const barData = {
        labels: screeningResults.slice(0, 6).map(r => r.resume?.candidate_name?.split(' ')[0] || r.resume?.filename?.substring(0, 8) || 'N/A'),
        datasets: [{
            label: 'Match Score',
            data: screeningResults.slice(0, 6).map(r => r.total_score || 0),
            backgroundColor: 'rgba(99, 102, 241, 0.4)',
            borderColor: '#6366f1',
            borderWidth: 2,
            borderRadius: 6,
        }]
    };

    // Extract top 6 matched skills from results
    const allMatchedSkills = screeningResults.flatMap(r => r.matched_skills ? r.matched_skills.split(',').map(s => s.trim()).filter(Boolean) : []);
    const skillCounts = allMatchedSkills.reduce((acc, skill) => {
        acc[skill] = (acc[skill] || 0) + 1;
        return acc;
    }, {});
    const topSkills = Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

    const skillData = {
        labels: topSkills.map(s => s[0]),
        datasets: [{
            label: 'Matches Found',
            data: topSkills.map(s => s[1]),
            backgroundColor: 'rgba(168, 85, 247, 0.4)',
            borderColor: '#a855f7',
            borderWidth: 2,
            borderRadius: 6,
        }]
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                displayColors: false,
                borderWidth: 1,
                borderColor: 'var(--border)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff'
            }
        }
    };

    const barOptions = {
        ...commonOptions,
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(148, 163, 184, 0.1)' },
                ticks: { color: '#94a3b8', font: { size: 10 } }
            },
            x: {
                grid: { display: false },
                ticks: {
                    color: '#94a3b8',
                    font: { size: 10 },
                    maxRotation: 0,
                    minRotation: 0
                }
            }
        }
    };

    const doughnutOptions = {
        ...commonOptions,
        cutout: '75%',
        plugins: {
            ...commonOptions.plugins,
            legend: {
                display: true,
                position: 'bottom',
                labels: { color: '#94a3b8', boxWidth: 8, padding: 15, font: { size: 10 } }
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                        {activeTab === 'overview' ? 'Recruitment Overview' : 'Talent Analytics & Insights'}
                    </h1>
                    <p className="text-foreground-muted mt-1 flex items-center gap-2">
                        Welcome back, <span className="text-indigo-500 dark:text-indigo-400 font-semibold">{profile?.full_name || 'HR Manager'}</span>
                    </p>
                </div>

                {activeTab === 'analytics' && (
                    <div className="flex items-center gap-4">
                        {/* Job Selector Dropdown */}
                        <div className="relative group">
                            <div className="flex items-center gap-2 px-4 py-2 bg-glass-card border border-border rounded-xl text-sm font-semibold text-foreground hover:border-indigo-500/50 transition-all cursor-pointer">
                                <Briefcase size={16} className="text-indigo-500" />
                                <select 
                                    value={selectedJobId} 
                                    onChange={(e) => handleJobChange(e.target.value)}
                                    className="bg-transparent border-none focus:ring-0 outline-none cursor-pointer pr-8 appearance-none"
                                >
                                    <option value="" disabled className="bg-background text-foreground">Select Job Role</option>
                                    {jobs.map(job => (
                                        <option key={job.id} value={job.id} className="bg-background text-foreground">
                                            {job.title}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 pointer-events-none text-foreground-muted" />
                            </div>
                        </div>

                        <button 
                            onClick={handleRunScreening}
                            disabled={screeningLoading || !selectedJobId}
                            className="premium-button px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                        >
                            {screeningLoading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                            Run AI
                        </button>
                    </div>
                )}
            </div>

            {/* Dashboard Tabs */}
            <div className="flex items-center gap-1 bg-border p-1 rounded-2xl w-fit border border-border">
                <button
                    onClick={() => handleTabChange('overview')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-foreground-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                    <LayoutDashboard size={18} />
                    Overview
                </button>
                <button
                    onClick={() => handleTabChange('analytics')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-lg' : 'text-foreground-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                    <BarChart3 size={18} />
                    Analytics & Insights
                </button>
            </div>

            {
                activeTab === 'overview' ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Stats Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, idx) => (
                                <StatCard key={idx} {...stat} />
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Recent Activity Panel */}
                            <div className="lg:col-span-2 glass-card overflow-hidden">
                                <div className="p-6 border-b border-border flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                                            <Activity size={20} />
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
                                    </div>
                                    <button
                                        onClick={() => navigate('/admin/activity')}
                                        className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1"
                                    >
                                        View All <ChevronRight size={14} />
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    {recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-4 group">
                                            <div className={`mt-1 w-2 h-2 rounded-full ${activity.type === 'upload' ? 'bg-indigo-500' : activity.type === 'screen' ? 'bg-emerald-500' : activity.type === 'hire' ? 'bg-purple-500' : 'bg-rose-500'} ring-4 ring-black/5 dark:ring-white/5 shadow-[0_0_12px_rgba(99,102,241,0.3)]`}></div>
                                            <div className="flex-1 border-b border-border pb-6 last:border-0 last:pb-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-foreground font-semibold group-hover:text-primary transition-colors">
                                                        <span className="text-indigo-500 dark:text-indigo-400">{activity.user}</span> {activity.action}
                                                    </p>
                                                    <span className="text-[10px] font-bold text-foreground-muted uppercase">{activity.time}</span>
                                                </div>
                                                <p className="text-sm text-foreground-muted flex items-center gap-2">
                                                    <Briefcase size={14} /> {activity.role}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Status Highlights */}
                            <div className="space-y-6">
                                <div className="glass-card p-6">
                                    <h3 className="text-sm font-bold text-foreground-muted uppercase tracking-widest mb-6">System Status</h3>
                                    <div className="space-y-6">
                                        {statusHighlights.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2.5 rounded-xl bg-black/5 dark:bg-white/5 ${item.color}`}>
                                                        <item.icon size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-foreground-muted uppercase">{item.label}</p>
                                                        <p className="text-lg font-bold text-foreground">{item.value}</p>
                                                    </div>
                                                </div>
                                                {item.label === "AI Screening Status" && (
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="glass-card p-6 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 dark:from-indigo-600/20 dark:to-purple-600/20 border-indigo-500/20">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/40">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground text-lg">Smart Screening Active</h4>
                                            <p className="text-sm text-foreground-muted mt-1 leading-relaxed">System has analyzed {totalApplicants} resumes with advanced bias elimination NLP filters.</p>
                                            <button
                                                onClick={() => handleTabChange('analytics')}
                                                className="mt-4 px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 dark:bg-indigo-600/20 dark:hover:bg-indigo-600/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg transition-all border border-indigo-500/30"
                                            >
                                                View Progress
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Performance Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {performanceMetrics.map((metric, idx) => (
                                <div key={idx} className="glass-card p-6 flex items-center gap-6">
                                    <div className={`p-4 rounded-2xl bg-black/5 dark:bg-white/5 ${metric.color}`}>
                                        <metric.icon size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">{metric.label}</p>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <h4 className="text-2xl font-bold text-foreground">{metric.value}</h4>
                                            <span className={`text-[10px] font-bold ${metric.color.includes('rose') ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                {metric.subValue}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            <div className="xl:col-span-2 glass-card p-8 min-h-[400px] flex flex-col">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground uppercase tracking-wider text-xs">Role Match Quality</h3>
                                        <p className="text-foreground-muted text-sm">Average AI score across different departments</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1.5 bg-black/5 dark:bg-white/5 rounded-lg text-[10px] font-bold text-foreground-muted hover:text-foreground transition-colors">7D</button>
                                        <button className="px-3 py-1.5 bg-indigo-600 rounded-lg text-[10px] font-bold text-white">30D</button>
                                    </div>
                                </div>
                                <div className="flex-1 min-h-0 relative">
                                    {screeningResults.length > 0 ? (
                                        <Bar data={barData} options={barOptions} />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground-muted gap-2">
                                            <BarChart3 size={40} className="opacity-20" />
                                            <p className="text-xs font-bold uppercase tracking-widest">Awaiting Screening Data</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="glass-card p-8 flex flex-col items-center">
                                <div className="w-full text-left mb-8">
                                    <h3 className="text-lg font-bold text-foreground uppercase tracking-wider text-xs">Talent Pool Assessment</h3>
                                    <p className="text-foreground-muted text-sm">Overall distribution of candidate suitability</p>
                                </div>
                                <div className="flex-1 w-full relative min-h-[220px]">
                                    {screeningResults.length > 0 ? (
                                        <>
                                            <Doughnut data={doughnutData} options={doughnutOptions} />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-12">
                                                <span className="text-3xl font-bold text-foreground">{totalApplicants}</span>
                                                <span className="text-[10px] text-foreground-muted uppercase font-bold">Resumes</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground-muted gap-2">
                                            <Users size={40} className="opacity-20" />
                                            <p className="text-xs font-bold uppercase tracking-widest">No Distribution</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {/* Skill Demand Analysis */}
                            <div className="glass-card p-8 flex flex-col">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground uppercase tracking-wider text-xs">Skill Demand & Gaps</h3>
                                        <p className="text-foreground-muted text-sm">Top matched skills vs emerging missing trends</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                                        <TrendingUp size={20} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 min-h-[300px] relative">
                                        {screeningResults.length > 0 ? (
                                            <Bar data={skillData} options={barOptions} />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground-muted gap-2">
                                                <TrendingUp size={40} className="opacity-20" />
                                                <p className="text-xs font-bold uppercase tracking-widest">Awaiting Skill Analysis</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest">Trending Missing Skills</h4>
                                        <div className="space-y-4">
                                            {Object.entries(
                                                screeningResults.flatMap(r => r.missing_skills ? r.missing_skills.split(',').map(s => s.trim()).filter(Boolean) : [])
                                                    .reduce((acc, skill) => {
                                                        acc[skill] = (acc[skill] || 0) + 1;
                                                        return acc;
                                                    }, {})
                                            )
                                                .sort((a, b) => b[1] - a[1])
                                                .slice(0, 4)
                                                .map(([skill, count], idx) => (
                                                    <div key={idx} className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border flex items-center justify-between hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                                                        <div>
                                                            <p className="text-sm font-bold text-foreground">{skill}</p>
                                                            <p className="text-[10px] text-foreground-muted font-medium">Found in {count} resumes</p>
                                                        </div>
                                                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${count > 2 ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400' : 'bg-amber-500/10 text-amber-500 dark:text-amber-400'}`}>
                                                            {count > 2 ? 'Critical' : 'Moderate'}
                                                        </span>
                                                    </div>
                                                ))}
                                            {totalApplicants === 0 && <p className="text-xs text-foreground-muted italic p-4 text-center">No missing skills detected yet.</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Top Candidates Ranking */}
                            <div className="glass-card overflow-hidden">
                                <div className="p-6 border-b border-border flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Top Candidate Rankings</h3>
                                        <p className="text-xs text-foreground-muted font-medium">Auto-ranked based on skill matching AI</p>
                                    </div>
                                    <button className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-foreground-muted transition-all">
                                        <Filter size={18} />
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-border">
                                                <th className="px-6 py-4 text-left text-[10px] font-black text-foreground-muted uppercase tracking-widest">Rank & Candidate</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-black text-foreground-muted uppercase tracking-widest">AI Match Score</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-black text-foreground-muted uppercase tracking-widest">Matched / Missing Skills</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-black text-foreground-muted uppercase tracking-widest">AI Insights</th>
                                                <th className="px-6 py-4 text-right text-[10px] font-black text-foreground-muted uppercase tracking-widest">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {screeningResults.length > 0 ? screeningResults.map((result, i) => (
                                                <tr key={i} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-black text-foreground-muted">#{i + 1}</span>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-indigo-600/10 dark:bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all text-center">
                                                                    {result.resume?.candidate_name ? result.resume.candidate_name.substring(0, 2).toUpperCase() : 'C'}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">{result.resume?.candidate_name || result.resume?.filename}</div>
                                                                    <div className="text-[10px] text-foreground-muted uppercase tracking-wider font-semibold">{result.resume?.candidate_email || 'Candidate'}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1.5 w-32">
                                                            <div className="flex justify-between text-[10px] font-bold">
                                                                <span className="text-foreground-muted uppercase tracking-tighter">AI Match</span>
                                                                <span className="text-indigo-500 dark:text-indigo-400">{result.total_score}%</span>
                                                            </div>
                                                            <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                                                <div className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" style={{ width: `${result.total_score}%` }}></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-2">
                                                            <div className="flex flex-wrap gap-1">
                                                                {result.matched_skills && result.matched_skills.split(',').slice(0, 3).map((skill, idx) => (
                                                                    <span key={idx} className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[7px] font-bold rounded uppercase border border-emerald-500/20">
                                                                        {skill.trim()}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            {result.missing_skills && (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {result.missing_skills.split(',').slice(0, 2).map((skill, idx) => (
                                                                        <span key={idx} className="px-1.5 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[7px] font-bold rounded uppercase border border-rose-500/20 opacity-60">
                                                                            {skill.trim()}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-[10px] text-foreground-muted italic max-w-[150px] line-clamp-2">
                                                            {result.explanation}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => navigate(`/admin/rankings/${selectedJobId || (jobs.length > 0 ? jobs[0].id : '')}`)}
                                                                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-foreground-muted hover:text-primary transition-all"
                                                                title="View Details"
                                                            >
                                                                <ExternalLink size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteCandidate(result.id, result.resume?.id)}
                                                                className="p-2 rounded-lg hover:bg-rose-500/10 text-foreground-muted hover:text-rose-500 transition-all"
                                                                title="Delete Candidate"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12 text-center text-foreground-muted font-medium">
                                                        No screening results found. Click "Run AI" to initialize analysis.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Reports & Insights Footer */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 glass-card p-6 border-indigo-500/10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">Detailed Analytics Report</h4>
                                    <p className="text-sm text-foreground-muted">Download complete historical screening data and AI performance trends.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <button
                                    onClick={() => handleExport('excel')}
                                    className="flex-1 md:flex-none px-6 py-2.5 bg-black/5 dark:bg-white/5 border border-border rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-all text-xs font-bold flex items-center justify-center gap-2 text-foreground"
                                >
                                    <Download size={16} /> Download CSV
                                </button>
                                <button
                                    onClick={() => handleExport('pdf')}
                                    className="flex-1 md:flex-none px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                                >
                                    <FileText size={16} /> Generate PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default Dashboard;
