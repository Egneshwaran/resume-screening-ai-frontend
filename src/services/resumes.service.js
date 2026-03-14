import api from './api';

class ResumeService {
    async getAllResumes() {
        const response = await api.get('/resumes');
        return response.data;
    }

    async getResumeById(id) {
        const response = await api.get(`/resumes/${id}`);
        return response.data;
    }

    async getResumesByJobId(jobId, isResumeBank = false) {
        const response = await api.get(`/resumes/job/${jobId}`, {
            params: { isResumeBank }
        });
        return response.data;
    }

    async uploadResume(file, jobId, token, isResumeBank = false) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('jobId', jobId);
        formData.append('isResumeBank', isResumeBank);

        const response = await api.post('/resumes/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async uploadBulkResumes(files, jobId, token, isResumeBank = false) {
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('files', file);
        });
        formData.append('jobId', jobId);
        formData.append('isResumeBank', isResumeBank);

        const response = await api.post('/resumes/bulk-upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return { data: response.data };
    }

    async deleteResume(id) {
        await api.delete(`/resumes/${id}`);
    }

    async checkATS(file, role = '') {
        const formData = new FormData();
        formData.append('file', file);
        if (role) formData.append('job_role', role);

        // Calling AI engine directly for ATS check if needed, 
        // but typically should go through backend.
        // For now, let's keep it simple following backend logic.
        const response = await api.post('/ats-check', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
}

export default new ResumeService();
