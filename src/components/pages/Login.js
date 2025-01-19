
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Key, Loader } from 'lucide-react';

const Login = () => {
    const [licenseKey, setLicenseKey] = useState('');
    const [error, setError] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsValidating(true);

        try {
            const success = await login(licenseKey);
            if (success) {
                navigate('/');
            } else {
                setError('Invalid license key. Please try again.');
            }
        } catch (err) {
            setError('An error occurred while validating your license. Please try again.');
            console.error('Login error:', err);
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
            <div className="max-w-md w-full bg-slate-800 rounded-lg shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome to CodeSage</h1>
                    <p className="text-slate-400">Enter your license key to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="licenseKey">
                            License Key
                        </label>
                        <div className="relative">
                            <input
                                id="licenseKey"
                                type="text"
                                value={licenseKey}
                                onChange={(e) => setLicenseKey(e.target.value)}
                                className={`
                  w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 pl-10
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${error ? 'border-red-500' : ''}
                `}
                                placeholder="Enter your license key"
                                disabled={isValidating}
                                required
                            />
                            <Key className="absolute left-3 top-2.5 text-slate-400" size={20} />
                        </div>
                        {error && (
                            <p className="mt-2 text-sm text-red-500">
                                {error}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!licenseKey || isValidating}
                        className={`
              w-full bg-blue-600 text-white rounded-lg px-4 py-2 font-medium
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center
            `}
                    >
                        {isValidating ? (
                            <>
                                <Loader className="animate-spin -ml-1 mr-2" size={20} />
                                Validating...
                            </>
                        ) : (
                            'Validate License'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-400">
                    <p>Need a license key? Contact support for assistance.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;