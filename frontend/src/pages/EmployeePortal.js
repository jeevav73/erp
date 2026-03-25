import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/apiServices';
import { CheckCircle, AlertCircle, Clock, User, Briefcase, Calendar } from 'lucide-react';

export default function EmployeePortal() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchTasks();
    // Auto-refresh every 5 seconds to show real-time updates from other windows
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchTasks = async () => {
    try {
      const res = await taskService.getTasksByUser(user.id);
      setTasks(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setUpdating(taskId);
      await taskService.updateTask(taskId, { status: newStatus });
      // Immediately refresh to show the update
      await fetchTasks();
    } catch (err) {
      console.error('Failed to update task status', err);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <CheckCircle className="text-green-600" size={20} />;
      case 'In Progress': return <Clock className="text-blue-600" size={20} />;
      default: return <AlertCircle className="text-orange-600" size={20} />;
    }
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    pending: tasks.filter(t => t.status === 'To Do').length
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-2 text-gray-800">My Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back, {user?.name} 👋</p>

        {/* Employee Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                <User className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                <p className="text-indigo-600 font-semibold">Employee</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Briefcase className="text-indigo-600" size={24} />
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-semibold text-gray-800">Content Specialist</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="text-indigo-600" size={24} />
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-semibold text-gray-800">Content</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="text-indigo-600" size={24} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-800">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-600">
            <p className="text-sm text-gray-600 mb-2">Total Tasks</p>
            <p className="text-3xl font-bold text-indigo-600">{taskStats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <p className="text-sm text-gray-600 mb-2">Pending</p>
            <p className="text-3xl font-bold text-orange-500">{taskStats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-2">In Progress</p>
            <p className="text-3xl font-bold text-blue-500">{taskStats.inProgress}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-2">Completed</p>
            <p className="text-3xl font-bold text-green-500">{taskStats.completed}</p>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-100 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Assigned Tasks</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading your tasks...</div>
          ) : (
            <div className="divide-y">
              {tasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No tasks assigned yet.</div>
              ) : (
                tasks.map(t => (
                  <div key={t.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        {getStatusIcon(t.status)}
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">{t.title}</h3>
                          <p className="text-sm text-gray-500">{t.project_title}</p>
                        </div>
                      </div>
                      <select
                        value={t.status}
                        onChange={(e) => handleStatusChange(t.id, e.target.value)}
                        disabled={updating === t.id}
                        className="px-3 py-2 border border-indigo-300 rounded-lg bg-indigo-50 text-indigo-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 transition"
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <p className="text-gray-700 mb-4">{t.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Status: </span>
                        <span className={`font-semibold ${t.status === 'Completed' ? 'text-green-600' : t.status === 'In Progress' ? 'text-blue-600' : 'text-orange-600'}`}>
                          {t.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Priority: </span>
                        <span className={`font-semibold ${t.priority === 'High' ? 'text-red-600' : t.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                          {t.priority}
                        </span>
                      </div>
                      {t.due_date && (
                        <div>
                          <span className="text-gray-500">Due: </span>
                          <span className="font-semibold text-gray-800">{t.due_date}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
          <p className="text-sm"><strong>💡 Tip:</strong> Update your task status above. Changes will be visible to your manager immediately.</p>
        </div>
      </div>
    </div>
  );
}
