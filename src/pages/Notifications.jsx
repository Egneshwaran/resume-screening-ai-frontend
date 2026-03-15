import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Bell, 
    ArrowLeft, 
    CheckCheck, 
    Trash2, 
    Clock, 
    Info, 
    CheckCircle2, 
    AlertCircle,
    UserPlus,
    FileText,
    Activity
} from 'lucide-react';

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([
        { 
            id: 1, 
            title: 'Screening Complete', 
            message: 'Frontend Developer screening for 12 candidates is done. High match found: Jane Smith (89%).', 
            time: '2m ago', 
            type: 'success', 
            unread: true,
            details: 'The AI Engine has processed all resumes for the Frontend Developer role. You can now view the ranked list in the rankings section.'
        },
        { 
            id: 2, 
            title: 'New Application', 
            message: 'John Doe applied for Backend Engineer role.', 
            time: '1h ago', 
            type: 'info', 
            unread: true,
            details: 'A new candidate has submitted their application through the career portal. Resume parse successful.'
        },
        { 
            id: 3, 
            title: 'System Update', 
            message: 'AI Engine updated to v2.4 for better accuracy.', 
            time: '5h ago', 
            type: 'system', 
            unread: false,
            details: 'We have updated the vector embeddings model to improve semantic matching between job descriptions and resume text.'
        },
        { 
            id: 4, 
            title: 'Welcome to Dashboard', 
            message: 'Your recruitment dashboard is ready to use.', 
            time: '1d ago', 
            type: 'system', 
            unread: false,
            details: 'Setup complete. You can start creating job roles and uploading resumes for AI-powered screening.'
        },
    ]);

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="text-emerald-500" size={20} />;
            case 'info': return <UserPlus className="text-blue-500" size={20} />;
            case 'system': return <Activity className="text-indigo-500" size={20} />;
            default: return <Bell className="text-indigo-500" size={20} />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                        <Bell className="text-indigo-500" />
                        Notifications
                    </h1>
                    <p className="text-foreground-muted mt-1">Manage your recruitment alerts and system updates.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-xl text-sm font-bold hover:bg-indigo-500 hover:text-white transition-all"
                    >
                        <CheckCheck size={18} />
                        Mark All as Read
                    </button>
                </div>
            </div>

            {/* Notification List */}
            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((n) => (
                        <div 
                            key={n.id}
                            className={`group relative glass-card p-6 border-l-4 transition-all hover:translate-x-1 ${
                                n.unread 
                                    ? 'border-l-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/5' 
                                    : 'border-l-border bg-card/30 opacity-80 hover:opacity-100'
                            }`}
                        >
                            <div className="flex gap-6">
                                <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${
                                    n.type === 'success' ? 'bg-emerald-500/10' :
                                    n.type === 'info' ? 'bg-blue-500/10' :
                                    'bg-indigo-500/10'
                                }`}>
                                    {getIcon(n.type)}
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <h3 className={`font-bold text-lg ${n.unread ? 'text-foreground' : 'text-foreground-muted'}`}>
                                                {n.title}
                                            </h3>
                                            {n.unread && (
                                                <span className="px-2 py-0.5 bg-indigo-500 text-[10px] font-black uppercase text-white rounded">New</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-foreground-muted font-medium">
                                            <Clock size={14} />
                                            {n.time}
                                        </div>
                                    </div>
                                    
                                    <p className="text-foreground-muted leading-relaxed">
                                        {n.message}
                                    </p>

                                    <div className="pt-2">
                                        <p className="text-xs text-foreground-muted/60 leading-relaxed bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-border/50">
                                            {n.details}
                                        </p>
                                    </div>

                                    <div className="pt-4 flex items-center gap-4">
                                        <button className="text-xs font-bold text-indigo-500 hover:underline">
                                            See Details
                                        </button>
                                        <button 
                                            onClick={() => deleteNotification(n.id)}
                                            className="text-xs font-bold text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                                        >
                                            <Trash2 size={14} />
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="glass-card p-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto">
                            <Bell className="text-indigo-500/20" size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">No Notifications</h3>
                        <p className="text-foreground-muted max-w-xs mx-auto">You're all caught up! New alerts will appear here as they arrive.</p>
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

export default Notifications;
