// Path: codeSage.fe/src/context/VisualizationContext.js

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useCodebase } from './CodebaseContext';

const VisualizationContext = createContext(null);

export const VisualizationProvider = ({ children }) => {
    const { codebase } = useCodebase();
    const [visualizationConfig, setVisualizationConfig] = useState({
        theme: 'dark',
        layout: 'force',
        showLabels: true,
        nodeSize: 20,
        edgeWidth: 1.0,
        fontSize: 12
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

    const [data, setData] = useState({
        dependency: null,
        dataFlow: null,
        bugImpact: null
    });

    const fetchDependencyGraph = useCallback(async () => {
        if (!codebase.path) return;

        setLoading(prev => ({ ...prev, dependency: true }));
        setError(prev => ({ ...prev, dependency: null }));

        try {
            const response = await fetch('/api/visualize/dependencies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    codebasePath: codebase.path,
                    config: visualizationConfig
                })
            });

            if (!response.ok) throw new Error('Failed to fetch dependency graph');

            const graphData = await response.json();
            setData(prev => ({ ...prev, dependency: graphData }));
        } catch (err) {
            setError(prev => ({ ...prev, dependency: err.message }));
        } finally {
            setLoading(prev => ({ ...prev, dependency: false }));
        }
    }, [codebase.path, visualizationConfig]);

    const fetchDataFlow = useCallback(async (componentId) => {
        setLoading(prev => ({ ...prev, dataFlow: true }));
        setError(prev => ({ ...prev, dataFlow: null }));

        try {
            const response = await fetch('/api/visualize/dataflow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    codebasePath: codebase.path,
                    componentId,
                    config: visualizationConfig
                })
            });

            if (!response.ok) throw new Error('Failed to fetch data flow');

            const flowData = await response.json();
            setData(prev => ({ ...prev, dataFlow: flowData }));
        } catch (err) {
            setError(prev => ({ ...prev, dataFlow: err.message }));
        } finally {
            setLoading(prev => ({ ...prev, dataFlow: false }));
        }
    }, [codebase.path, visualizationConfig]);

    const fetchBugImpact = useCallback(async (bugInfo) => {
        setLoading(prev => ({ ...prev, bugImpact: true }));
        setError(prev => ({ ...prev, bugImpact: null }));

        try {
            const response = await fetch('/api/visualize/bug-impact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    codebasePath: codebase.path,
                    bugInfo,
                    config: visualizationConfig
                })
            });

            if (!response.ok) throw new Error('Failed to fetch bug impact');

            const impactData = await response.json();
            setData(prev => ({ ...prev, bugImpact: impactData }));
        } catch (err) {
            setError(prev => ({ ...prev, bugImpact: err.message }));
        } finally {
            setLoading(prev => ({ ...prev, bugImpact: false }));
        }
    }, [codebase.path, visualizationConfig]);

    const updateConfig = useCallback((newConfig) => {
        setVisualizationConfig(prev => ({
            ...prev,
            ...newConfig
        }));
    }, []);

    const clearVisualization = useCallback((type) => {
        setData(prev => ({ ...prev, [type]: null }));
        setError(prev => ({ ...prev, [type]: null }));
    }, []);

    return (
        <VisualizationContext.Provider value={{
            config: visualizationConfig,
            loading,
            error,
            data,
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