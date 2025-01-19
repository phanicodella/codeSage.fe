// Path: codeSage.fe/src/components/layout/Navbar.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Settings, LogOut } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-800 px-4 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-slate-700 rounded-lg mr-4"
          aria-label="Toggle Menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-white">CodeSage</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/settings')}
          className="p-2 hover:bg-slate-700 rounded-lg"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-slate-700 rounded-lg"
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;