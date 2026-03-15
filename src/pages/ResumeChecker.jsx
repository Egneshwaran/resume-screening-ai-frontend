import React, { useState } from 'react';
import {
    Upload,
    FileText,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Layers,
    Target,
    Zap,
    ArrowLeft,
    Download,
    RefreshCw,
    Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/Footer';
import ResumeService from '../services/resumes.service';

const ResumeChecker = () => {
    const [file, setFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [jobRole, setJobRole] = useState('');

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            analyzeResume(selectedFile, jobRole);
        }
    };

    const analyzeResume = async (file, role) => {
        setIsAnalyzing(true);
        setError(null);
        try {
            const data = await ResumeService.checkATS(file, role);
            setResult(data);
        } catch (err) {
            console.error('Analysis failed:', err);
            const errorMsg = err.response?.data?.detail || 'Failed to analyze resume. Please try again later.';
            setError(errorMsg);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const reset = () => {
        setFile(null);
        setResult(null);
        setError(null);
        setJobRole('');
    };

    return (
        <div className="min-h-screen bg-background">
            <LandingNavbar />

            <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 lg:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/" className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-foreground-muted hover:text-foreground transition-all">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">AI Resume Checker</h1>
                        <p className="text-foreground-muted">Evaluate and optimize your resume with advanced AI</p>
                    </div>
                </div>

                {error && (
                    <div className="max-w-3xl mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
                        <AlertCircle size={20} />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {!result && !isAnalyzing ? (
                    <div className="max-w-3xl mx-auto mt-12">
                        <div className="mb-6 relative">
                            <label className="block text-sm font-medium text-foreground-muted mb-2">Target Job Role (Optional)</label>
                            <input
                                type="text"
                                value={jobRole}
                                onChange={(e) => setJobRole(e.target.value)}
                                placeholder="e.g. Senior Software Engineer"
                                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder-foreground-muted focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                            <p className="text-xs text-foreground-muted mt-2 flex items-center gap-1">
                                <Target size={12} /> Entering a role helps the AI give you role-specific tailored feedback.
                            </p>
                        </div>
                        <div className="p-1 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-border">
                            <label className="flex flex-col items-center justify-center w-full h-[400px] border-2 border-dashed border-border rounded-[2.3rem] bg-input hover:bg-black/5 dark:hover:bg-white/5 hover:border-indigo-500/50 transition-all cursor-pointer group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                                        <Upload size={32} />
                                    </div>
                                    <p className="mb-2 text-xl font-bold text-foreground tracking-tight">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-sm text-foreground-muted">
                                        PDF, DOCX (Max. 10MB)
                                    </p>
                                </div>
                                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.docx" />
                            </label>
                        </div>

                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="flex items-center gap-3 text-foreground-muted">
                                <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-indigo-500 dark:text-indigo-400"><Target size={18} /></div>
                                <span className="text-sm">ATS Optimized</span>
                            </div>
                            <div className="flex items-center gap-3 text-foreground-muted">
                                <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-indigo-500 dark:text-indigo-400"><Zap size={18} /></div>
                                <span className="text-sm">Instant Feedback</span>
                            </div>
                            <div className="flex items-center gap-3 text-foreground-muted">
                                <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-indigo-500 dark:text-indigo-400"><TrendingUp size={18} /></div>
                                <span className="text-sm">Scoring Analysis</span>
                            </div>
                        </div>
                    </div>
                ) : isAnalyzing ? (
                    <div className="max-w-3xl mx-auto mt-20 text-center">
                        <div className="relative inline-block mb-8">
                            <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Cpu size={32} className="text-indigo-400 animate-pulse" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Analyzing Your Resume...</h2>
                        <p className="text-foreground-muted">Our AI is parsing your content and comparing it against 10,000+ industry standards.</p>

                        <div className="mt-12 space-y-4 max-w-sm mx-auto">
                            <div className="h-2 bg-border rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 animate-progress"></div>
                            </div>
                            <div className="flex justify-between text-xs text-foreground-muted uppercase tracking-widest font-semibold">
                                <span>Extracting Text</span>
                                <span>Running NLP</span>
                                <span>Finalizing</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Summary Column */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="p-8 rounded-3xl bg-card border border-border text-center">
                                <div className="relative inline-block mb-6">
                                    <svg className="w-32 h-32 transform -rotate-90">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="58"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            className="text-black/5 dark:text-white/5"
                                        />
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="58"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray={364.4}
                                            strokeDashoffset={364.4 * (1 - (result.total_score || result.score || 0) / 100)}
                                            className="text-indigo-500"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-bold text-foreground">{Math.round(result.total_score || result.score || 0)}</span>
                                        <span className="text-[10px] text-foreground-muted uppercase font-bold tracking-widest">Score</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Overall Quality</h3>
                                <p className="text-foreground-muted text-sm mb-6">Your resume is looking great! With a few tweaks, you can reach the top 5% of candidates.</p>
                                <button onClick={reset} className="w-full py-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground border border-border rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
                                    <RefreshCw size={16} /> Re-upload Resume
                                </button>
                            </div>
                            <div className="p-8 rounded-3xl bg-card border border-border">
                                <h4 className="text-foreground font-bold mb-6 flex items-center gap-2">
                                    <Layers size={18} className="text-indigo-500 dark:text-indigo-400" /> Metric Breakdown
                                </h4>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-foreground-muted">ATS Compatibility</span>
                                            <span className="text-foreground font-semibold">{Math.round(result.ats_compatibility || result.atsCompatibility || 0)}%</span>
                                        </div>
                                        <p className="text-xs text-foreground-muted mb-2">Measures how easily recruitment software can read and parse your layout.</p>
                                        <div className="h-1.5 bg-border rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500" style={{ width: `${result.ats_compatibility || result.atsCompatibility || 0}%` }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-foreground-muted">Accuracy Percentage</span>
                                            <span className="text-foreground font-semibold">{Math.round(result.accuracy_percentage || result.keyword_relevance || result.keywordRelevance || 0)}%</span>
                                        </div>
                                        <p className="text-xs text-foreground-muted mb-2">Evaluates how accurately the resume matches crucial industry-specific requirements.</p>
                                        <div className="h-1.5 bg-border rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500" style={{ width: `${result.accuracy_percentage || result.keyword_relevance || result.keywordRelevance || 0}%` }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-foreground-muted">Formatting</span>
                                            <span className="text-foreground font-semibold">{Math.round(result.formatting || 0)}%</span>
                                        </div>
                                        <p className="text-xs text-foreground-muted mb-2">Checks for structural consistency, clear headers, and appropriate length.</p>
                                        <div className="h-1.5 bg-border rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500" style={{ width: `${result.formatting || 0}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="p-8 rounded-3xl bg-card border border-border">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-foreground font-bold mb-4 flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                                                <CheckCircle2 size={16} />
                                            </div>
                                            Key Strengths
                                        </h4>
                                        <ul className="space-y-3">
                                            {result.strengths.map((s, i) => (
                                                <li key={i} className="flex gap-3 text-sm text-foreground-muted">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-foreground font-bold mb-4 flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                                                <AlertCircle size={16} />
                                            </div>
                                            Areas for Improvement
                                        </h4>
                                        <ul className="space-y-3">
                                            {result.improvements.map((s, i) => (
                                                <li key={i} className="flex gap-3 text-sm text-foreground-muted">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 rounded-3xl bg-card border border-border">
                                <h4 className="text-foreground font-bold mb-6">Section-wise Analysis</h4>
                                <div className="space-y-4">
                                    {result.sections.map((section, i) => (
                                        <div key={i} className="p-4 rounded-2xl bg-background/50 border border-border">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-foreground">{section.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-foreground-muted">Accuracy:</span>
                                                    <div className={`w-2 h-2 rounded-full ${section.score >= 90 ? 'bg-emerald-500' : section.score >= 80 ? 'bg-indigo-500' : 'bg-amber-500'}`}></div>
                                                    <span className="text-sm font-bold text-foreground">{section.score}%</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-foreground-muted">{section.feedback}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ResumeChecker;
