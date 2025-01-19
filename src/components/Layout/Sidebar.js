// Path: codeSage.fe/src/components/layout/Sidebar.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home,
  Code,
  FileSearch,
  Bug,
  Settings,
  BookOpen
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Code, label: 'Code Analysis', path: '/analysis' },
    { icon: FileSearch, label: 'File Explorer', path: '/explorer' },
    { icon: Bug, label: 'Bug Detection', path: '/bugs' },
    { icon: BookOpen, label: 'Documentation', path: '/docs' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <aside 
      className={`
        bg-slate-800 w-64 flex-shrink-0 h-full overflow-y-auto
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="py-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-gray-300 hover:bg-slate-700
                transition-colors duration-200
                ${isActive ? 'bg-slate-700 text-white' : ''}
              `}
            >
              <Icon size={20} className="mr-3" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
      
      <div className="absolute bottom-0 w-full p-4 bg-slate-900">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <span>Version 1.0.0</span>
          <span>•</span>
          <span>Offline Mode</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;