import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="bg-white text-indigo-600 px-2 py-1 rounded">ERP</span>
            Digital Agency
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="hover:text-indigo-200">Dashboard</Link>
              { (user.role === 'Admin' || user.role === 'Manager') && (
                <>
                  <Link to="/clients" className="hover:text-indigo-200">Clients</Link>
                  <Link to="/projects" className="hover:text-indigo-200">Projects</Link>
                  <Link to="/tasks" className="hover:text-indigo-200">Tasks</Link>
                  <Link to="/ai-tools" className="hover:text-indigo-200">AI Tools</Link>
                  <Link to="/content-production" className="hover:text-indigo-200">Content</Link>
                  <Link to="/marketing-performance" className="hover:text-indigo-200">Marketing</Link>
                  <Link to="/marketing-metrics" className="hover:text-indigo-200">Metrics</Link>
                </>
              )}
              { user.role === 'Employee' && (
                <>
                  <Link to="/employee" className="hover:text-indigo-200">My Portal</Link>
                  <Link to="/tasks" className="hover:text-indigo-200">Tasks</Link>
                </>
              )}
              { user.role === 'Admin' && (
                <>
                  <Link to="/admin" className="hover:text-indigo-200">All Tasks</Link>
                </>
              )}

              <div className="flex items-center gap-4 pl-6 border-l border-indigo-400">
                <span className="text-sm">{user.name} ({user.role})</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}

          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              <Menu size={24} />
            </button>
          )}
        </div>

        {mobileMenuOpen && user && (
          <div className="md:hidden pb-4 flex flex-col gap-2">
            <Link to="/dashboard" className="block hover:text-indigo-200 py-2">Dashboard</Link>
              { (user.role === 'Admin') && (
              <>
                <Link to="/admin" className="block hover:text-indigo-200 py-2">All Tasks</Link>
                <Link to="/clients" className="block hover:text-indigo-200 py-2">Clients</Link>
              </>
            )}
              { (user.role === 'Manager') && (
              <>
                <Link to="/clients" className="block hover:text-indigo-200 py-2">Clients</Link>
                <Link to="/projects" className="block hover:text-indigo-200 py-2">Projects</Link>
                <Link to="/tasks" className="block hover:text-indigo-200 py-2">Tasks</Link>
                <Link to="/ai-tools" className="block hover:text-indigo-200 py-2">AI Tools</Link>
                <Link to="/content-production" className="block hover:text-indigo-200 py-2">Content</Link>
                <Link to="/marketing-performance" className="block hover:text-indigo-200 py-2">Marketing</Link>
                <Link to="/marketing-metrics" className="block hover:text-indigo-200 py-2">Metrics</Link>
              </>
            )}
            { user.role === 'Employee' && (
              <>
                <Link to="/employee" className="block hover:text-indigo-200 py-2">My Portal</Link>
                <Link to="/tasks" className="block hover:text-indigo-200 py-2">Tasks</Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-2 rounded w-full justify-center"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
