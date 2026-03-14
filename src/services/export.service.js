import screeningService from './screening.service';

class ExportService {
    async exportPdf(jobId = null) {
        // For PDF export, we fetch the data and generate client-side
        const data = await this._getExportData(jobId);
        // For now, create a simple text-based download
        const blob = this._generateTextReport(data, 'PDF');
        this._downloadFile(blob, 'screening_results.txt');
    }

    async exportExcel(jobId = null) {
        const data = await this._getExportData(jobId);
        const csvContent = this._generateCSV(data);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        this._downloadFile(blob, 'screening_results.csv');
    }

    async _getExportData(jobId) {
        try {
            if (jobId) {
                const res = await screeningService.getResultsCombined(jobId);
                return res.data || [];
            } else {
                const res = await screeningService.getAllResultsCombined();
                return res.data || [];
            }
        } catch (error) {
            console.error("Export Error:", error);
            return [];
        }
    }

    _generateCSV(data) {
        if (!data.length) return 'No results to export';

        const headers = [
            'Candidate Name',
            'Email',
            'Job Title',
            'Total Score',
            'Skill Score',
            'Experience Score',
            'Education Score',
            'Matched Skills',
            'Missing Skills',
            'Status',
            'Explanation'
        ];

        const rows = data.map(r => [
            r.resume?.candidate_name || 'N/A',
            r.resume?.candidate_email || 'N/A',
            r.job?.title || 'N/A',
            r.total_score,
            r.skill_match_score,
            r.experience_score,
            r.education_score,
            `"${r.matched_skills || ''}"`,
            `"${r.missing_skills || ''}"`,
            r.status,
            `"${(r.explanation || '').replace(/"/g, '""')}"`,
        ]);

        return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    _generateTextReport(data, format) {
        let content = '=== AI RESUME SCREENING RESULTS ===\n\n';
        content += `Generated: ${new Date().toLocaleString()}\n`;
        content += `Total Candidates: ${data.length}\n`;
        content += '='.repeat(50) + '\n\n';

        for (const r of data) {
            content += `Candidate: ${r.resume?.candidate_name || 'Unknown'}\n`;
            content += `Email: ${r.resume?.candidate_email || 'N/A'}\n`;
            content += `Job: ${r.job?.title || 'N/A'}\n`;
            content += `Total Score: ${r.total_score}%\n`;
            content += `Skill Score: ${r.skill_match_score}%\n`;
            content += `Experience Score: ${r.experience_score}%\n`;
            content += `Status: ${r.status}\n`;
            content += `Matched Skills: ${r.matched_skills || 'None'}\n`;
            content += `Missing Skills: ${r.missing_skills || 'None'}\n`;
            content += `Explanation: ${r.explanation || 'N/A'}\n`;
            content += '-'.repeat(40) + '\n\n';
        }

        return new Blob([content], { type: 'text/plain' });
    }

    _downloadFile(data, filename) {
        const url = window.URL.createObjectURL(data instanceof Blob ? data : new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
}

export default new ExportService();
