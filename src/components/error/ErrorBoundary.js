// Path: codeSage.fe/src/components/error/ErrorBoundary.js

import React from 'react';
import {
    AlertTriangle,
    RefreshCw,
    Home
} from 'lucide-react';
import Button from '../common/Button';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        // You can log the error to your error reporting service here
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleRefresh = () => {
        window.location.reload();
    }

    handleGoHome = () => {
        window.location.href = '/';
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                    <div className="bg-slate-800 rounded-lg p-8 max-w-2xl w-full">
                        <div className="flex items-center justify-center mb-6">
                            <AlertTriangle size={48} className="text-red-500" />
                        </div>

                        <h1 className="text-2xl font-bold text-center mb-4">
                            Something went wrong
                        </h1>

                        <div className="bg-slate-700 rounded p-4 mb-6 font-mono text-sm overflow-auto">
                            <p className="text-red-400">
                                {this.state.error && this.state.error.toString()}
                            </p>
                            {this.state.errorInfo && (
                                <pre className="mt-2 text-slate-300">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            )}
                        </div>

                        <div className="flex justify-center space-x-4">
                            <Button
                                variant="secondary"
                                onClick={this.handleRefresh}
                                className="flex items-center"
                            >
                                <RefreshCw size={20} className="mr-2" />
                                Try Again
                            </Button>
                            <Button
                                variant="primary"
                                onClick={this.handleGoHome}
                                className="flex items-center"
                            >
                                <Home size={20} className="mr-2" />
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;