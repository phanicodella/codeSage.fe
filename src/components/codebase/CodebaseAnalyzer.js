// Path: codeSage.fe/src/components/codebase/CodebaseAnalyzer.js

import React, { useState } from 'react';
import { FolderOpen, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { useCodebase } from '../../context/CodebaseContext';
import Button from '../common/Button';

const AnalysisStep = ({ status, title, description }) => {
    const getIcon = () => {
        switch (status) {
            case 'complete':
                return <CheckCircle className="text-green-500" size={24} />;
            case 'error':
                return <AlertCircle className="text-red-500" size={24} />;
            case 'loading':
                return <Loader className="animate-spin text-blue-500" size={24} />;
            default:
                return <div className="w-6 h-6 rounded-full border-2 border-slate-600" />;
        }
    };

    return (
        <div className="flex items-start space-x-4">
            {getIcon()}
            <div>
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-slate-400">{description}</p>
            </div>
        </div>
    );
};

const CodebaseAnalyzer = () => {
    const { loadCodebase, isAnalyzing } = useCodebase();
    const [steps, setSteps] = useState([
        {
            id: 'load',
            title: 'Load Codebase',
            description: 'Reading and indexing files',
            status: 'pending'
        },
        {
            id: 'analyze',
            title: 'Analyze Structure',
            description: 'Understanding code relationships and dependencies',
            status: 'pending'
        },
        {
            id: 'prepare',
            title: 'Prepare Knowledge Base',
            description: 'Building context for intelligent responses',
            status: 'pending'
        }
    ]);

    const handleSelectCodebase = async () => {
        try {
            // Show file selection dialog
            // TODO: Replace with actual electron dialog
            const path = '/path/to/codebase'; // This will come from dialog

            // Update steps as analysis progresses
            setSteps(steps => steps.map(step =>
                step.id === 'load' ? { ...step, status: 'loading' } : step
            ));

            // Start analysis
            await loadCodebase(path);

            // Update steps to complete
            setSteps(steps => steps.map(step => ({ ...step, status: 'complete' })));

        } catch (error) {
            console.error('Analysis failed:', error);
            // Update steps to show error
            setSteps(steps => steps.map(step =>
                step.status === 'loading' ? { ...step, status: 'error' } : step
            ));
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Load Your Codebase</h2>
                <p className="text-slate-400">
                    Let CodeSage analyze your codebase to provide intelligent assistance
                </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 mb-8">
                <Button
                    onClick={handleSelectCodebase}
                    disabled={isAnalyzing}
                    className="w-full mb-6"
                >
                    <FolderOpen className="mr-2" size={20} />
                    Select Codebase Directory
                </Button>

                <div className="space-y-6">
                    {steps.map(step => (
                        <AnalysisStep key={step.id} {...step} />
                    ))}
                </div>
            </div>

            {isAnalyzing && (
                <div className="text-center text-sm text-slate-400">
                    This might take a few minutes depending on the size of your codebase
                </div>
            )}
        </div>
    );
};

export default CodebaseAnalyzer;