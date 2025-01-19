// Path: codeSage.fe/src/context/CodebaseContext.js

import React, { createContext, useContext, useState } from 'react';

const CodebaseContext = createContext(null);

export const CodebaseProvider = ({ children }) => {
    const [codebase, setCodebase] = useState({
        path: null,
        isAnalyzed: false,
        files: [],
        stats: null
    });

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const loadCodebase = async (path) => {
        setIsAnalyzing(true);
        try {
            // TODO: Implement actual codebase loading and analysis
            // This would interact with the backend to:
            // 1. Load the codebase
            // 2. Analyze it
            // 3. Build the knowledge base
            const response = await new Promise(resolve =>
                setTimeout(() => resolve({ success: true }), 2000)
            );

            setCodebase({
                path,
                isAnalyzed: true,
                files: [], // Will be populated with actual files
                stats: {} // Will be populated with codebase stats
            });
        } catch (error) {
            console.error('Error loading codebase:', error);
            throw error;
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <CodebaseContext.Provider
            value={{
                codebase,
                isAnalyzing,
                loadCodebase
            }}
        >
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