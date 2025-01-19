// Path: codeSage.fe/src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/pages/Dashboard';
import CodeAnalysis from './components/pages/CodeAnalysis';
import Settings from './components/pages/Settings';
import LicenseModal from './components/common/LicenseModal';
import { AuthProvider } from './context/AuthContext';
import { CodebaseProvider } from './context/CodebaseContext'; // Add this
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <AuthProvider>
      <CodebaseProvider> {/* Add this wrapper */}
        <Router>
          <div className="app">
            <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="app-container">
              <Sidebar isOpen={isSidebarOpen} />
              <main className={`main-content ${!isSidebarOpen ? 'expanded' : ''}`}>
                <Routes>
                  <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/analysis" element={<PrivateRoute><CodeAnalysis /></PrivateRoute>} />
                  <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                </Routes>
              </main>
            </div>
            <LicenseModal />
          </div>
        </Router>
      </CodebaseProvider>
    </AuthProvider>
  );
}

export default App;