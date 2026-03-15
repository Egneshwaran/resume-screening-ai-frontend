import React, { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    Bell,
    FileText,
    Mail,
    Save,
    Zap,
    Cpu,
    Target
} from 'lucide-react';
import settingsService from '../services/settings.service';

const SettingsCard = ({ icon: Icon, title, description, children, active = false }) => (
    <div className={`glass-card p-8 border ${active ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-border'} transition-all duration-300`}>
        <div className="flex items-start gap-6 mb-8">
            <div className={`p-3 rounded-2xl ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-black/5 dark:bg-white/5 text-foreground-muted border border-border'}`}>
                <Icon size={24} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-foreground mb-1 tracking-tight">{title}</h3>
                <p className="text-sm text-foreground-muted font-medium">{description}</p>
            </div>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

const SettingRow = ({ label, description, id, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-border last:border-0 group">
        <div className="space-y-1 sm:w-2/3">
            <label htmlFor={id} className="text-sm font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer">{label}</label>
            <p className="text-xs text-foreground-muted font-medium">{description}</p>
        </div>
        <div className="flex-shrink-0 sm:w-1/3 flex justify-end">
            {children}
        </div>
    </div>
);

const ToggleButton = ({ active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-12 h-6 rounded-full transition-all duration-300 relative ${active ? 'bg-indigo-600' : 'bg-black/20 dark:bg-white/20'}`}
    >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${active ? 'left-7' : 'left-1'}`}></div>
    </button>
);

const Settings = () => {
    const [settings, setSettings] = useState({
        highPotentialThreshold: 85,
        mediumMatchThreshold: 70,
        lowMatchThreshold: 50,
        autoParseResumes: true,
        extractSkills: true,
        detectExperience: true,
        extractEducation: true,
        alertScoreThresholdEnabled: true,
        alertStrongSkillMatch: false,
        alertTopCandidateIdentified: true,
        autoEmailShortlisted: false,
        defaultEmailTemplate: "Dear {candidate_name},\n\nWe are pleased to inform you that your profile has been shortlisted for the {job_title} position.\n\nBest regards,\nHR Team",
        recruiterSignature: "Recruiter\nTalent Acquisition Team"
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const { data } = await settingsService.getSettings();
            if (data) {
                setSettings(data);
            }
        } catch (error) {
            console.error("Error loading settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { data } = await settingsService.updateSettings(settings);
            setSettings(data);
            alert("Settings synchronized successfully.");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Cpu className="animate-spin text-indigo-500" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-indigo-500 dark:text-indigo-400 mb-1">
                        <SettingsIcon size={20} />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Application Control</span>
                    </div>
                    <h1 className="text-4xl font-black text-foreground tracking-tight">System Configuration</h1>
                    <p className="text-foreground-muted font-medium">Fine-tune the AI recruitment engine and notifications.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="premium-button px-10 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/20 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95"
                >
                    {isSaving ? (
                        <>
                            <Cpu className="animate-spin" size={22} />
                            <span>Synchronizing...</span>
                        </>
                    ) : (
                        <>
                            <Save size={22} />
                            <span>Save Configuration</span>
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Screening Threshold Settings */}
                <SettingsCard
                    icon={Target}
                    title="Screening Threshold Settings"
                    description="Define score ranges for candidate matching."
                    active={true}
                >
                    <SettingRow
                        label="High Potential Threshold"
                        description="Minimum AI confidence score for High Potential."
                    >
                        <div className="flex items-center gap-4 w-full justify-end">
                            <input
                                type="range"
                                min="75" max="99"
                                value={settings.highPotentialThreshold}
                                onChange={(e) => setSettings({ ...settings, highPotentialThreshold: parseInt(e.target.value) })}
                                className="w-full sm:w-24 lg:w-32 h-1.5 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <span className="text-sm font-black text-indigo-500 dark:text-indigo-400 w-8">{settings.highPotentialThreshold}%</span>
                        </div>
                    </SettingRow>
                    <SettingRow
                        label="Medium Match Threshold"
                        description="Score required for Medium Match category."
                    >
                        <div className="flex items-center gap-4 w-full justify-end">
                            <input
                                type="range"
                                min="50" max="74"
                                value={settings.mediumMatchThreshold}
                                onChange={(e) => setSettings({ ...settings, mediumMatchThreshold: parseInt(e.target.value) })}
                                className="w-full sm:w-24 lg:w-32 h-1.5 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <span className="text-sm font-black text-indigo-500 dark:text-indigo-400 w-8">{settings.mediumMatchThreshold}%</span>
                        </div>
                    </SettingRow>
                    <SettingRow
                        label="Low Match Threshold"
                        description="Score required for Low Match category."
                    >
                        <div className="flex items-center gap-4 w-full justify-end">
                            <input
                                type="range"
                                min="10" max="49"
                                value={settings.lowMatchThreshold}
                                onChange={(e) => setSettings({ ...settings, lowMatchThreshold: parseInt(e.target.value) })}
                                className="w-full sm:w-24 lg:w-32 h-1.5 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <span className="text-sm font-black text-indigo-500 dark:text-indigo-400 w-8">{settings.lowMatchThreshold}%</span>
                        </div>
                    </SettingRow>
                </SettingsCard>

                {/* 2. Resume Parsing Settings */}
                <SettingsCard
                    icon={FileText}
                    title="Resume Parsing Settings"
                    description="Configure data extraction logic during upload."
                >
                    <SettingRow
                        label="Automatic Resume Parsing"
                        description="Auto-extract candidate details from uploaded PDFs."
                    >
                        <ToggleButton 
                            active={settings.autoParseResumes} 
                            onClick={() => setSettings({ ...settings, autoParseResumes: !settings.autoParseResumes })} 
                        />
                    </SettingRow>
                    <SettingRow
                        label="Skill Extraction"
                        description="Identify and extract technical and soft skills."
                    >
                        <ToggleButton 
                            active={settings.extractSkills} 
                            onClick={() => setSettings({ ...settings, extractSkills: !settings.extractSkills })} 
                        />
                    </SettingRow>
                    <SettingRow
                        label="Experience Detection"
                        description="Calculate years of experience from work history."
                    >
                        <ToggleButton 
                            active={settings.detectExperience} 
                            onClick={() => setSettings({ ...settings, detectExperience: !settings.detectExperience })} 
                        />
                    </SettingRow>
                    <SettingRow
                        label="Education Extraction"
                        description="Parse degrees, universities, and graduation years."
                    >
                        <ToggleButton 
                            active={settings.extractEducation} 
                            onClick={() => setSettings({ ...settings, extractEducation: !settings.extractEducation })} 
                        />
                    </SettingRow>
                </SettingsCard>

                {/* 3. Smart Candidate Alerts */}
                <SettingsCard
                    icon={Bell}
                    title="Smart Candidate Alerts"
                    description="Trigger notifications for outstanding candidates."
                >
                    <SettingRow
                        label="Score Threshold Alerts"
                        description={`Notify when a candidate exceeds ${settings.highPotentialThreshold}% matching score.`}
                    >
                        <ToggleButton 
                            active={settings.alertScoreThresholdEnabled} 
                            onClick={() => setSettings({ ...settings, alertScoreThresholdEnabled: !settings.alertScoreThresholdEnabled })} 
                        />
                    </SettingRow>
                    <SettingRow
                        label="Strong Skill Match"
                        description="Notify when a candidate hits 100% on required skills."
                    >
                        <ToggleButton 
                            active={settings.alertStrongSkillMatch} 
                            onClick={() => setSettings({ ...settings, alertStrongSkillMatch: !settings.alertStrongSkillMatch })} 
                        />
                    </SettingRow>
                    <SettingRow
                        label="Top Candidate Identified"
                        description="Notify when the AI screening flags a top priority candidate."
                    >
                        <ToggleButton 
                            active={settings.alertTopCandidateIdentified} 
                            onClick={() => setSettings({ ...settings, alertTopCandidateIdentified: !settings.alertTopCandidateIdentified })} 
                        />
                    </SettingRow>
                </SettingsCard>

                {/* 4. Candidate Communication Settings */}
                <SettingsCard
                    icon={Mail}
                    title="Candidate Communication"
                    description="Manage automated emails and templates."
                >
                    <SettingRow
                        label="Auto-Email Shortlisted"
                        description="Automatically email candidates when marked as High Potential."
                    >
                        <ToggleButton 
                            active={settings.autoEmailShortlisted} 
                            onClick={() => setSettings({ ...settings, autoEmailShortlisted: !settings.autoEmailShortlisted })} 
                        />
                    </SettingRow>
                    
                    <div className="py-4 border-b border-border">
                        <label className="text-sm font-bold text-foreground mb-2 block">Default Email Template</label>
                        <textarea 
                            className="w-full bg-input border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:border-indigo-500 font-mono h-32"
                            value={settings.defaultEmailTemplate}
                            onChange={(e) => setSettings({ ...settings, defaultEmailTemplate: e.target.value })}
                            placeholder="Dear {candidate_name}..."
                        />
                    </div>
                    
                    <div className="py-4">
                        <label className="text-sm font-bold text-foreground mb-2 block">Recruiter Signature</label>
                        <textarea 
                            className="w-full bg-input border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:border-indigo-500 font-mono h-24"
                            value={settings.recruiterSignature}
                            onChange={(e) => setSettings({ ...settings, recruiterSignature: e.target.value })}
                            placeholder="John Doe&#10;Head of Talent"
                        />
                    </div>
                </SettingsCard>
            </div>
        </div>
    );
};

export default Settings;

