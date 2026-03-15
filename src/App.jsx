import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ResumeChecker from './pages/ResumeChecker';
import Dashboard from './pages/Dashboard';
import JobList from './pages/JobList';
import ResumeList from './pages/ResumeList';
import Rankings from './pages/Rankings';
import ScreeningWorkflow from './pages/ScreeningWorkflow';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import CreateJob from './pages/CreateJob';
import RecentActivity from './pages/RecentActivity';
import Notifications from './pages/Notifications';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Routes>
            {/* Public Landing & Features */}
            <Route path="/" element={<Home />} />
            <Route path="/resume-checker" element={<ResumeChecker />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Recruitment/Admin Routes */}
            {/* Using a cleaner approach for nested admin paths */}
            <Route path="/admin">
                <Route index element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
                <Route path="jobs" element={<ProtectedRoute><AdminLayout><JobList /></AdminLayout></ProtectedRoute>} />
                <Route path="jobs/new" element={<ProtectedRoute><AdminLayout><CreateJob /></AdminLayout></ProtectedRoute>} />
                <Route path="new-screening" element={<ProtectedRoute><AdminLayout><ScreeningWorkflow /></AdminLayout></ProtectedRoute>} />
                <Route path="resumes" element={<ProtectedRoute><AdminLayout><ResumeList /></AdminLayout></ProtectedRoute>} />
                <Route path="rankings/:jobId" element={<ProtectedRoute><AdminLayout><Rankings /></AdminLayout></ProtectedRoute>} />
                <Route path="analytics" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
                <Route path="activity" element={<ProtectedRoute><AdminLayout><RecentActivity /></AdminLayout></ProtectedRoute>} />
                <Route path="notifications" element={<ProtectedRoute><AdminLayout><Notifications /></AdminLayout></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><AdminLayout><Profile /></AdminLayout></ProtectedRoute>} />
                <Route path="settings" element={<ProtectedRoute><AdminLayout><Settings /></AdminLayout></ProtectedRoute>} />
            </Route>

            {/* Catch-all - redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
