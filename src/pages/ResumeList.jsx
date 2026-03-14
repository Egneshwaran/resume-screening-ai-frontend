import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Upload, FileText, CheckCircle, Clock, Loader2, Briefcase, Zap, Download, Trash2 } from 'lucide-react';
import screeningService from '../services/screening.service';
import jobService from '../services/jobs.service';
import resumeService from '../services/resumes.service';
import exportService from '../services/export.service';

const ResumeList = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const fileInputRef = useRef(null);
    const [resumes, setResumes] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [screeningLoading, setScreeningLoading] = useState(false);
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [resultsRes, jobsRes] = await Promise.all([
                screeningService.getAllResults(true), // Request only Resume Bank results
                jobService.getAllJobs()
            ]);
            setResumes(resultsRes.data || []);
            setJobs(jobsRes.data || []);
            
            // Only auto-select first job if none is selected yet
            if (!selectedJobId && jobsRes.data?.length > 0) {
                setSelectedJobId(jobsRes.data[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        if (!selectedJobId) {
            alert("Please select a job role first to associate these resumes.");
            return;
        }

        setUploading(true);
        setUploadProgress(20);

        try {
            await resumeService.uploadBulkResumes(files, selectedJobId, token, true);
            setUploadProgress(100);
            alert(`Successfully uploaded ${files.length} resumes to Resume Bank!`);
            fetchInitialData();
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
            setUploadProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRunScreening = async () => {
        if (!selectedJobId) {
            alert("Please select a job role.");
            return;
        }

        setScreeningLoading(true);
        try {
            await screeningService.runScreening(selectedJobId, true); // Screen only Resume Bank resumes
            fetchInitialData();
            alert("Screening for Resume Bank completed successfully!");
        } catch (error) {
            console.error("Screening failed:", error);
            alert("Screening failed. Ensure AI Engine is running.");
        } finally {
            setScreeningLoading(false);
        }
    };

    const handleExport = async (type) => {
        try {
            if (type === 'excel') {
                await exportService.exportExcel(selectedJobId || null);
            } else {
                await exportService.exportPdf(selectedJobId || null);
            }
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setShowExportOptions(false);
        }
    };

    const handleDeleteResume = async (resumeId) => {
        if (!window.confirm("Are you sure you want to delete this resume? This will also remove its screening result.")) return;

        try {
            await resumeService.deleteResume(resumeId);
            fetchInitialData();
            alert("Resume deleted successfully!");
        } catch (error) {
            console.error("Deletion failed:", error);
            alert("Failed to delete resume.");
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm("CRITICAL: Are you sure you want to CLEAR ALL uploaded resumes and all screening results? This action cannot be undone.")) return;

        try {
            setLoading(true);
            await resumeService.deleteAllResumes();
            await fetchInitialData();
            alert("All resumes and results cleared successfully.");
        } catch (error) {
            console.error("Clear all failed:", error);
            alert("Failed to clear resumes.");
        } finally {
            setLoading(false);
        }
    };

    const filteredResumes = resumes.filter(result =>
        !selectedJobId || String(result.job?.id) === String(selectedJobId)
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Resume Bank</h1>
                    <p className="text-foreground-muted mt-1">Manage all screened candidates and bulk upload talent data.</p>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex flex-col gap-1 flex-1 lg:flex-none lg:w-64">
                        <select
                            value={selectedJobId}
                            onChange={(e) => setSelectedJobId(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl px-4 py-2 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        >
                            <option value="">All Roles (Global View)</option>
                            {jobs.map(job => (
                                <option key={job.id} value={job.id}>{job.title}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleRunScreening}
                        disabled={screeningLoading || !selectedJobId}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                        {screeningLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                        {screeningLoading ? 'Processing...' : 'Review & Run'}
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowExportOptions(!showExportOptions)}
                            className="px-6 py-2 bg-black/5 dark:bg-white/5 border border-border rounded-xl hover:bg-black/10 dark:hover:bg-white/10 text-foreground transition-all text-sm font-bold flex items-center gap-2"
                        >
                            <Download size={18} /> Export
                        </button>
                        {showExportOptions && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <button onClick={() => handleExport('excel')} className="w-full px-4 py-3 text-left text-xs font-bold text-foreground-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-colors flex items-center gap-2">
                                    <FileText size={16} className="text-emerald-500" /> Excel (.xlsx)
                                </button>
                                <button onClick={() => handleExport('pdf')} className="w-full px-4 py-3 text-left text-xs font-bold text-foreground-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-colors flex items-center gap-2 border-t border-border">
                                    <FileText size={16} className="text-rose-500" /> PDF (.pdf)
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleClearAll}
                        disabled={loading || resumes.length === 0}
                        className="px-6 py-2 bg-rose-600/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                        <Trash2 size={18} /> Clear Bank
                    </button>
                </div>
            </div>

            {/* Bulk Upload Section */}
            <div
                onClick={() => fileInputRef.current?.click()}
                className={`glass-card p-12 border-dashed border-2 transition-all cursor-pointer group flex flex-col items-center justify-center space-y-4 ${uploading ? 'border-primary/50 cursor-wait' : 'border-border hover:border-primary/50'}`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    className="hidden"
                    accept=".pdf,.docx,.txt"
                />

                <div className={`p-5 rounded-3xl transition-all duration-500 ${uploading ? 'bg-indigo-600 animate-pulse' : 'bg-indigo-500/10 group-hover:bg-indigo-600 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]'}`}>
                    {uploading ? <Loader2 size={40} className="text-white animate-spin" /> : <Upload className={`transition-all ${uploading ? 'text-white' : 'text-indigo-400 group-hover:text-white'}`} size={40} />}
                </div>

                <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold text-foreground tracking-tight">
                        {uploading ? `Uploading ${uploadProgress}%` : 'Activate Bulk Resume Upload'}
                    </h3>
                    <p className="text-foreground-muted text-sm">Target up to 1000 resumes for high-volume automated screening.</p>
                </div>

                {uploading && (
                    <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden mt-4">
                        <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                )}
            </div>

            {/* Candidates Table */}
            <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h3 className="font-bold text-foreground uppercase tracking-widest text-xs">Screened Talent Pool</h3>
                    <div className="bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-500 dark:text-indigo-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                        {filteredResumes.length} {selectedJobId ? 'Role Specific' : 'Global'} Profiles
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/5 dark:bg-white/[0.02] text-foreground-muted text-[10px] font-black uppercase tracking-widest border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Candidate & Contact</th>
                                <th className="px-6 py-4">Top Skills</th>
                                <th className="px-6 py-4 border-x border-border">Target Position</th>
                                <th className="px-6 py-4">AI Score</th>
                                <th className="px-6 py-4">Current Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredResumes.length > 0 ? (
                                filteredResumes.map((result, idx) => (
                                    <tr key={idx} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-foreground group-hover:text-primary transition-colors">{result.resume?.candidate_name || result.resume?.filename}</div>
                                            <div className="text-[10px] text-foreground-muted font-medium">{result.resume?.candidate_email || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {(result.matched_skills || '').split(',').slice(0, 3).map(s => (
                                                    s.trim() && <span key={s} className="bg-black/5 dark:bg-white/5 border border-border px-2 py-0.5 rounded text-[10px] text-foreground-muted group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors uppercase font-bold">{s.trim()}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 bg-black/[0.01] dark:bg-white/[0.01] border-x border-border">
                                            <div className="flex items-center gap-2">
                                                <Briefcase size={14} className="text-indigo-500/50 dark:text-indigo-400/50" />
                                                <span className="text-sm text-foreground-muted font-bold group-hover:text-foreground">{result.job?.title || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-indigo-400 font-black text-lg">{result.total_score}%</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${result.status === 'SHORTLISTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                                {result.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleDeleteResume(result.resume?.id)}
                                                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                                                title="Delete Resume"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center">
                                        {loading ? (
                                            <div className="flex flex-col items-center gap-4 animate-pulse">
                                                <Loader2 size={32} className="animate-spin text-indigo-500" />
                                                <span className="text-sm font-bold text-foreground-muted uppercase tracking-widest">Aggregating Global Talent Data...</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-4 text-foreground-muted">
                                                <Briefcase size={40} />
                                                <p className="text-lg font-bold text-foreground tracking-tight">Resume Bank is empty</p>
                                                <p className="max-w-xs text-sm">Please select a job role and upload resumes to begin the AI screening process.</p>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ResumeList;
