// Path: codeSage.fe/src/context/VisualizationContext.js

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useCodebase } from './CodebaseContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const VisualizationContext = createContext(null);

export const VisualizationProvider = ({ children }) => {
    const { authFetch } = useAuth();
    const { codebase } = useCodebase();

    const [data, setData] = useState({
        dependency: null,
        dataFlow: null,
        bugImpact: null
    });

    const [loading, setLoading] = useState({
        dependency: false,
        dataFlow: false,
        bugImpact: false
    });

    const [error, setError] = useState({
        dependency: null,
        dataFlow: null,
        bugImpact: null
    });

    const [config, setConfig] = useState({
        theme: 'dark',
        layout: 'force',
        nodeSize: 20,
        edgeWidth: 1.0,
        fontSize: 12,
        showLabels: true,
        showWeights: false
    });

    const fetchDependencyGraph = useCallback(async () => {
        if (!codebase.path) return;

        setLoading(prev => ({ ...prev, dependency: true }));
        setError(prev => ({ ...prev, dependency: null }));

        try {
            const response = await authFetch(`${API_BASE_URL}/api/visualize/dependencies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    codebasePath: codebase.path,
                    config
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dependency graph');
            }

            const graphData = await response.json();
            setData(prev => ({ ...prev, dependency: graphData }));
        } catch (err) {
            setError(prev => ({ ...prev, dependency: err.message }));
            console.error('Dependency graph error:', err);
        } finally {
            setLoading(prev => ({ ...prev, dependency: false }));
        }
    }, [codebase.path, config, authFetch]);

    const fetchDataFlow = useCallback(async (componentId) => {
        if (!codebase.path || !componentId) return;

        setLoading(prev => ({ ...prev, dataFlow: true }));
        setError(prev => ({ ...prev, dataFlow: null }));

        try {
            const response = await authFetch(`${API_BASE_URL}/api/visualize/dataflow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    codebasePath: codebase.path,
                    componentId,
                    config
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data flow');
            }

            const flowData = await response.json();
            setData(prev => ({ ...prev, dataFlow: flowData }));
        } catch (err) {
            setError(prev => ({ ...prev, dataFlow: err.message }));
            console.error('Data flow error:', err);
        } finally {
            setLoading(prev => ({ ...prev, dataFlow: false }));
        }
    }, [codebase.path, config, authFetch]);

    const fetchBugImpact = useCallback(async (bugInfo) => {
        if (!codebase.path || !bugInfo) return;

        setLoading(prev => ({ ...prev, bugImpact: true }));
        setError(prev => ({ ...prev, bugImpact: null }));

        try {
            const response = await authFetch(`${API_BASE_URL}/api/visualize/bug-impact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    codebasePath: codebase.path,
                    bugInfo,
                    config
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch bug impact');
            }

            const impactData = await response.json();
            setData(prev => ({ ...prev, bugImpact: impactData }));
        } catch (err) {
            setError(prev => ({ ...prev, bugImpact: err.message }));
            console.error('Bug impact error:', err);
        } finally {
            setLoading(prev => ({ ...prev, bugImpact: false }));
        }
    }, [codebase.path, config, authFetch]);

    const updateConfig = useCallback((newConfig) => {
        setConfig(prev => ({
            ...prev,
            ...newConfig
        }));
    }, []);

    const clearVisualization = useCallback((type) => {
        setData(prev => ({ ...prev, [type]: null }));
        setError(prev => ({ ...prev, [type]: null }));
    }, []);

    // Auto-refresh dependency graph when codebase changes
    useEffect(() => {
        if (codebase.path) {
            fetchDependencyGraph();
        }
    }, [codebase.path, fetchDependencyGraph]);

    return (
        <VisualizationContext.Provider value={{
            data,
            loading,
            error,
            config,
            updateConfig,
            fetchDependencyGraph,
            fetchDataFlow,
            fetchBugImpact,
            clearVisualization
        }}>
            {children}
        </VisualizationContext.Provider>
    );
};

export const useVisualization = () => {
    const context = useContext(VisualizationContext);
    if (!context) {
        throw new Error('useVisualization must be used within a VisualizationProvider');
    }
    return context;
};