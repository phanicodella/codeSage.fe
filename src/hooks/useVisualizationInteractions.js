// Path: codeSage.fe/src/hooks/useVisualizationInteractions.js

import { useState, useCallback, useRef } from 'react';
import { useVisualization } from '../context/VisualizationContext';

export const useVisualizationInteractions = (type) => {
    const {
        data,
        loading,
        error,
        config,
        updateConfig
    } = useVisualization();

    const [selectedNode, setSelectedNode] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [rotation, setRotation] = useState(0);
    const interactionTimeout = useRef(null);

    const handleNodeClick = useCallback((node) => {
        setSelectedNode(node);
    }, []);

    const handleZoom = useCallback((delta) => {
        setZoomLevel(prev => {
            const newZoom = prev + delta;
            return Math.min(Math.max(0.1, newZoom), 3);
        });
    }, []);

    const handleRotate = useCallback((degrees) => {
        setRotation(prev => (prev + degrees) % 360);
    }, []);

    const handleConfigUpdate = useCallback((changes) => {
        // Debounce config updates
        if (interactionTimeout.current) {
            clearTimeout(interactionTimeout.current);
        }

        interactionTimeout.current = setTimeout(() => {
            updateConfig({
                ...config,
                ...changes
            });
        }, 300);
    }, [config, updateConfig]);

    const resetView = useCallback(() => {
        setZoomLevel(1);
        setRotation(0);
        setSelectedNode(null);
    }, []);

    return {
        selectedNode,
        zoomLevel,
        rotation,
        handleNodeClick,
        handleZoom,
        handleRotate,
        handleConfigUpdate,
        resetView,
        visualizationData: data[type],
        isLoading: loading[type],
        error: error[type]
    };
};