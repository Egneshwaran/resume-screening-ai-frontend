import { supabase } from '../lib/supabase';

class SettingsService {
    async getSettings() {
        console.log("SettingsService: Fetching settings...");
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error("SettingsService Fetch Error:", error);
            throw error;
        }
        
        return { data: data || {} };
    }

    async updateSettings(settingsData) {
        console.log("SettingsService: Updating settings...", settingsData);
        
        const { data, error } = await supabase
            .from('settings')
            .upsert({ id: 1, ...settingsData }) 
            .select()
            .single();

        if (error) {
            console.error("SettingsService Update Error:", error);
            throw error;
        }

        return { data };
    }
}

export default new SettingsService();
