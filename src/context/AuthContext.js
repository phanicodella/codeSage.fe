// Path: codeSage.fe/src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [licenseInfo, setLicenseInfo] = useState(null);

  useEffect(() => {
    verifyLicense();
  }, []);

  const verifyLicense = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/license/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLicenseInfo(data);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('License verification error:', err);
      setError('Failed to verify license');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (licenseKey) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/license/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ license_key: licenseKey })
      });

      if (!response.ok) {
        throw new Error('Invalid license key');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      setLicenseInfo(data);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setLicenseInfo(null);
    window.location.href = '/login';
  };

  const refreshLicense = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No license token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/license/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to refresh license');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      setLicenseInfo(data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Add request interceptor for API calls
  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (response.status === 401) {
        // Try to refresh the token
        const refreshed = await refreshLicense();
        if (!refreshed) {
          logout();
          throw new Error('Session expired');
        }

        // Retry the original request
        const newToken = localStorage.getItem('authToken');
        headers.Authorization = `Bearer ${newToken}`;
        return fetch(url, { ...options, headers });
      }

      return response;
    } catch (error) {
      if (error.message === 'Session expired') {
        logout();
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      loading,
      error,
      licenseInfo,
      login,
      logout,
      refreshLicense,
      authFetch
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const withAuth = (Component) => {
  return function WrappedComponent(props) {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        navigate('/login');
      }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };
};