// Path: codeSage.fe/src/components/visualizations/DependencyGraph.js

import React, { useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import { Loader } from 'lucide-react';
import { useCodebase } from '../../context/CodebaseContext';

const DependencyGraph = ({ data, loading, error, config = {} }) => {
    const graphRef = useRef(null);
    const { theme = 'dark' } = config;

    // Default layout options
    const defaultLayout = {
        autosize: true,
        showlegend: false,
        hovermode: 'closest',
        margin: { b: 20, l: 5, r: 5, t: 40 },
        xaxis: { showgrid: false, zeroline: false, showticklabels: false },
        yaxis: { showgrid: false, zeroline: false, showticklabels: false },
        plot_bgcolor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        paper_bgcolor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        font: {
            color: theme === 'dark' ? '#ffffff' : '#1a202c'
        }
    };

    useEffect(() => {
        // Handle window resize
        const handleResize = () => {
            if (graphRef.current) {
                graphRef.current.resizeHandler();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                Error loading dependency graph: {error}
            </div>
        );
    }

    return (
        <div className="h-full w-full" data-testid="dependency-graph">
            <Plot
                ref={graphRef}
                data={data}
                layout={{
                    ...defaultLayout,
                    height: '100%',
                    width: '100%'
                }}
                config={{
                    displayModeBar: false,
                    responsive: true
                }}
                className="w-full h-full"
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default DependencyGraph;