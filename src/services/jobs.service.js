import api from './api';

class JobService {
    async getAllJobs() {
        const response = await api.get('/jobs');
        const data = response.data.map(item => ({
            ...item,
            required_skills: item.requiredSkills,
            required_experience: item.requiredExperience,
            min_experience: item.minExperience,
            skill_weight: item.skillWeight,
            experience_weight: item.experienceWeight,
            description_weight: item.descriptionWeight
        }));
        return { data };
    }

    async getJobById(id) {
        const response = await api.get(`/jobs/${id}`);
        const item = response.data;
        const data = {
            ...item,
            required_skills: item.requiredSkills,
            required_experience: item.requiredExperience,
            min_experience: item.minExperience,
            skill_weight: item.skillWeight,
            experience_weight: item.experienceWeight,
            description_weight: item.descriptionWeight
        };
        return { data };
    }

    async createJob(jobData) {
        const response = await api.post('/jobs', {
            title: jobData.title,
            description: jobData.description,
            requiredSkills: jobData.requiredSkills || jobData.required_skills,
            requiredExperience: jobData.requiredExperience || jobData.required_experience,
            minExperience: jobData.minExperience || jobData.min_experience || 0,
            skillWeight: jobData.skillWeight || 50,
            experienceWeight: jobData.experienceWeight || 30,
            descriptionWeight: jobData.descriptionWeight || 20
        });
        return { data: response.data };
    }

    async deleteJob(id) {
        await api.delete(`/jobs/${id}`);
    }
}

export default new JobService();
