// Path: codeSage.fe/src/context/CodebaseContext.js

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CodebaseContext = createContext(null);

export const CodebaseProvider = ({ children }) => {
    const { authFetch } = useAuth();
    const [codebase, setCodebase] = useState({
        path: null,
        isAnalyzed: false,
        files: [],
        stats: null,
        lastAnalysis: null
    });

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);

    const loadCodebase = async (path) => {
        setIsAnalyzing(true);
        setError(null);

        try {
            // First, verify the path exists and is readable
            const verifyResponse = await authFetch(`${API_BASE_URL}/api/analyze/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ path })
            });

            if (!verifyResponse.ok) {
                throw new Error('Invalid directory path or permission denied');
            }

            // Start analysis
            const response = await authFetch(`${API_BASE_URL}/api/analyze/codebase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    path,
                    analysis_type: 'understand'
                })
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const data = await response.json();

            setCodebase({
                path,
                isAnalyzed: true,
                files: data.files || [],
                stats: data.project_summary || null,
                lastAnalysis: new Date().toISOString()
            });

            return true;
        } catch (err) {
            setError(err.message);
            console.error('Error loading codebase:', err);
            return false;
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getFileContent = useCallback(async (filePath) => {
        try {
            const response = await authFetch(`${API_BASE_URL}/api/file/content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ file_path: filePath })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch file content');
            }

            const data = await response.json();
            return data.content;
        } catch (err) {
            console.error('Error fetching file content:', err);
            throw err;
        }
    }, [authFetch]);

    const analyzeFile = useCallback(async (filePath, analysisType = 'understand') => {
        try {
            const response = await authFetch(`${API_BASE_URL}/api/analyze/file`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    file_path: filePath,
                    analysis_type: analysisType
                })
            });

            if (!response.ok) {
                throw new Error('File analysis failed');
            }

            return await response.json();
        } catch (err) {
            console.error('Error analyzing file:', err);
            throw err;
        }
    }, [authFetch]);

    const refreshCodebase = async () => {
        if (!codebase.path) return false;
        return await loadCodebase(codebase.path);
    };

    const clearCodebase = () => {
        setCodebase({
            path: null,
            isAnalyzed: false,
            files: [],
            stats: null,
            lastAnalysis: null
        });
        setError(null);
    };

    const searchFiles = useCallback(async (query) => {
        if (!codebase.path) return [];

        try {
            const response = await authFetch(`${API_BASE_URL}/api/files/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    codebase_path: codebase.path,
                    query
                })
            });

            if (!response.ok) {
                throw new Error('Search failed');
            }

            return await response.json();
        } catch (err) {
            console.error('Search error:', err);
            return [];
        }
    }, [authFetch, codebase.path]);

    return (
        <CodebaseContext.Provider value={{
            codebase,
            isAnalyzing,
            error,
            loadCodebase,
            getFileContent,
            analyzeFile,
            refreshCodebase,
            clearCodebase,
            searchFiles
        }}>
            {children}
        </CodebaseContext.Provider>
    );
};

export const useCodebase = () => {
    const context = useContext(CodebaseContext);
    if (!context) {
        throw new Error('useCodebase must be used within a CodebaseProvider');
    }
    return context;
};