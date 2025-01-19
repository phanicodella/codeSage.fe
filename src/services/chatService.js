// Path: codeSage.fe/src/services/chatService.js

class ChatService {
    constructor() {
        this.messageHistory = [];
    }

    async processMessage(message, codebasePath = null) {
        try {
            // TODO: Implement actual backend API call
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    codebasePath,
                    messageHistory: this.messageHistory
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            // Add to message history
            this.messageHistory.push({
                role: 'user',
                content: message
            });
            this.messageHistory.push({
                role: 'assistant',
                content: data.response
            });

            // Keep history limited to last 10 messages
            if (this.messageHistory.length > 20) {
                this.messageHistory = this.messageHistory.slice(-20);
            }

            return data.response;
        } catch (error) {
            console.error('Chat processing error:', error);
            throw error;
        }
    }

    clearHistory() {
        this.messageHistory = [];
    }

    async analyzeCode(code, context = {}) {
        try {
            const response = await fetch('/api/analyze/snippet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code,
                    context
                }),
            });

            if (!response.ok) {
                throw new Error('Code analysis failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Code analysis error:', error);
            throw error;
        }
    }

    async suggestFix(bugDescription, relevantCode, context = {}) {
        try {
            const response = await fetch('/api/suggest/fix', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bugDescription,
                    relevantCode,
                    context
                }),
            });

            if (!response.ok) {
                throw new Error('Fix suggestion failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Fix suggestion error:', error);
            throw error;
        }
    }
}

export const chatService = new ChatService();