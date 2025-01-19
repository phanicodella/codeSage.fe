// Path: codeSage.fe/src/components/codebase/FileBrowser.js

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react';
import { useCodebase } from '../../context/CodebaseContext';

const FileNode = ({ item, onFileSelect }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Skip showing hidden files/directories
    if (item.name.startsWith('.')) return null;

    if (item.type === 'file') {
        return (
            <div
                className="flex items-center py-1 px-2 hover:bg-slate-700 rounded cursor-pointer"
                onClick={() => onFileSelect(item)}
            >
                <File size={16} className="mr-2 text-slate-400" />
                <span className="text-sm truncate">{item.name}</span>
            </div>
        );
    }

    return (
        <div>
            <div
                className="flex items-center py-1 px-2 hover:bg-slate-700 rounded cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? (
                    <ChevronDown size={16} className="mr-1" />
                ) : (
                    <ChevronRight size={16} className="mr-1" />
                )}
                <Folder size={16} className="mr-2 text-slate-400" />
                <span className="text-sm font-medium">{item.name}</span>
            </div>
            {isExpanded && (
                <div className="ml-4">
                    {item.children.map((child, index) => (
                        <FileNode
                            key={`${child.name}-${index}`}
                            item={child}
                            onFileSelect={onFileSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const FileBrowser = () => {
    const { codebase } = useCodebase();
    const [selectedFile, setSelectedFile] = useState(null);

    const buildFileTree = (files) => {
        const root = { name: '', type: 'directory', children: [] };

        files.forEach(file => {
            const parts = file.path.split('/');
            let current = root;

            parts.forEach((part, index) => {
                if (index === parts.length - 1) {
                    // File
                    current.children.push({
                        name: part,
                        type: 'file',
                        path: file.path
                    });
                } else {
                    // Directory
                    let dir = current.children.find(child =>
                        child.type === 'directory' && child.name === part
                    );

                    if (!dir) {
                        dir = {
                            name: part,
                            type: 'directory',
                            children: []
                        };
                        current.children.push(dir);
                    }

                    current = dir;
                }
            });
        });

        return root.children;
    };

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        // TODO: Implement file content loading and display
    };

    if (!codebase.path) {
        return (
            <div className="p-4 text-center text-slate-400">
                No codebase loaded
            </div>
        );
    }

    const fileTree = buildFileTree(codebase.files);

    return (
        <div className="bg-slate-800 h-full overflow-y-auto">
            <div className="p-2">
                <div className="bg-slate-900 rounded p-2 mb-2">
                    <span className="text-sm font-medium">Codebase:</span>
                    <span className="text-sm text-slate-400 ml-2 truncate">
                        {codebase.path}
                    </span>
                </div>

                <div className="space-y-1">
                    {fileTree.map((item, index) => (
                        <FileNode
                            key={`${item.name}-${index}`}
                            item={item}
                            onFileSelect={handleFileSelect}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FileBrowser;