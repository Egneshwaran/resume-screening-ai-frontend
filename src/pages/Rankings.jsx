import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Info, AlertCircle, CheckCircle2, XCircle, Download, Loader2, User, Activity, Target, Zap, Award, Layers, TrendingUp, BarChart3, ChevronRight } from 'lucide-react';
import screeningService from '../services/screening.service';
import jobService from '../services/jobs.service';
import { useAuth } from '../context/useAuth';

const Rankings = () => {
    const { jobId } = useParams();
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [rankings, setRankings] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchData();
    }, [jobId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            console.log(`Rankings: Fetching data for Job ID: ${jobId}`);
            const [jobRes, screeningRes] = await Promise.all([
                jobService.getJobById(jobId),
                screeningService.getResults(jobId, false) // Only get AI Screening results
            ]);

            console.log("Rankings: Job response:", jobRes);
            console.log("Rankings: Screening results:", screeningRes);

            if (jobRes.data) {
                setJob(jobRes.data);
            }

            if (screeningRes.data) {
                console.log(`Rankings: Found ${screeningRes.data.length} records`);
                const sortedData = [...(screeningRes.data || [])].sort((a, b) => b.total_score - a.total_score);
                setRankings(sortedData);
                if (sortedData.length > 0) {
                    setSelectedCandidate(sortedData[0]);
                }
            } else {
                console.warn("Rankings: No screening data returned");
                setRankings([]);
                setSelectedCandidate(null);
            }
        } catch (error) {
            console.error("Error fetching rankings data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (!rankings || rankings.length === 0) return;

        const headers = ['Rank', 'Candidate Name', 'Candidate Email', 'Match Score', 'Matched Skills', 'Skill Gaps', 'AI Explanation'];

        const rows = rankings.map((r, index) => {
            const name = `"${(r.resume?.candidate_name || r.resume?.filename || 'Unknown').replace(/"/g, '""')}"`;
            const email = `"${(r.resume?.candidate_email || 'Not Provided').replace(/"/g, '""')}"`;
            const score = Math.round(r.total_score || 0) + '%';
            const matchedSkills = `"${(r.matched_skills || '').replace(/"/g, '""')}"`;
            const missingSkills = `"${(r.missing_skills || '').replace(/"/g, '""')}"`;
            const explanation = `"${(r.explanation || '').replace(/"/g, '""')}"`;

            return [index + 1, name, email, score, matchedSkills, missingSkills, explanation].join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `shortlist_job_${jobId}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleContactCandidate = () => {
        const candidateEmail = selectedCandidate?.resume?.candidate_email || '';
        const candidateName = selectedCandidate?.resume?.candidate_name || 'Candidate';
        const subject = encodeURIComponent("Regarding Your Application - AI Recruiter");
        const body = encodeURIComponent(`Hi ${candidateName},\n\nWe have reviewed your application for the ${job?.title || 'position'} role and would like to connect to discuss the next steps.\n\nBest regards,\n${user?.email || 'Recruiter'}`);

        window.open(`mailto:${candidateEmail}?subject=${subject}&body=${body}`, '_blank');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground-muted bg-clip-text text-transparent">Candidate Rankings</h1>
                    <p className="text-foreground-muted">Job ID: #{jobId} - <span className="text-indigo-500 dark:text-indigo-400 font-bold">{job?.title || 'Loading...'}</span></p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={rankings.length === 0}
                >
                    <Download size={20} />
                    <span>Export Shortlist</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center glass-card border-dashed border-border">
                            <Loader2 className="animate-spin text-indigo-500 mb-2" size={32} />
                            <p className="text-foreground-muted font-bold uppercase text-[10px] tracking-widest">Analyzing Talent Pool...</p>
                        </div>
                    ) : rankings.length > 0 ? (
                        rankings.map((result, idx) => (
                            <div
                                key={result.id}
                                onClick={() => setSelectedCandidate(result)}
                                className={`glass-card p-6 cursor-pointer border-2 transition-all hover:bg-black/[0.02] dark:hover:bg-white/[0.02] ${selectedCandidate?.id === result.id ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 'border-border'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-5">
                                        <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center font-black text-indigo-400 border border-indigo-500/20 text-xl">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                                {result.resume?.candidate_name || result.resume?.filename}
                                            </h3>
                                            <p className="text-xs font-bold text-foreground-muted mt-1 uppercase tracking-wider">
                                                {result.resume?.education || 'B.E Computer Science'} • {result.resume?.experience_years ? `${result.resume.experience_years} Years` : 'Relevant Experience'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-3xl font-black drop-shadow-[0_0_8px_rgba(129,140,248,0.3)] ${result.total_score >= 80 ? 'text-emerald-500' :
                                                result.total_score >= 60 ? 'text-indigo-500' : 'text-rose-500'
                                            }`}>
                                            {Math.round(result.total_score || 0)}%
                                        </div>
                                        <div className="text-[10px] text-foreground-muted font-black uppercase tracking-widest">Match Score</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center glass-card border-dashed border-border text-center p-8">
                            <User size={48} className="text-foreground-muted/30 mb-4" />
                            <h4 className="text-foreground font-bold">No Candidates Found</h4>
                            <p className="text-foreground-muted text-sm mt-1">Run the AI screening process for this role to see ranked candidates.</p>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {selectedCandidate ? (
                        <div className="glass-card p-0 sticky top-8 animate-in fade-in slide-in-from-right-4 duration-300 border-indigo-500/20 overflow-hidden">
                            {/* Header Section */}
                            <div className="p-6 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border-b border-border">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-black text-foreground">
                                            {selectedCandidate.resume?.candidate_name || 'Candidate Profile'}
                                        </h3>
                                        <p className="text-xs font-bold text-foreground-muted mt-1 uppercase tracking-wider">
                                            {selectedCandidate.resume?.candidate_email || 'Contact info masked'} • #{selectedCandidate.id}
                                        </p>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">
                                        AI RANKED
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Role Match Quality Section */}
                                <section>
                                    <h4 className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <Activity size={14} className="text-indigo-500" /> Role Match Quality
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { label: 'Key Skills Match', score: selectedCandidate.skill_match_score, color: 'text-indigo-500', bg: 'bg-indigo-500', icon: <Zap size={12} /> },
                                            { label: 'Experience Alignment', score: selectedCandidate.experience_score, color: 'text-purple-500', bg: 'bg-purple-500', icon: <Award size={12} /> },
                                            { label: 'Education Relevance', score: selectedCandidate.education_score, color: 'text-emerald-500', bg: 'bg-emerald-500', icon: <Layers size={12} /> },
                                        ].map((item) => (
                                            <div key={item.label} className="bg-foreground/[0.02] border border-border p-3 rounded-xl hover:border-indigo-500/20 transition-colors group relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-2 opacity-5">
                                                    {item.icon}
                                                </div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`${item.color}`}>{item.icon}</span>
                                                        <span className="text-[11px] font-bold text-foreground-muted uppercase tracking-tight">{item.label}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] font-black text-foreground-muted/40 uppercase">Importance: {item.label === 'Key Skills Match' ? (job?.skillWeight || 50) : item.label === 'Experience Alignment' ? (job?.experienceWeight || 30) : (job?.descriptionWeight || 20)}%</span>
                                                        <span className={`text-xs font-black ${item.color}`}>{Math.round(item.score || 0)}%</span>
                                                    </div>
                                                </div>
                                                <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${item.bg} rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.2)]`}
                                                        style={{ width: `${item.score || 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Skill Demand & Gaps Section */}
                                <section className="grid grid-cols-1 gap-8">
                                    {/* Job Demand Visualization */}
                                    <div>
                                        <h4 className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <BarChart3 size={14} className="text-blue-500" /> Core Skill Demand
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {job?.required_skills ? job.required_skills.split(',').map((s, i) => (
                                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/5 border border-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold shadow-sm">
                                                    <Target size={10} className="opacity-50" />
                                                    {s.trim()}
                                                </div>
                                            )) : <span className="text-foreground-muted text-xs italic">Configuration missing</span>}
                                        </div>
                                    </div>

                                    {/* Comparative Analysis */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                            <TrendingUp size={14} className="text-amber-500" /> Comparative Gap analysis
                                        </h4>
                                        <div className="grid grid-cols-1 gap-3">
                                            {/* Matching Skills */}
                                            <div className="p-4 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10 hover:bg-emerald-500/[0.05] transition-colors">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                            <CheckCircle2 size={10} className="text-emerald-500" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Matched Skills</span>
                                                    </div>
                                                    <span className="text-[9px] font-bold text-emerald-500/60 uppercase">Met by Candidate</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedCandidate.matched_skills ? selectedCandidate.matched_skills.split(',').map((s, i) => (
                                                        <span key={i} className="px-2.5 py-1 rounded-lg bg-white/50 dark:bg-black/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold shadow-sm">
                                                            {s.trim()}
                                                        </span>
                                                    )) : <span className="text-foreground-muted text-[10px] italic">No direct technical overlaps</span>}
                                                </div>
                                            </div>

                                            {/* Gaps */}
                                            <div className="p-4 rounded-2xl bg-rose-500/[0.03] border border-rose-500/10 hover:bg-rose-500/[0.05] transition-colors">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center">
                                                            <XCircle size={10} className="text-rose-500" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">Critical Gaps</span>
                                                    </div>
                                                    <span className="text-[9px] font-bold text-rose-500/60 uppercase">Missing / Weak Areas</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedCandidate.missing_skills ? selectedCandidate.missing_skills.split(',').map((s, i) => (
                                                        <span key={i} className="px-2.5 py-1 rounded-lg bg-white/50 dark:bg-black/20 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold shadow-sm">
                                                            {s.trim()}
                                                        </span>
                                                    )) : <span className="text-emerald-500 text-[10px] font-black uppercase flex items-center gap-1"><Award size={10} /> Perfect Skillset alignment</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Explainable AI Summary */}
                                <section className="p-6 rounded-3xl bg-indigo-600/5 border border-indigo-500/20 relative overflow-hidden group hover:bg-indigo-600/[0.08] transition-all duration-500 shadow-inner">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
                                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors" />

                                    <h4 className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <Zap size={14} className="animate-pulse" /> Explainable AI (XAI) Rationale
                                    </h4>
                                    <p className="text-foreground-dim text-[13px] leading-relaxed relative z-10 whitespace-pre-wrap font-semibold italic border-l-2 border-indigo-500/30 pl-4 py-1">
                                        "{selectedCandidate.explanation}"
                                    </p>
                                </section>

                                <button
                                    onClick={handleContactCandidate}
                                    className="w-full premium-button py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
                                >
                                    Proceed to Interview <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>

                    ) : (
                        <div className="glass-card p-10 text-center text-foreground-muted flex flex-col items-center justify-center h-64">
                            <AlertCircle size={48} className="mb-4 opacity-20" />
                            <p>Select a candidate to view AI ranking explanation and skill gap analysis.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Rankings;
