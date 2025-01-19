// Path: codeSage.fe/src/services/visualizationApi.js

import axios from 'axios';
import { getErrorMessage } from '../utils';

const api = axios.create({
    baseURL: '/api/visualize',
    timeout: 30000
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const visualizationService = {
    // Dependency Graph
    getDependencyGraph: async (codebasePath, config = {}) => {
        try {
            const response = await api.post('/dependencies', {
                codebasePath,
                config
            });
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    // Data Flow Visualization
    getDataFlow: async (codebasePath, componentId, config = {}) => {
        try {
            const response = await api.post('/dataflow', {
                codebasePath,
                componentId,
                config
            });
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    // Bug Impact Analysis
    getBugImpact: async (codebasePath, bugInfo, config = {}) => {
        try {
            const response = await api.post('/bug-impact', {
                codebasePath,
                bugInfo,
                config
            });
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    // Export Visualization
    exportVisualization: async (visualizationType, data, format = 'html') => {
        try {
            const response = await api.post('/export', {
                type: visualizationType,
                data,
                format
            }, {
                responseType: format === 'html' ? 'text' : 'blob'
            });
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    // Update Visualization Layout
    updateLayout: async (visualizationType, layout) => {
        try {
            const response = await api.post('/update-layout', {
                type: visualizationType,
                layout
            });
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    // Get Visualization Metrics
    getMetrics: async (visualizationType, data) => {
        try {
            const response = await api.post('/metrics', {
                type: visualizationType,
                data
            });
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    }
};

// WebSocket connection for real-time updates
export class VisualizationWebSocket {
    constructor(codebasePath) {
        this.codebasePath = codebasePath;
        this.ws = null;
        this.listeners = new Map();
    }

    connect() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/api/visualize/ws`;

        this.ws = new WebSocket(wsUrl);

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const listeners = this.listeners.get(data.type) || [];
                listeners.forEach(listener => listener(data.payload));
            } catch (error) {
                console.error('WebSocket message error:', error);
            }
        };

        this.ws.onclose = () => {
            setTimeout(() => this.connect(), 5000); // Reconnect after 5 seconds
        };
    }

    subscribe(type, callback) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, []);
        }
        this.listeners.get(type).push(callback);

        return () => {
            const callbacks = this.listeners.get(type) || [];
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }

    sendMessage(type, payload) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type,
                payload,
                codebasePath: this.codebasePath
            }));
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.listeners.clear();
    }
}

// Helper function to create WebSocket instance
export const createVisualizationWebSocket = (codebasePath) => {
    const ws = new VisualizationWebSocket(codebasePath);
    ws.connect();
    return ws;
};

// Types for TypeScript support (if needed later)
export const VisualizationTypes = {
    DEPENDENCY: 'dependency',
    DATA_FLOW: 'dataFlow',
    BUG_IMPACT: 'bugImpact'
};

export const ExportFormats = {
    HTML: 'html',
    PNG: 'png',
    SVG: 'svg',
    JSON: 'json'
};