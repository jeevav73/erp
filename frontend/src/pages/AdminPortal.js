import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { taskService } from '../services/apiServices';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function AdminPortal() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchAllTasks();
    // Auto-refresh every 3 seconds to see real-time task updates
    const interval = setInterval(fetchAllTasks, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllTasks = async () => {
    try {
      const res = await taskService.getTasks();
      setTasks(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <CheckCircle className="text-green-600" size={20} />;
      case 'In Progress': return <Clock className="text-blue-600" size={20} />;
      default: return <AlertCircle className="text-orange-600" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
        <p className="text-gray-600 mb-6">Welcome, {user?.name}. View all tasks and their assignments below.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link to="/clients" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center font-semibold text-gray-700">Manage Clients</Link>
          <Link to="/projects" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center font-semibold text-gray-700">Manage Projects</Link>
          <Link to="/tasks" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center font-semibold text-gray-700">Manage Tasks</Link>
          <Link to="/ai-tools" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center font-semibold text-gray-700">AI Tools</Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-100 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">All Tasks & Assignments</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading tasks...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Task Title</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Project</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Assigned To</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Priority</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-6 text-center text-gray-500">No tasks found</td>
                    </tr>
                  ) : (
                    tasks.map(task => (
                      <tr key={task.id} className="border-t hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-semibold text-gray-800">{task.title}</td>
                        <td className="px-6 py-4 text-gray-700">{task.project_title}</td>
                        <td className="px-6 py-4">
                          <span className="bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {task.assigned_to_name || 'Unassigned'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(task.status)}
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            task.priority === 'High' ? 'bg-red-100 text-red-800' :
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{task.due_date || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Seeded Test Credentials</h2>
          <p className="text-sm text-gray-600 mb-4">These accounts are seeded by the initializer for testing. Default password: <strong>password123</strong></p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Name</th>
                  <th className="px-4 py-2 text-left font-semibold">Email</th>
                  <th className="px-4 py-2 text-left font-semibold">Role</th>
                  <th className="px-4 py-2 text-left font-semibold">Password</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t"><td className="px-4 py-2">Admin User</td><td className="px-4 py-2">admin@erp.com</td><td className="px-4 py-2">Admin</td><td className="px-4 py-2">password123</td></tr>
                <tr className="border-t"><td className="px-4 py-2">Manager User</td><td className="px-4 py-2">manager@erp.com</td><td className="px-4 py-2">Manager</td><td className="px-4 py-2">password123</td></tr>
                <tr className="border-t"><td className="px-4 py-2">Employee One</td><td className="px-4 py-2">employee1@erp.com</td><td className="px-4 py-2">Employee</td><td className="px-4 py-2">password123</td></tr>
                <tr className="border-t"><td className="px-4 py-2">Employee Two</td><td className="px-4 py-2">employee2@erp.com</td><td className="px-4 py-2">Employee</td><td className="px-4 py-2">password123</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
          <p className="text-sm"><strong>🔄 Auto-refresh:</strong> This dashboard updates every 3 seconds to show real-time task status changes.</p>
        </div>
      </div>
    </div>
  );
}
