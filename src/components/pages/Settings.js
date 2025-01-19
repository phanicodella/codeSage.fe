// Path: codeSage.fe/src/components/pages/Settings.js

import React, { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import Button from '../common/Button';

const Settings = () => {
  const [settings, setSettings] = useState({
    maxFileSize: 10,
    fileTypes: ['.py', '.js', '.java', '.cpp', '.h'],
    modelName: 'Salesforce/codet5-base',
    cacheEnabled: true,
    cacheDuration: 7,
    theme: 'dark'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save settings logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      // TODO: Implement actual settings saving
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button
          variant="primary"
          onClick={handleSave}
          isLoading={isSaving}
        >
          <Save size={20} className="mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <section className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Maximum File Size (MB)
              </label>
              <input
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => setSettings({
                  ...settings,
                  maxFileSize: parseInt(e.target.value)
                })}
                className="bg-slate-700 rounded-lg px-4 py-2 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Supported File Types
              </label>
              <input
                type="text"
                value={settings.fileTypes.join(', ')}
                onChange={(e) => setSettings({
                  ...settings,
                  fileTypes: e.target.value.split(',').map(t => t.trim())
                })}
                className="bg-slate-700 rounded-lg px-4 py-2 w-full"
              />
            </div>
          </div>
        </section>

        {/* Model Settings */}
        <section className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Model Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Model Name
              </label>
              <input
                type="text"
                value={settings.modelName}
                onChange={(e) => setSettings({
                  ...settings,
                  modelName: e.target.value
                })}
                className="bg-slate-700 rounded-lg px-4 py-2 w-full"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.cacheEnabled}
                onChange={(e) => setSettings({
                  ...settings,
                  cacheEnabled: e.target.checked
                })}
                className="mr-2"
              />
              <label className="text-sm font-medium">
                Enable Model Cache
              </label>
            </div>

            {settings.cacheEnabled && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Cache Duration (days)
                </label>
                <input
                  type="number"
                  value={settings.cacheDuration}
                  onChange={(e) => setSettings({
                    ...settings,
                    cacheDuration: parseInt(e.target.value)
                  })}
                  className="bg-slate-700 rounded-lg px-4 py-2 w-full"
                />
              </div>
            )}
          </div>
        </section>

        {/* Appearance Settings */}
        <section className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({
                ...settings,
                theme: e.target.value
              })}
              className="bg-slate-700 rounded-lg px-4 py-2 w-full"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </section>

        {/* License Information */}
        <section className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">License Information</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">License Status: Active</p>
              <p className="text-sm text-gray-400">Expires: December 31, 2024</p>
            </div>
            <Button variant="outline">
              <RefreshCw size={20} className="mr-2" />
              Refresh License
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;