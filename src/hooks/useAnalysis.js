// Path: codeSage.fe/src/hooks/useAnalysis.js

import { useState, useCallback } from 'react';
import { analysisService } from '../services/api';

export const useAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const analyzeCodebase = useCallback(async (path, fileTypes, analysisType) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analysisService.analyzeCodebase(path, fileTypes, analysisType);
      setResults(data);
      return data;
    } catch (err) {
      setError(err.message || 'Analysis failed');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const analyzeFile = useCallback(async (filePath, analysisType) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analysisService.analyzeFile(filePath, analysisType);
      setResults(data);
      return data;
    } catch (err) {
      setError(err.message || 'Analysis failed');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const analyzeSnippet = useCallback(async (code, language, analysisType) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analysisService.analyzeSnippet(code, language, analysisType);
      setResults(data);
      return data;
    } catch (err) {
      setError(err.message || 'Analysis failed');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    isAnalyzing,
    error,
    results,
    analyzeCodebase,
    analyzeFile,
    analyzeSnippet,
    clearResults: () => setResults(null),
    clearError: () => setError(null)
  };
};