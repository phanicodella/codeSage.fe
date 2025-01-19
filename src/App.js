// Path: codeSage.fe/src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/pages/Dashboard';
import CodeAnalysis from './components/pages/CodeAnalysis';
import Settings from './components/pages/Settings';
import Login from './components/pages/Login';
import { AuthProvider } from './context/AuthContext';
import { CodebaseProvider } from './context/CodebaseContext';
import { VisualizationProvider } from './context/VisualizationContext';
import './App.css';

const PrivateLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="app-container">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`main-content ${!isSidebarOpen ? 'expanded' : ''}`}>
          {children}
        </main>
      </div>
    </>
  );
};

const PrivateRoute = ({ children }) => {
  const hasLicense = localStorage.getItem('authToken');
  return hasLicense ? <PrivateLayout>{children}</PrivateLayout> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <CodebaseProvider>
        <VisualizationProvider>
          <Router>
            <div className="app">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/analysis" element={
                  <PrivateRoute>
                    <CodeAnalysis />
                  </PrivateRoute>
                } />
                <Route path="/settings" element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                } />
                {/* Redirect any unknown routes to dashboard */}
                <Route path="*" element={<Navigate replace to="/" />} />
              </Routes>
            </div>
          </Router>
        </VisualizationProvider>
      </CodebaseProvider>
    </AuthProvider>
  );
}

export default App;