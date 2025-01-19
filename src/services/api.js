// Path: codeSage.fe/src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 seconds
});

// Add auth token to all requests
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
      // Handle unauthorized (clear token and redirect to login)
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const analysisService = {
  analyzeCodebase: async (path, fileTypes, analysisType = 'understand') => {
    const response = await api.post('/analyze/codebase', {
      path,
      file_types: fileTypes,
      analysis_type: analysisType
    });
    return response.data;
  },

  analyzeFile: async (filePath, analysisType = 'understand') => {
    const response = await api.post('/analyze/file', {
      file_path: filePath,
      analysis_type: analysisType
    });
    return response.data;
  },

  analyzeSnippet: async (code, language, analysisType = 'understand') => {
    const response = await api.post('/analyze/snippet', {
      code,
      language,
      analysis_type: analysisType
    });
    return response.data;
  }
};

export const licenseService = {
  validateLicense: async (licenseKey) => {
    const response = await api.post('/license/validate', {
      license_key: licenseKey
    });
    return response.data;
  },

  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export const settingsService = {
  // This would be implemented when we add settings endpoints to the backend
  getSettings: async () => {
    // TODO: Implement when backend endpoint is ready
    return {};
  },

  updateSettings: async (settings) => {
    // TODO: Implement when backend endpoint is ready
    return settings;
  }
};