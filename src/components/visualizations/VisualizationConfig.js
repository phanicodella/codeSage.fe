// Path: codeSage.fe/src/components/visualizations/VisualizationConfig.js

import React from 'react';
import { useVisualization } from '../../context/VisualizationContext';
import Button from '../common/Button';

const VisualizationConfig = () => {
    const { config, updateConfig } = useVisualization();

    const layouts = [
        { value: 'force', label: 'Force-Directed' },
        { value: 'circular', label: 'Circular' },
        { value: 'hierarchical', label: 'Hierarchical' }
    ];

    const themes = [
        { value: 'dark', label: 'Dark' },
        { value: 'light', label: 'Light' }
    ];

    return (
        <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Visualization Settings</h3>

            <div className="space-y-4">
                {/* Theme Selection */}
                <div>
                    <label className="block text-sm font-medium mb-2">Theme</label>
                    <select
                        value={config.theme}
                        onChange={(e) => updateConfig({ theme: e.target.value })}
                        className="w-full bg-slate-700 rounded-lg px-3 py-2"
                    >
                        {themes.map(theme => (
                            <option key={theme.value} value={theme.value}>
                                {theme.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Layout Selection */}
                <div>
                    <label className="block text-sm font-medium mb-2">Layout</label>
                    <select
                        value={config.layout}
                        onChange={(e) => updateConfig({ layout: e.target.value })}
                        className="w-full bg-slate-700 rounded-lg px-3 py-2"
                    >
                        {layouts.map(layout => (
                            <option key={layout.value} value={layout.value}>
                                {layout.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Node Size */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Node Size: {config.nodeSize}
                    </label>
                    <input
                        type="range"
                        min="10"
                        max="50"
                        value={config.nodeSize}
                        onChange={(e) => updateConfig({ nodeSize: parseInt(e.target.value) })}
                        className="w-full"
                    />
                </div>

                {/* Show Labels Toggle */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={config.showLabels}
                        onChange={(e) => updateConfig({ showLabels: e.target.checked })}
                        className="mr-2"
                    />
                    <label className="text-sm">Show Labels</label>
                </div>
            </div>
        </div>
    );
};

export default VisualizationConfig;