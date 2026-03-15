import React, { useState, useEffect } from 'react';
import {
    FileText,
    Upload,
    ListChecks,
    Zap,
    CheckCircle2,
    Users,
    ArrowRight,
    Plus,
    X,
    MessageSquare,
    ClipboardList,
    Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import jobService from '../services/jobs.service';
import screeningService from '../services/screening.service';
import resumeService from '../services/resumes.service';

const ScreeningWorkflow = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        // No subscription check needed
    }, []);

    const [step, setStep] = useState(1);
    const [jobData, setJobData] = useState({
        title: '',
        description: '',
        skills: '',
        experience: '',
        skillWeight: 50,
        experienceWeight: 30,
        descriptionWeight: 20
    });
    const [resumes, setResumes] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleAddJob = (e) => {
        e.preventDefault();
        if (!jobData.skills.trim()) {
            alert("Please add key skills (comma-separated).");
            return;
        }

        const totalWeight = parseInt(jobData.skillWeight) + parseInt(jobData.experienceWeight) + parseInt(jobData.descriptionWeight);
        if (totalWeight !== 100) {
            alert(`Total weight must be exactly 100%. Current total: ${totalWeight}%`);
            return;
        }

        setStep(2);
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setResumes([...resumes, ...files]);
    };

    const removeResume = (index) => {
        setResumes(resumes.filter((_, i) => i !== index));
    };



    const startScreening = async () => {
        setIsProcessing(true);
        setUploadProgress(10); // Step 1: Create Job
        try {
            // 1. Create the job profile
            const jobResponse = await jobService.createJob({
                title: jobData.title,
                description: jobData.description,
                requiredSkills: jobData.skills,
                requiredExperience: jobData.experience,
                minExperience: parseInt(jobData.experience) || 0,
                skillWeight: jobData.skillWeight,
                experienceWeight: jobData.experienceWeight,
                descriptionWeight: jobData.descriptionWeight
            });
            const jobId = jobResponse.data.id;

            setUploadProgress(40); // Step 2: Uploading

            // 2. Upload resumes
            await resumeService.uploadBulkResumes(resumes, jobId, token, false); // Explicitly not Resume Bank

            setUploadProgress(70); // Step 3: Analyzing

            // 3. Trigger AI Screening
            await screeningService.runScreening(jobId, false); // Screen only for this workflow

            setUploadProgress(100); // Done

            // Short delay to show 100%
            setTimeout(() => {
                setIsProcessing(false);
                navigate(`/admin/rankings/${jobId}`);
            }, 800);
        } catch (error) {
            console.error("Screening workflow failed:", error);
            alert(`Error: AI Screening failed. ${error.message || 'Ensure AI Engine is running.'}`);
            setIsProcessing(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Progress Header */}
            <div className="flex items-center justify-between px-4">
                {[
                    { id: 1, label: 'Job Description', icon: ClipboardList },
                    { id: 2, label: 'Upload Resumes', icon: Upload },
                    { id: 3, label: 'Review & Run', icon: Zap },
                ].map((s) => (
                    <div key={s.id} className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${step >= s.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-black/5 dark:bg-white/5 text-foreground-muted'
                            }`}>
                            <s.icon size={20} />
                        </div>
                        <span className={`text-sm font-bold hidden md:block ${step >= s.id ? 'text-foreground' : 'text-foreground-muted'}`}>
                            {s.label}
                        </span>
                        {s.id < 3 && <div className="hidden lg:block w-20 h-[1px] bg-border mx-4"></div>}
                    </div>
                ))}
            </div>

            {/* Step 1: Job Description */}
            {step === 1 && (
                <div className="glass-card p-8 lg:p-12 space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Define Job Requirements</h2>
                        <p className="text-foreground-muted">Our AI needs context to screen candidates effectively.</p>
                    </div>

                    <form onSubmit={handleAddJob} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground-muted">Job Title</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Senior Frontend Developer"
                                className="w-full bg-input border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 transition-all text-foreground"
                                value={jobData.title}
                                onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-3 space-y-2">
                                <label className="text-sm font-semibold text-foreground-muted">Key Skills (Comma separated)</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. React, Tailwind, TypeScript"
                                    className="w-full bg-input border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 transition-all text-foreground"
                                    value={jobData.skills}
                                    onChange={(e) => setJobData({ ...jobData, skills: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-indigo-400">Weight (%)</label>
                                <div className="relative flex items-center gap-3">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="w-full bg-input border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 transition-all text-foreground text-center"
                                        value={jobData.skillWeight}
                                        onChange={(e) => setJobData({ ...jobData, skillWeight: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-3 space-y-2">
                                <label className="text-sm font-semibold text-foreground-muted">Required Experience</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter the minimum years of experience (example: 2–4 years )"
                                    className="w-full bg-input border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 transition-all text-foreground"
                                    value={jobData.experience}
                                    onChange={(e) => setJobData({ ...jobData, experience: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-indigo-400">Weight (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-full bg-input border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 transition-all text-foreground text-center"
                                    value={jobData.experienceWeight}
                                    onChange={(e) => setJobData({ ...jobData, experienceWeight: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-3 space-y-2">
                                <label className="text-sm font-semibold text-foreground-muted">Detailed Description</label>
                                <textarea
                                    required
                                    rows={6}
                                    placeholder="Paste the full job description here..."
                                    className="w-full bg-input border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 transition-all text-foreground resize-none"
                                    value={jobData.description}
                                    onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-indigo-400">Weight (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-full bg-input border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 transition-all text-foreground text-center"
                                    value={jobData.descriptionWeight}
                                    onChange={(e) => setJobData({ ...jobData, descriptionWeight: parseInt(e.target.value) || 0 })}
                                />
                                <div className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                                    <p className="text-[10px] uppercase font-black text-indigo-400 mb-1">Total Weight</p>
                                    <p className={`text-xl font-bold ${parseInt(jobData.skillWeight) + parseInt(jobData.experienceWeight) + parseInt(jobData.descriptionWeight) === 100 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {parseInt(jobData.skillWeight) + parseInt(jobData.experienceWeight) + parseInt(jobData.descriptionWeight)}%
                                    </p>
                                    <p className="text-[9px] text-foreground-muted leading-tight mt-1">Must equal 100% to proceed</p>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all flex flex-col items-center justify-center gap-0 group"
                        >
                            <span className="flex items-center gap-2">
                                Next: Upload Resumes <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </form>
                </div>
            )}

            {/* Step 2: Resume Upload */}
            {step === 2 && (
                <div className="glass-card p-8 lg:p-12 space-y-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">Upload Candidate Resumes</h2>
                            <p className="text-foreground-muted">You can upload multiple files at once.</p>
                        </div>
                        <button onClick={() => setStep(1)} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                            Back to JD
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-3xl bg-input hover:bg-black/5 dark:hover:bg-white/5 hover:border-indigo-500/50 transition-all cursor-pointer group">
                                <div className="flex flex-col items-center justify-center text-center px-4">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                                        <Plus size={32} />
                                    </div>
                                    <p className="text-foreground font-bold mb-1">Click to add resumes</p>
                                    <p className="text-xs text-foreground-muted">Attach files (PDF, DOCX)</p>
                                </div>
                                <input type="file" multiple className="hidden" onChange={handleFileUpload} accept=".pdf,.docx" />
                            </label>
                        </div>

                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
                            {resumes.length > 0 && (
                                <div className="flex justify-between items-center px-4 py-3 bg-black/5 dark:bg-white/5 border border-border rounded-2xl mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                        <span className="text-xs font-bold text-foreground-muted">{resumes.length} Files Ready</span>
                                    </div>
                                    <button
                                        onClick={() => setResumes([])}
                                        className="text-xs font-bold text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors flex items-center gap-1"
                                    >
                                        <X size={12} /> Clear All
                                    </button>
                                </div>
                            )}
                            {resumes.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-foreground-muted border border-border rounded-3xl bg-input/50 min-h-[256px]">
                                    <FileText size={48} className="mb-2 opacity-20" />
                                    <p className="text-sm font-medium">No files uploaded yet</p>
                                </div>
                            ) : (
                                <>
                                    {resumes.slice(0, 20).map((file, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 border border-border rounded-2xl group animate-in slide-in-from-right-2">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                                                    <FileText size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground truncate max-w-[200px]">{file.name}</p>
                                                    <p className="text-[10px] text-foreground-muted font-bold uppercase">{(file.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                            </div>
                                            <button onClick={() => removeResume(i)} className="p-2 text-foreground-muted hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {resumes.length > 20 && (
                                        <div className="p-4 border border-border border-dashed rounded-2xl text-center text-foreground-muted text-sm font-medium">
                                            And {resumes.length - 20} more files...
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => setStep(3)}
                        disabled={resumes.length === 0}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group"
                    >
                        Next: Review & Finish <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}

            {/* Step 3: Review & Run */}
            {step === 3 && (
                <div className="glass-card p-8 lg:p-12 space-y-8 text-center">
                    {!isProcessing ? (
                        <>
                            <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mx-auto mb-6">
                                <Zap size={40} />
                            </div>
                            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Analyze?</h2>
                            <p className="text-foreground-muted max-w-xl mx-auto mb-10">
                                You have defined requirements for <span className="text-indigo-600 dark:text-indigo-400 font-bold">{jobData.title}</span> and uploaded <span className="text-indigo-600 dark:text-indigo-400 font-bold">{resumes.length} resumes</span>. Our AI will now rank them based on relevance and skill match.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
                                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border text-left">
                                    <p className="text-[10px] text-foreground-muted uppercase font-black mb-1">Target Skills</p>
                                    <p className="text-sm text-foreground font-bold truncate">{jobData.skills}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border text-left">
                                    <p className="text-[10px] text-foreground-muted uppercase font-black mb-1">Experience</p>
                                    <p className="text-sm text-foreground font-bold truncate">{jobData.experience}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border text-left">
                                    <p className="text-[10px] text-foreground-muted uppercase font-black mb-1">Total Candidates</p>
                                    <p className="text-sm text-foreground font-bold">{resumes.length} Files</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStep(2)} className="flex-1 py-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground border border-border rounded-2xl font-bold transition-all">
                                    Back to Upload
                                </button>
                                <button onClick={startScreening} className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all">
                                    Start AI Screening
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="py-12">
                            <div className="relative inline-block mb-8">
                                <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Zap size={32} className="text-indigo-500 dark:text-indigo-400 animate-pulse" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">Analyzing Profiles...</h2>
                            <p className="text-foreground-muted mb-4">AI is reaching results, please wait...</p>

                            <div className="mt-8 space-y-4 max-w-sm mx-auto">
                                <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 transition-all duration-300 ease-out"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[10px] text-foreground-muted uppercase tracking-widest font-black">
                                    <span className={uploadProgress > 0 ? 'text-indigo-400' : ''}>Uploading</span>
                                    <span className={uploadProgress === 100 ? 'text-indigo-400' : ''}>Analyzing</span>
                                    <span>Finalizing</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ScreeningWorkflow;
