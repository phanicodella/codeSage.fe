// Path: codeSage.fe/src/components/visualizations/BugImpactVisualization.js

import React, { useEffect, useState, useRef } from 'react';
import Plot from 'react-plotly.js';
import { Loader, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BugImpactVisualization = ({ impactData, loading, error, onComponentSelect }) => {
    const [selectedNode, setSelectedNode] = useState(null);
    const graphRef = useRef(null);

    const handleNodeClick = (event) => {
        const node = event.points[0];
        setSelectedNode(node);
        onComponentSelect?.(node);
    };

    const defaultLayout = {
        autosize: true,
        showlegend: false,
        hovermode: 'closest',
        margin: { b: 20, l: 5, r: 5, t: 40 },
        xaxis: { showgrid: false, zeroline: false, showticklabels: false },
        yaxis: { showgrid: false, zeroline: false, showticklabels: false },
        plot_bgcolor: '#1a1a1a',
        paper_bgcolor: '#1a1a1a',
        font: { color: '#ffffff' },
        annotations: [{
            text: "Bug Impact Analysis",
            showarrow: false,
            xref: "paper",
            yref: "paper",
            x: 0.005,
            y: -0.002,
            font: { size: 16, color: '#ffffff' }
        }]
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader className="animate-spin" size={24} />
                <span className="ml-2">Analyzing bug impact...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                <AlertCircle size={24} className="mr-2" />
                <span>Error analyzing bug impact: {error}</span>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full" data-testid="bug-impact-visualization">
            <Plot
                ref={graphRef}
                data={impactData}
                layout={defaultLayout}
                config={{
                    displayModeBar: false,
                    responsive: true
                }}
                onClick={handleNodeClick}
                className="w-full h-full"
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
            />

            {/* Node details popup */}
            <AnimatePresence>
                {selectedNode && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-4 right-4 bg-slate-800 p-4 rounded-lg shadow-lg"
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="font-medium">{selectedNode.text}</h3>
                            <button
                                onClick={() => setSelectedNode(null)}
                                className="text-gray-400 hover:text-white"
                            >
                                ×
                            </button>
                        </div>
                        <div className="mt-2 text-sm text-gray-300">
                            <p>Impact Level: {selectedNode.data.impact_level}</p>
                            <p>Risk Score: {selectedNode.data.risk_score}</p>
                            {selectedNode.data.affected_files && (
                                <p>Affected Files: {selectedNode.data.affected_files.length}</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BugImpactVisualization;