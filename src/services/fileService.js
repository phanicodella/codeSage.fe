// Path: codeSage.fe/src/services/fileService.js

import { debounce } from 'lodash';

class FileService {
    constructor() {
        this.API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        this.subscribers = new Map();
        this.fileCache = new Map();
        this.maxCacheSize = 50; // Maximum number of files to cache

        // Debounced save function
        this.debouncedSave = debounce(this.saveFile.bind(this), 1000);
    }

    async loadFile(filePath) {
        try {
            // Check cache first
            if (this.fileCache.has(filePath)) {
                return this.fileCache.get(filePath);
            }

            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${this.API_BASE_URL}/api/file/content`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ file_path: filePath })
            });

            if (!response.ok) throw new Error('Failed to load file');

            const data = await response.json();

            // Update cache
            this.updateCache(filePath, data);

            return data;

        } catch (error) {
            console.error('File load error:', error);
            throw error;
        }
    }

    async saveFile(filePath, content) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${this.API_BASE_URL}/api/file/save`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    file_path: filePath,
                    content
                })
            });

            if (!response.ok) throw new Error('Failed to save file');

            // Update cache
            this.updateCache(filePath, { content });

            this.notifySubscribers('fileSaved', { filePath });

            return await response.json();

        } catch (error) {
            console.error('File save error:', error);
            throw error;
        }
    }

    async searchFiles(query, options = {}) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${this.API_BASE_URL}/api/file/search`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query,
                    options
                })
            });

            if (!response.ok) throw new Error('File search failed');
            return await response.json();

        } catch (error) {
            console.error('File search error:', error);
            throw error;
        }
    }

    watchFile(filePath, callback) {
        if (!this.subscribers.has(filePath)) {
            this.subscribers.set(filePath, new Set());
        }
        this.subscribers.get(filePath).add(callback);

        return () => {
            const fileSubscribers = this.subscribers.get(filePath);
            if (fileSubscribers) {
                fileSubscribers.delete(callback);
            }
        };
    }

    notifySubscribers(event, data) {
        const { filePath } = data;
        const subscribers = this.subscribers.get(filePath);
        if (subscribers) {
            subscribers.forEach(callback => {
                try {
                    callback(event, data);
                } catch (error) {
                    console.error('Subscriber callback error:', error);
                }
            });
        }
    }

    updateCache(filePath, data) {
        // Remove oldest entry if cache is full
        if (this.fileCache.size >= this.maxCacheSize) {
            const oldestKey = this.fileCache.keys().next().value;
            this.fileCache.delete(oldestKey);
        }

        this.fileCache.set(filePath, data);
    }

    clearCache() {
        this.fileCache.clear();
    }

    async getFileStats(filePath) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${this.API_BASE_URL}/api/file/stats`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ file_path: filePath })
            });

            if (!response.ok) throw new Error('Failed to get file stats');
            return await response.json();

        } catch (error) {
            console.error('File stats error:', error);
            throw error;
        }
    }

    isTextFile(filePath) {
        const textExtensions = [
            '.txt', '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.c', '.cpp',
            '.h', '.hpp', '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt',
            '.json', '.yaml', '.yml', '.xml', '.html', '.css', '.scss', '.md'
        ];

        const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
        return textExtensions.includes(ext);
    }
}

// Create singleton instance
const fileService = new FileService();
export default fileService;