// Path: codeSage.fe/src/services/api.js

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
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
      // Clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const analysisService = {
  analyzeCodebase: async (path, fileTypes, analysisType = 'understand') => {
    try {
      const response = await api.post('/analyze/codebase', {
        path,
        file_types: fileTypes,
        analysis_type: analysisType
      });
      return response.data;
    } catch (error) {
      console.error('Analysis error:', error);
      throw error.response?.data || error.message;
    }
  },

  analyzeFile: async (filePath, analysisType = 'understand') => {
    try {
      const response = await api.post('/analyze/file', {
        file_path: filePath,
        analysis_type: analysisType
      });
      return response.data;
    } catch (error) {
      console.error('File analysis error:', error);
      throw error.response?.data || error.message;
    }
  },

  analyzeSnippet: async (code, language, analysisType = 'understand') => {
    try {
      const response = await api.post('/analyze/snippet', {
        code,
        language,
        analysis_type: analysisType
      });
      return response.data;
    } catch (error) {
      console.error('Snippet analysis error:', error);
      throw error.response?.data || error.message;
    }
  }
};

export const licenseService = {
  validateLicense: async (licenseKey) => {
    try {
      const response = await api.post('/license/validate', { license_key: licenseKey });
      return response.data;
    } catch (error) {
      console.error('License validation error:', error);
      throw error.response?.data || error.message;
    }
  },

  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error.response?.data || error.message;
    }
  }
};

export const fileService = {
  getContent: async (filePath) => {
    try {
      const response = await api.post('/file/content', { file_path: filePath });
      return response.data;
    } catch (error) {
      console.error('File content error:', error);
      throw error.response?.data || error.message;
    }
  },

  search: async (query, path) => {
    try {
      const response = await api.post('/file/search', { query, path });
      return response.data;
    } catch (error) {
      console.error('File search error:', error);
      throw error.response?.data || error.message;
    }
  }
};

export const visualizationService = {
  getDependencyGraph: async (codebasePath, config = {}) => {
    try {
      const response = await api.post('/visualize/dependencies', {
        codebasePath,
        config
      });
      return response.data;
    } catch (error) {
      console.error('Dependency graph error:', error);
      throw error.response?.data || error.message;
    }
  },

  getDataFlow: async (codebasePath, componentId, config = {}) => {
    try {
      const response = await api.post('/visualize/dataflow', {
        codebasePath,
        componentId,
        config
      });
      return response.data;
    } catch (error) {
      console.error('Data flow error:', error);
      throw error.response?.data || error.message;
    }
  },

  getBugImpact: async (codebasePath, bugInfo, config = {}) => {
    try {
      const response = await api.post('/visualize/bug-impact', {
        codebasePath,
        bugInfo,
        config
      });
      return response.data;
    } catch (error) {
      console.error('Bug impact error:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default {
  analysisService,
  licenseService,
  fileService,
  visualizationService
};