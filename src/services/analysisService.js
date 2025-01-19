// Path: codeSage.fe/src/services/analysisService.js

class AnalysisService {
    constructor() {
        this.API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        this.activeAnalysis = new Map();
        this.subscribers = new Map();
        this.analysisQueue = [];
        this.isProcessing = false;
    }

    async analyzeCode(code, context = {}, options = {}) {
        const analysisId = Date.now().toString();

        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${this.API_BASE_URL}/api/analyze/code`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code,
                    context,
                    options
                })
            });

            if (!response.ok) throw new Error('Analysis request failed');

            const result = await response.json();
            this._notifySubscribers('analysis', {
                id: analysisId,
                status: 'complete',
                result
            });

            return result;

        } catch (error) {
            this._notifySubscribers('analysis', {
                id: analysisId,
                status: 'error',
                error: error.message
            });
            throw error;
        }
    }

    async analyzeBug(filePath, lineNumber, bugDescription, context = {}) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${this.API_BASE_URL}/api/analyze/bug`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    file_path: filePath,
                    line_number: lineNumber,
                    description: bugDescription,
                    context
                })
            });

            if (!response.ok) throw new Error('Bug analysis failed');
            return await response.json();

        } catch (error) {
            console.error('Bug analysis error:', error);
            throw error;
        }
    }

    async suggestFix(bugAnalysis, context = {}) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${this.API_BASE_URL}/api/suggest/fix`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bug_analysis: bugAnalysis,
                    context
                })
            });

            if (!response.ok) throw new Error('Fix suggestion failed');
            return await response.json();

        } catch (error) {
            console.error('Fix suggestion error:', error);
            throw error;
        }
    }

    subscribe(type, callback) {
        if (!this.subscribers.has(type)) {
            this.subscribers.set(type, new Set());
        }
        this.subscribers.get(type).add(callback);

        // Return unsubscribe function
        return () => {
            const typeSubscribers = this.subscribers.get(type);
            if (typeSubscribers) {
                typeSubscribers.delete(callback);
            }
        };
    }

    _notifySubscribers(type, data) {
        const subscribers = this.subscribers.get(type);
        if (subscribers) {
            subscribers.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Subscriber callback error:', error);
                }
            });
        }
    }

    async batchAnalyze(files, options = {}) {
        const batchId = Date.now().toString();
        const results = new Map();
        let completedCount = 0;

        for (const file of files) {
            try {
                const result = await this.analyzeCode(file.content, {
                    path: file.path,
                    ...options
                });

                results.set(file.path, result);
                completedCount++;

                this._notifySubscribers('batchProgress', {
                    batchId,
                    completedCount,
                    totalCount: files.length,
                    currentResult: result
                });

            } catch (error) {
                console.error(`Error analyzing file ${file.path}:`, error);
                results.set(file.path, { error: error.message });
            }
        }

        return Array.from(results.entries()).reduce((acc, [path, result]) => {
            acc[path] = result;
            return acc;
        }, {});
    }

    cancelAnalysis(analysisId) {
        const analysis = this.activeAnalysis.get(analysisId);
        if (analysis) {
            analysis.cancelled = true;
            this.activeAnalysis.delete(analysisId);
            this._notifySubscribers('analysis', {
                id: analysisId,
                status: 'cancelled'
            });
        }
    }

    clearQueue() {
        this.analysisQueue = [];
        this.isProcessing = false;
    }
}

// Create singleton instance
const analysisService = new AnalysisService();
export default analysisService;