// Path: codeSage.fe/src/services/chatService.js

class ChatService {
    constructor() {
        this.API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        this.messageHistory = [];
        this.maxHistoryLength = 50;
        this.isProcessing = false;
        this.subscriptions = new Set();
        this.pendingMessage = null;
    }

    async processMessage(message, context = {}) {
        if (this.isProcessing) {
            this.pendingMessage = { message, context };
            return;
        }

        this.isProcessing = true;

        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${this.API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    context,
                    history: this.messageHistory.slice(-10) // Send last 10 messages for context
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to process message');
            }

            const data = await response.json();

            // Add messages to history
            this.addToHistory('user', message);
            this.addToHistory('assistant', data.response);

            // Notify subscribers
            this.notifySubscribers({
                type: 'message',
                content: data.response,
                role: 'assistant'
            });

            return data.response;

        } catch (error) {
            console.error('Chat processing error:', error);
            this.notifySubscribers({
                type: 'error',
                content: error.message
            });
            throw error;
        } finally {
            this.isProcessing = false;

            // Process any pending message
            if (this.pendingMessage) {
                const { message, context } = this.pendingMessage;
                this.pendingMessage = null;
                await this.processMessage(message, context);
            }
        }
    }

    addToHistory(role, content) {
        this.messageHistory.push({ role, content });

        // Maintain history limit
        if (this.messageHistory.length > this.maxHistoryLength) {
            this.messageHistory = this.messageHistory.slice(-this.maxHistoryLength);
        }
    }

    subscribe(callback) {
        this.subscriptions.add(callback);
        return () => this.subscriptions.delete(callback);
    }

    notifySubscribers(message) {
        this.subscriptions.forEach(callback => {
            try {
                callback(message);
            } catch (error) {
                console.error('Error in subscriber callback:', error);
            }
        });
    }

    async requestCodeAnalysis(code, context = {}) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${this.API_BASE_URL}/api/analyze/code`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code, context })
            });

            if (!response.ok) throw new Error('Code analysis failed');
            return await response.json();
        } catch (error) {
            console.error('Code analysis error:', error);
            throw error;
        }
    }

    async requestBugFix(code, bugDescription, context = {}) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${this.API_BASE_URL}/api/fix/suggest`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code,
                    bug_description: bugDescription,
                    context
                })
            });

            if (!response.ok) throw new Error('Bug fix suggestion failed');
            return await response.json();
        } catch (error) {
            console.error('Bug fix suggestion error:', error);
            throw error;
        }
    }

    clearHistory() {
        this.messageHistory = [];
        this.notifySubscribers({
            type: 'clear'
        });
    }

    getHistory() {
        return [...this.messageHistory];
    }
}

// Create singleton instance
const chatService = new ChatService();
export default chatService;