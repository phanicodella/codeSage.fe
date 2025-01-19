// Path: codeSage.fe/src/components/visualizations/VisualizationView.js

import React, { useState, useEffect } from 'react';
import { useCodebase } from '../../context/CodebaseContext';
import { useVisualization } from '../../context/VisualizationContext';
import DependencyGraph from './DependencyGraph';
import DataFlowDiagram from './DataFlowDiagram';
import BugImpactVisualization from './BugImpactVisualization';
import VisualizationConfig from './VisualizationConfig';
import { Split, Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';
import Button from '../common/Button';

const VisualizationView = ({ type = 'dependency', bugInfo = null }) => {
    const { codebase } = useCodebase();
    const {
        data,
        loading,
        error,
        config,
        fetchDependencyGraph,
        fetchDataFlow,
        fetchBugImpact
    } = useVisualization();

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        if (codebase.path) {
            switch (type) {
                case 'dependency':
                    fetchDependencyGraph();
                    break;
                case 'dataflow':
                    fetchDataFlow();
                    break;
                case 'bugImpact':
                    if (bugInfo) {
                        fetchBugImpact(bugInfo);
                    }
                    break;
                default:
                    break;
            }
        }
    }, [codebase.path, type, bugInfo]);

    const handleZoom = (delta) => {
        setZoom(prev => Math.max(0.1, Math.min(3, prev + delta)));
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const getVisualizationComponent = () => {
        switch (type) {
            case 'dependency':
                return (
                    <DependencyGraph
                        data={data.dependency}
                        loading={loading.dependency}
                        error={error.dependency}
                        config={config}
                        zoom={zoom}
                    />
                );
            case 'dataflow':
                return (
                    <DataFlowDiagram
                        data={data.dataFlow}
                        loading={loading.dataFlow}
                        error={error.dataFlow}
                        config={config}
                        zoom={zoom}
                    />
                );
            case 'bugImpact':
                return (
                    <BugImpactVisualization
                        impactData={data.bugImpact}
                        loading={loading.bugImpact}
                        error={error.bugImpact}
                        config={config}
                        zoom={zoom}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className={`
            visualization-container relative
            ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900' : 'h-full w-full'}
        `}>
            {/* Controls */}
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleZoom(0.1)}
                    title="Zoom In"
                >
                    <ZoomIn size={16} />
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleZoom(-0.1)}
                    title="Zoom Out"
                >
                    <ZoomOut size={16} />
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowConfig(!showConfig)}
                    title="Show Configuration"
                >
                    <Split size={16} />
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={toggleFullscreen}
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex h-full">
                <div className={`flex-1 ${showConfig ? 'pr-64' : ''}`}>
                    {getVisualizationComponent()}
                </div>

                {/* Configuration Panel */}
                {showConfig && (
                    <div className="fixed right-0 top-0 h-full w-64 bg-slate-800 p-4 shadow-lg">
                        <VisualizationConfig />
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error[type] && (
                <div className="absolute bottom-4 right-4 bg-red-500/20 text-red-500 p-4 rounded-lg">
                    {error[type]}
                </div>
            )}
        </div>
    );
};

export default VisualizationView;