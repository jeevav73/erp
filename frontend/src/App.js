import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import AITools from './pages/AITools';
import ContentProduction from './pages/ContentProduction';
import MarketingPerformance from './pages/MarketingPerformance';
import MarketingMetricsManager from './pages/MarketingMetricsManager';
import AdminPortal from './pages/AdminPortal';
import ManagerPortal from './pages/ManagerPortal';
import EmployeePortal from './pages/EmployeePortal';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/*" element={
            <div className="App flex h-screen">
              <Sidebar />
              <main className="flex-1 overflow-y-auto">
                <Routes>
            
{/*           
          <Route path="/*" element={
            <div className="App flex h-screen">
              <Navbar />
              <main className="flex-1 overflow-y-auto">
                <Routes> */}

            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/clients" element={
              <ProtectedRoute>
                <Clients />
              </ProtectedRoute>
            } />
            
            <Route path="/projects" element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            } />
            
            <Route path="/tasks" element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            } />
            
            <Route path="/ai-tools" element={
              <ProtectedRoute>
                <AITools />
              </ProtectedRoute>
            } />
            
            <Route path="/content-production" element={
              <ProtectedRoute>
                <ContentProduction />
              </ProtectedRoute>
            } />
            
            <Route path="/marketing-performance" element={
              <ProtectedRoute>
                <MarketingPerformance />
              </ProtectedRoute>
            } />

            <Route path="/marketing-metrics" element={
              <ProtectedRoute>
                <MarketingMetricsManager />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPortal />
              </ProtectedRoute>
            } />

            <Route path="/manager" element={
              <ProtectedRoute>
                <ManagerPortal />
              </ProtectedRoute>
            } />

            <Route path="/employee" element={
              <ProtectedRoute>
                <EmployeePortal />
              </ProtectedRoute>
            } />

            <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
