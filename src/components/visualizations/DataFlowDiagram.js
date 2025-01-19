// Path: codeSage.fe/src/components/visualizations/DataFlowDiagram.js

import React, { useEffect, useRef, useState } from 'react';
import Plot from 'react-plotly.js';
import { Loader, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import Button from '../common/Button';

const DataFlowDiagram = ({ data, loading, error, onNodeClick, config = {} }) => {
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const graphRef = useRef(null);
    const { theme = 'dark' } = config;

    const defaultLayout = {
        autosize: true,
        showlegend: true,
        hovermode: 'closest',
        dragmode: 'pan',
        legend: {
            x: 1,
            y: 0.5,
            font: { color: theme === 'dark' ? '#ffffff' : '#1a202c' }
        },
        margin: { b: 20, l: 5, r: 5, t: 40 },
        xaxis: { showgrid: false, zeroline: false, showticklabels: false },
        yaxis: { showgrid: false, zeroline: false, showticklabels: false },
        plot_bgcolor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        paper_bgcolor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        font: {
            color: theme === 'dark' ? '#ffffff' : '#1a202c'
        }
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev * 1.2, 3));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev * 0.8, 0.5));
    };

    const handleRotate = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    useEffect(() => {
        if (graphRef.current && data) {
            const layout = {
                ...defaultLayout,
                height: '100%',
                width: '100%',
                transform: `scale(${zoom}) rotate(${rotation}deg)`
            };
            graphRef.current.layout = layout;
            graphRef.current.redraw();
        }
    }, [zoom, rotation, data]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader className="animate-spin" size={24} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                Error loading data flow diagram: {error}
            </div>
        );
    }

    return (
        <div className="relative h-full w-full" data-testid="data-flow-diagram">
            {/* Controls */}
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleZoomIn}
                    title="Zoom In"
                >
                    <ZoomIn size={16} />
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleZoomOut}
                    title="Zoom Out"
                >
                    <ZoomOut size={16} />
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRotate}
                    title="Rotate"
                >
                    <RotateCw size={16} />
                </Button>
            </div>

            {/* Graph */}
            <Plot
                ref={graphRef}
                data={data}
                layout={defaultLayout}
                config={{
                    displayModeBar: false,
                    responsive: true,
                    scrollZoom: true
                }}
                onClick={(e) => onNodeClick?.(e.points[0])}
                className="w-full h-full"
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default DataFlowDiagram;