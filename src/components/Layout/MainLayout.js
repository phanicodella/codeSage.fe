// Path: codeSage.fe/src/components/layout/MainLayout.js

import React, { useState } from 'react';
import Navbar from './Navbar';
import FileBrowser from '../codebase/FileBrowser';
import ChatInterface from '../chat/ChatInterface';
import CodebaseAnalyzer from '../codebase/CodebaseAnalyzer';
import { useCodebase } from '../../context/CodebaseContext';
import { Minimize2, Maximize2 } from 'lucide-react';

const MainLayout = () => {
    const { codebase } = useCodebase();
    const [isFileBrowserExpanded, setIsFileBrowserExpanded] = useState(true);

    return (
        <div className="flex flex-col h-screen bg-slate-900">
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                {/* File Browser */}
                {codebase.path && (
                    <div
                        className={`${isFileBrowserExpanded ? 'w-80' : 'w-12'
                            } transition-all duration-300 border-r border-slate-700 relative`}
                    >
                        {isFileBrowserExpanded ? (
                            <FileBrowser />
                        ) : (
                            <div className="h-full bg-slate-800">
                                {/* Collapsed view with file icons */}
                            </div>
                        )}

                        {/* Toggle button */}
                        <button
                            onClick={() => setIsFileBrowserExpanded(!isFileBrowserExpanded)}
                            className="absolute right-0 top-2 transform translate-x-1/2 
                        bg-slate-700 rounded-full p-1 hover:bg-slate-600"
                        >
                            {isFileBrowserExpanded ? (
                                <Minimize2 size={16} />
                            ) : (
                                <Maximize2 size={16} />
                            )}
                        </button>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden">
                    {!codebase.path ? (
                        <CodebaseAnalyzer />
                    ) : (
                        <ChatInterface />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;