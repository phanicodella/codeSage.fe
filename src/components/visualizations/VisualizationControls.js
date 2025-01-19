// Path: codeSage.fe/src/components/visualizations/VisualizationControls.js

import React from 'react';
import {
    ZoomIn,
    ZoomOut,
    RotateCw,
    Download,
    Filter,
    Layout
} from 'lucide-react';
import Button from '../common/Button';

const VisualizationControls = ({
    onZoomIn,
    onZoomOut,
    onRotate,
    onExport,
    onFilter,
    onLayoutChange,
    disabled
}) => {
    return (
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
            <Button
                variant="secondary"
                size="sm"
                onClick={onZoomIn}
                disabled={disabled}
                title="Zoom In"
            >
                <ZoomIn size={16} />
            </Button>
            <Button
                variant="secondary"
                size="sm"
                onClick={onZoomOut}
                disabled={disabled}
                title="Zoom Out"
            >
                <ZoomOut size={16} />
            </Button>
            <Button
                variant="secondary"
                size="sm"
                onClick={onRotate}
                disabled={disabled}
                title="Rotate"
            >
                <RotateCw size={16} />
            </Button>
            <Button
                variant="secondary"
                size="sm"
                onClick={onFilter}
                disabled={disabled}
                title="Filter"
            >
                <Filter size={16} />
            </Button>
            <Button
                variant="secondary"
                size="sm"
                onClick={onLayoutChange}
                disabled={disabled}
                title="Change Layout"
            >
                <Layout size={16} />
            </Button>
            <Button
                variant="secondary"
                size="sm"
                onClick={onExport}
                disabled={disabled}
                title="Export"
            >
                <Download size={16} />
            </Button>
        </div>
    );
};

export default VisualizationControls;