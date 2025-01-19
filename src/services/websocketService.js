// Path: codeSage.fe/src/services/websocketService.js

const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8765';

class WebSocketService {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectTimeout = 1000; // Start with 1s timeout
        this.subscribers = new Map();
        this.connected = false;
        this.connecting = false;
    }

    connect(codebasePath) {
        if (this.connecting || this.connected) return;
        this.connecting = true;

        try {
            this.ws = new WebSocket(WS_BASE_URL);

            this.ws.onopen = () => {
                this.connected = true;
                this.connecting = false;
                this.reconnectAttempts = 0;
                this.reconnectTimeout = 1000;

                // Send initial codebase path
                this.send({
                    type: 'init',
                    codebasePath
                });

                console.log('WebSocket Connected');
            };

            this.ws.onclose = () => {
                this.connected = false;
                this.handleReconnect(codebasePath);
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.handleReconnect(codebasePath);
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    const subscribers = this.subscribers.get(data.type) || [];
                    subscribers.forEach(callback => callback(data.payload));
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            };

        } catch (error) {
            console.error('WebSocket connection error:', error);
            this.connecting = false;
            this.handleReconnect(codebasePath);
        }
    }

    handleReconnect(codebasePath) {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;
        this.reconnectTimeout *= 2; // Exponential backoff

        setTimeout(() => {
            console.log(`Attempting to reconnect... (${this.reconnectAttempts})`);
            this.connect(codebasePath);
        }, this.reconnectTimeout);
    }

    subscribe(type, callback) {
        if (!this.subscribers.has(type)) {
            this.subscribers.set(type, []);
        }
        this.subscribers.get(type).push(callback);

        // Return unsubscribe function
        return () => {
            const callbacks = this.subscribers.get(type) || [];
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }

    send(message) {
        if (this.connected && this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket not connected. Message not sent:', message);
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
            this.connected = false;
            this.connecting = false;
            this.subscribers.clear();
        }
    }

    // Visualization specific methods
    requestDependencyUpdate(config = {}) {
        this.send({
            type: 'dependency_update',
            payload: { config }
        });
    }

    requestDataFlowUpdate(componentId, config = {}) {
        this.send({
            type: 'dataflow_update',
            payload: { componentId, config }
        });
    }

    requestBugImpactUpdate(bugInfo, config = {}) {
        this.send({
            type: 'bug_impact_update',
            payload: { bugInfo, config }
        });
    }

    // Health check method
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            if (this.connected) {
                this.send({ type: 'ping' });
            }
        }, 30000); // 30 seconds
    }

    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
    }
}

// Create singleton instance
const wsService = new WebSocketService();
export default wsService;