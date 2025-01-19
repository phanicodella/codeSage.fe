// Path: codeSage.fe/src/components/pages/CodeAnalysis.js

import React, { useState, useCallback } from 'react';
import { Upload, FileCode, Loader, MessageSquare } from 'lucide-react';
import Button from '../common/Button';
import { useCodebase } from '../../context/CodebaseContext';
import FileBrowser from '../codebase/FileBrowser';
import ChatInterface from '../chat/ChatInterface';

const CodeAnalysis = () => {
  const { loadCodebase } = useCodebase();
  const [analysisType, setAnalysisType] = useState('codebase');
  const [selectedPath, setSelectedPath] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const handlePathSelection = useCallback(async () => {
    try {
      // Use electron dialog if available
      if (window.electron?.openDirectory && analysisType === 'codebase') {
        const path = await window.electron.openDirectory();
        if (path) {
          setSelectedPath(path);
        }
      } else if (window.electron?.openFile && analysisType === 'file') {
        const path = await window.electron.openFile();
        if (path) {
          setSelectedPath(path);
        }
      } else {
        // Fallback to regular input for non-electron environment
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = analysisType === 'codebase';
        input.onchange = (e) => {
          const path = e.target.files[0]?.path;
          if (path) {
            setSelectedPath(path);
          }
        };
        input.click();
      }
    } catch (err) {
      setError('Failed to select path');
    }
  }, [analysisType]);

  const handleAnalysis = async () => {
    if (!selectedPath) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Load codebase into context first if it's a codebase analysis
      if (analysisType === 'codebase') {
        await loadCodebase(selectedPath);
      }

      const response = await fetch(`/api/analyze/${analysisType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header here
        },
        body: JSON.stringify({
          path: selectedPath,
          analysis_type: 'understand'
        })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex">
      <div className="flex-1 p-6 overflow-y-auto">
        {showChat ? (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Analysis Assistant</h1>
              <Button
                variant="outline"
                onClick={() => setShowChat(false)}
              >
                Back to Analysis
              </Button>
            </div>
            <div className="flex-1 bg-slate-800 rounded-lg">
              <ChatInterface context={{ analysisType, results }} />
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Code Analysis</h1>
              {results && (
                <Button
                  variant="secondary"
                  onClick={() => setShowChat(true)}
                >
                  <MessageSquare size={20} className="mr-2" />
                  Discuss Analysis
                </Button>
              )}
            </div>

            {/* Analysis Type Selection */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Analysis Type</h2>
              <div className="flex space-x-4">
                <Button
                  variant={analysisType === 'codebase' ? 'primary' : 'outline'}
                  onClick={() => setAnalysisType('codebase')}
                >
                  Codebase Analysis
                </Button>
                <Button
                  variant={analysisType === 'file' ? 'primary' : 'outline'}
                  onClick={() => setAnalysisType('file')}
                >
                  Single File Analysis
                </Button>
              </div>
            </div>

            {/* File/Directory Selection */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Select {analysisType === 'codebase' ? 'Directory' : 'File'}
              </h2>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handlePathSelection}
                  className="flex items-center"
                >
                  <Upload size={20} className="mr-2" />
                  Choose {analysisType === 'codebase' ? 'Directory' : 'File'}
                </Button>
                {selectedPath && (
                  <span className="text-gray-400 truncate">{selectedPath}</span>
                )}
              </div>
            </div>

            {/* Analysis Controls */}
            <div className="flex justify-end mb-8">
              <Button
                variant="primary"
                disabled={!selectedPath || isAnalyzing}
                isLoading={isAnalyzing}
                onClick={handleAnalysis}
              >
                {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
              </Button>
            </div>
            {/* Bug Impact Visualization */}
            {results && (
              <div className="bg-slate-800 rounded-lg p-6 mt-6">
                <h2 className="text-lg font-semibold mb-4">Impact Analysis</h2>
                <div className="h-[500px]">
                  <VisualizationView
                    type="bugImpact"
                    bugInfo={{
                      file: selectedPath,
                      line: results.lineNumber,
                      description: results.analysis
                    }}
                  />
                </div>
              </div>
            )}
            {/* Results */}
            {error && (
              <div className="bg-red-500/20 text-red-500 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {results && (
              <div className="bg-slate-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
                {/* Render results here */}
                <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            )}
          </>
        )}
      </div>

      {/* File Browser (when showing chat and results exist) */}
      {showChat && results && (
        <div className="w-80 border-l border-slate-700 bg-slate-800">
          <FileBrowser />
        </div>
      )}
    </div>
  );
};

export default CodeAnalysis;