// Path: codeSage.fe/src/hooks/useVisualizationUpdates.js

import { useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { useVisualization } from '../context/VisualizationContext';

export const useVisualizationUpdates = (type) => {
    const { sendMessage } = useWebSocket();
    const {
        updateVisualizationData,
        setError,
        config
    } = useVisualization();

    const requestUpdate = useCallback(() => {
        sendMessage(`${type}_update`, { config });
    }, [type, config, sendMessage]);

    useEffect(() => {
        const updateInterval = setInterval(requestUpdate, 1000);
        return () => clearInterval(updateInterval);
    }, [requestUpdate]);

    return { requestUpdate };
};