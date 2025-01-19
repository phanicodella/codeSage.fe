// Path: codeSage.fe/src/hooks/useWebSocket.js

import { useEffect, useRef, useCallback } from 'react';
import { useCodebase } from '../context/CodebaseContext';

export const useWebSocket = () => {
    const ws = useRef(null);
    const { codebase } = useCodebase();

    const connect = useCallback(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/api/visualize/ws`;

        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log('WebSocket Connected');
            // Send initial codebase path
            if (codebase.path) {
                ws.current.send(JSON.stringify({ codebasePath: codebase.path }));
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket Disconnected');
            // Attempt to reconnect
            setTimeout(connect, 5000);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [codebase.path]);

    const sendMessage = useCallback((type, payload) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                type,
                payload,
                codebasePath: codebase.path
            }));
        }
    }, [codebase.path]);

    useEffect(() => {
        const cleanup = connect();
        return cleanup;
    }, [connect]);

    return { sendMessage };
};