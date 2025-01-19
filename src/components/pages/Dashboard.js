// Path: codeSage.fe/src/components/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import { FileCode2, AlertCircle, CheckCircle2, Clock, MessageSquare } from 'lucide-react';
import Button from '../common/Button';
import { useCodebase } from '../../context/CodebaseContext';
import ChatInterface from '../chat/ChatInterface';
import CodebaseAnalyzer from '../codebase/CodebaseAnalyzer';
import FileBrowser from '../codebase/FileBrowser';
import VisualizationView from '../visualizations/VisualizationView';

const Dashboard = () => {
  const { codebase, loadCodebase } = useCodebase();
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [stats, setStats] = useState({
    totalFiles: 0,
    bugsFound: 0,
    completedAnalyses: 0
  });
  const [showChat, setShowChat] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  const handleNewAnalysis = async () => {
    try {
      const path = await window.electron?.openDirectory();
      if (path) {
        await loadCodebase(path);
        setShowChat(true);
      }
    } catch (error) {
      console.error('Failed to load codebase:', error);
    }
  };

  return (
    <div className="h-full flex">
      <div className="flex-1 p-6 overflow-y-auto">
        {showChat ? (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">CodeSage Assistant</h1>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowVisualization(!showVisualization)}
                >
                  {showVisualization ? 'Hide Visualization' : 'Show Visualization'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowChat(false)}
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
            <div className="flex-1 flex flex-col space-y-4">
              {showVisualization && (
                <div className="h-96 bg-slate-800 rounded-lg shadow-lg p-4">
                  <VisualizationView type="dependency" />
                </div>
              )}
              <div className={`flex-1 bg-slate-800 rounded-lg shadow-lg ${showVisualization ? 'h-0' : ''}`}>
                <ChatInterface />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <div className="space-x-4">
                {codebase.path && (
                  <Button
                    variant="secondary"
                    onClick={() => setShowChat(true)}
                  >
                    <MessageSquare size={20} className="mr-2" />
                    Open Assistant
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={handleNewAnalysis}
                >
                  New Analysis
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                icon={FileCode2}
                title="Total Files Analyzed"
                value={stats.totalFiles}
                color="bg-blue-500/20 text-blue-500"
              />
              <StatCard
                icon={AlertCircle}
                title="Bugs Found"
                value={stats.bugsFound}
                color="bg-red-500/20 text-red-500"
              />
              <StatCard
                icon={CheckCircle2}
                title="Completed Analyses"
                value={stats.completedAnalyses}
                color="bg-green-500/20 text-green-500"
              />
            </div>

            {codebase.path && (
              <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Code Visualization</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowVisualization(!showVisualization)}
                  >
                    {showVisualization ? 'Hide' : 'Show'} Visualization
                  </Button>
                </div>
                {showVisualization && (
                  <div className="h-[400px]">
                    <VisualizationView type="dependency" />
                  </div>
                )}
              </div>
            )}

            <div className="bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Analyses</h2>
              <div className="space-y-4">
                {recentAnalyses.length > 0 ? (
                  recentAnalyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="flex items-center justify-between p-4 bg-slate-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Clock size={20} className="text-gray-400" />
                        <div>
                          <h4 className="font-medium">{analysis.projectName}</h4>
                          <p className="text-sm text-gray-400">
                            {new Date(analysis.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowChat(true)}
                      >
                        Open Assistant
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No recent analyses. Start by analyzing your first project!
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {codebase.path && showChat && (
        <div className="w-80 border-l border-slate-700 bg-slate-800">
          <FileBrowser />
        </div>
      )}
    </div>
  );
};

export default Dashboard;