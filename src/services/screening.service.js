import api from './api';

class ScreeningService {
    async runScreening(jobId, isResumeBank = false) {
        console.log(`ScreeningService: Running screening for Job ID: ${jobId}, Resume Bank: ${isResumeBank}`);
        const response = await api.post(`/screening/run/${jobId}`, null, {
            params: { isResumeBank }
        });
        // Normalize camelCase to snake_case if necessary for frontend consistency
        const data = response.data.map(item => ({
            ...item,
            total_score: item.totalScore,
            skill_match_score: item.skillMatchScore,
            experience_score: item.experienceScore,
            education_score: item.educationScore,
            matched_skills: item.matchedSkills,
            missing_skills: item.missingSkills
        }));
        return { data };
    }

    async getResults(jobId, isResumeBank = false) {
        const response = await api.get(`/screening/results/${jobId}`, {
            params: { isResumeBank }
        });
        const data = response.data.map(item => ({
            ...item,
            total_score: item.totalScore,
            skill_match_score: item.skillMatchScore,
            experience_score: item.experienceScore,
            education_score: item.educationScore,
            matched_skills: item.matchedSkills,
            missing_skills: item.missingSkills,
            resume: item.resume ? {
                ...item.resume,
                candidate_name: item.resume.candidateName,
                candidate_email: item.resume.candidateEmail,
                experience_years: item.resume.experienceYears
            } : null
        }));
        return { data };
    }

    async getResultsCombined(jobId) {
        // In the Spring Boot backend, we can just aggregate results from both types
        // or have a specific endpoint. Assuming getResults handles jobId and we might want all.
        const response = await api.get(`/screening/results/${jobId}`);
        const data = response.data.map(item => ({
            ...item,
            total_score: item.totalScore,
            skill_match_score: item.skillMatchScore,
            experience_score: item.experienceScore,
            education_score: item.educationScore,
            matched_skills: item.matchedSkills,
            missing_skills: item.missingSkills,
            resume: item.resume ? {
                ...item.resume,
                candidate_name: item.resume.candidateName,
                candidate_email: item.resume.candidateEmail,
                experience_years: item.resume.experienceYears
            } : null
        }));
        return { data };
    }

    async getResultsByJob(jobId, isResumeBank = false) {
        const response = await api.get(`/screening/results/${jobId}`, {
            params: { isResumeBank }
        });
        return response.data;
    }

    async getAllResults(isResumeBank = false) {
        const response = await api.get('/screening', {
            params: { isResumeBank }
        });
        return response.data;
    }

    async getAllResultsCombined() {
        const response = await api.get('/screening/all');
        return response.data;
    }

    async getResultsByJobCombined(jobId) {
        const response = await api.get(`/screening/all/results/${jobId}`);
        return response.data;
    }
}

export default new ScreeningService();
