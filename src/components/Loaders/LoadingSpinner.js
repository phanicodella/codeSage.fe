// Path: codeSage.fe/src/components/loaders/LoadingSpinner.js

import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = ({
    size = 'md',
    text = 'Loading...',
    fullScreen = false
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="text-center">
                    <Loader className={`${sizeClasses[size]} animate-spin mx-auto text-primary-500`} />
                    {text && (
                        <p className="mt-4 text-slate-200 font-medium">{text}</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-4">
            <Loader className={`${sizeClasses[size]} animate-spin text-primary-500`} />
            {text && (
                <span className="ml-3 text-slate-200 font-medium">{text}</span>
            )}
        </div>
    );
};

export default LoadingSpinner;