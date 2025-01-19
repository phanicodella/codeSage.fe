// Path: codeSage.fe/src/components/common/LicenseModal.js

import React, { useState, useEffect } from 'react';
import { Key, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

const LicenseModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    setIsOpen(!isAuthenticated);
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsValidating(true);

    try {
      const success = await login(licenseKey);
      if (success) {
        setIsOpen(false);
      } else {
        setError('Invalid license key');
      }
    } catch (err) {
      setError('Failed to validate license key');
    } finally {
      setIsValidating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Enter License Key</h2>
          {error && <X size={20} className="text-red-500 cursor-pointer" />}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              License Key
            </label>
            <div className="relative">
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                className="bg-slate-700 rounded-lg pl-10 pr-4 py-2 w-full"
                placeholder="Enter your license key"
                required
              />
              <Key className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              type="submit"
              variant="primary"
              isLoading={isValidating}
              disabled={!licenseKey || isValidating}
            >
              Validate License
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LicenseModal;