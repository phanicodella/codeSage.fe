// Path: codeSage.fe/src/hooks/useSettings.js

import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '../services/api';

export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSettings = useCallback(async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (newSettings) => {
    try {
      const updated = await settingsService.updateSettings(newSettings);
      setSettings(updated);
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to update settings');
      throw err;
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    reloadSettings: loadSettings
  };
};