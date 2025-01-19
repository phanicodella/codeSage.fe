// Path: codeSage.fe/src/components/chat/ChatInterface.js

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, FileCode } from 'lucide-react';
import Button from '../common/Button';
import { useCodebase } from '../../context/CodebaseContext';
import { chatService } from '../../services/chatService';

const Message = ({ message }) => (
    <div
        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
        <div
            className={`max-w-3xl rounded-lg p-4 ${message.type === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-gray-100'
                }`}
        >
            {message.content.type === 'code' ? (
                <div className="font-mono">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">{message.content.language}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {/* Copy code */ }}
                            className="text-xs"
                        >
                            Copy
                        </Button>
                    </div>
                    <pre className="bg-slate-900 p-3 rounded overflow-x-auto">
                        <code>{message.content.code}</code>
                    </pre>
                </div>
            ) : (
                <div className="whitespace-pre-wrap">{message.content}</div>
            )}
        </div>
    </div>
);

const ChatInterface = ({ context = {} }) => {
    const { codebase } = useCodebase();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle textarea height
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    };

    const handleSubmit = async () => {
        if (!inputValue.trim() || isProcessing) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputValue
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsProcessing(true);
        textareaRef.current.style.height = 'auto';

        try {
            const response = await chatService.processMessage(inputValue, {
                codebasePath: codebase.path,
                context: context,
                messageHistory: messages
            });

            const assistantMessage = {
                id: Date.now() + 1,
                type: 'assistant',
                content: response.content || response
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    type: 'assistant',
                    content: 'Sorry, I encountered an error processing your request.'
                }
            ]);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 my-8">
                        <FileCode size={40} className="mx-auto mb-4" />
                        <p>
                            I'm your AI coding assistant. Ask me anything about your code,
                            request explanations, or get help with bugs!
                        </p>
                    </div>
                )}

                {messages.map((message) => (
                    <Message key={message.id} message={message} />
                ))}

                {isProcessing && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-slate-800 rounded-lg p-4">
                            <Loader className="animate-spin" size={20} />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-700 p-4 bg-slate-800">
                <div className="flex space-x-4">
                    <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            adjustTextareaHeight();
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question or describe a task..."
                        className="flex-1 bg-slate-700 rounded-lg p-3 min-h-[44px] max-h-[200px] resize-none 
                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        disabled={isProcessing}
                    />
                    <Button
                        onClick={handleSubmit}
                        disabled={!inputValue.trim() || isProcessing}
                        className="self-end"
                    >
                        <Send size={20} />
                    </Button>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                    Press Enter to send, Shift + Enter for new line
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;