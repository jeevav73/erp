import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, LayoutDashboard, Users, Briefcase, CheckSquare, Zap, FileText, BarChart3, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  const menuItems = {
    common: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' }
    ],
    admin: [
      { icon: Database, label: 'All Tasks', path: '/admin' },
      { icon: Users, label: 'Clients', path: '/clients' },
      { icon: Briefcase, label: 'Projects', path: '/projects' }
    ],
    manager: [
      { icon: Users, label: 'Clients', path: '/clients' },
      { icon: Briefcase, label: 'Projects', path: '/projects' },
      { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
      { icon: Zap, label: 'AI Tools', path: '/ai-tools' },
      { icon: FileText, label: 'Content', path: '/content-production' },
      { icon: BarChart3, label: 'Marketing', path: '/marketing-performance' },
      { icon: BarChart3, label: 'Metrics', path: '/marketing-metrics' }
    ],
    employee: [
      { icon: Database, label: 'My Portal', path: '/employee' },
      { icon: CheckSquare, label: 'Tasks', path: '/tasks' }
    ]
  };

  let roleItems = menuItems.common;
  if (user.role === 'Admin') {
    roleItems = [...menuItems.common, ...menuItems.admin];
  } else if (user.role === 'Manager') {
    roleItems = [...menuItems.common, ...menuItems.manager];
  } else if (user.role === 'Employee') {
    roleItems = [...menuItems.common, ...menuItems.employee];
  }

  return (
    <>
      {/* Mobile toggle button - only show on mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg md:hidden hover:bg-indigo-700"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-indigo-700 text-white shadow-xl transition-all duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-indigo-600">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:text-indigo-200">
            <span className="bg-white text-indigo-700 px-2 py-1 rounded">ERP</span>
            <span>Digital Agency</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-indigo-600 bg-indigo-600">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-indigo-200">{user.role}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {roleItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100 hover:text-white"
                    onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-indigo-600">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors font-semibold"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
