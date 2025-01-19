// Path: codeSage.fe/src/components/loaders/SkeletonLoader.js

import React from 'react';

const SkeletonLoader = ({
    width = 'w-full',
    height = 'h-4',
    className = '',
    count = 1
}) => {
    const items = Array(count).fill(0);

    return (
        <div className="animate-pulse">
            {items.map((_, index) => (
                <div
                    key={index}
                    className={`bg-slate-700 rounded ${width} ${height} ${className} ${index !== count - 1 ? 'mb-2' : ''
                        }`}
                />
            ))}
        </div>
    );
};

export const CodeBlockSkeleton = () => (
    <div className="animate-pulse space-y-3">
        <div className="h-6 bg-slate-700 rounded w-3/12" />
        <div className="space-y-2">
            <div className="h-4 bg-slate-700 rounded" />
            <div className="h-4 bg-slate-700 rounded w-5/6" />
            <div className="h-4 bg-slate-700 rounded w-4/6" />
        </div>
    </div>
);

export const FileTreeSkeleton = () => (
    <div className="animate-pulse space-y-4 p-4">
        <div className="h-8 bg-slate-700 rounded w-full" />
        <div className="space-y-2 pl-4">
            <div className="h-6 bg-slate-700 rounded w-4/5" />
            <div className="h-6 bg-slate-700 rounded w-3/4" />
            <div className="h-6 bg-slate-700 rounded w-5/6" />
        </div>
    </div>
);

export default SkeletonLoader;