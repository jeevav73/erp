import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { taskService } from '../services/apiServices';
import { CheckCircle, Clock, AlertCircle, Users } from 'lucide-react';

export default function ManagerPortal() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchAllTasks();
    // Auto-refresh every 3 seconds to show real-time updates from employees
    const interval = setInterval(fetchAllTasks, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchAllTasks = async () => {
    try {
      const res = await taskService.getTasks();
      // Filter only tasks assigned to employees (user_id 2 and 3, or any employee role)
      const employeeTasks = (res.data.data || []).filter(t => t.assigned_to);
      setTasks(employeeTasks);
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

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    pending: tasks.filter(t => t.status === 'To Do').length
  };

  const employeeGroups = {};
  tasks.forEach(task => {
    const empName = task.assigned_to_name || 'Unassigned';
    if (!employeeGroups[empName]) {
      employeeGroups[empName] = [];
    }
    employeeGroups[empName].push(task);
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">Manager Dashboard</h1>
          <p className="text-gray-600">Monitor team tasks and assignments</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-600">
            <p className="text-sm text-gray-600 mb-2">Total Assigned</p>
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

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link to="/tasks" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow transition text-center">
            Assign New Task
          </Link>
          <Link to="/projects" className="bg-white hover:shadow-md border border-gray-300 font-semibold py-3 rounded-lg shadow transition text-center">
            Projects
          </Link>
          <Link to="/clients" className="bg-white hover:shadow-md border border-gray-300 font-semibold py-3 rounded-lg shadow transition text-center">
            Clients
          </Link>
          <Link to="/content-production" className="bg-white hover:shadow-md border border-gray-300 font-semibold py-3 rounded-lg shadow transition text-center">
            Content
          </Link>
        </div>

        {/* Team Tasks by Employee */}
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading team tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Users className="mx-auto mb-3 text-gray-400" size={48} />
            <p className="text-gray-600">No tasks assigned to team members yet.</p>
            <Link to="/tasks" className="text-indigo-600 hover:underline font-semibold mt-2 inline-block">
              Assign a task →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(employeeGroups).map(([employeeName, employeeTasks]) => (
              <div key={employeeName} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Employee Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Users size={24} />
                    {employeeName}
                  </h2>
                  <p className="text-indigo-100 text-sm">
                    {employeeTasks.filter(t => t.status === 'Completed').length}/{employeeTasks.length} tasks completed
                  </p>
                </div>

                {/* Employee Tasks */}
                <div className="divide-y">
                  {employeeTasks.map(task => (
                    <div key={task.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3 flex-1">
                          {getStatusIcon(task.status)}
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">{task.title}</h3>
                            <p className="text-sm text-gray-500">{task.project_title}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">{task.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <span className={`px-2 py-1 rounded ${task.priority === 'High' ? 'bg-red-100 text-red-800' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {task.priority} Priority
                        </span>
                        {task.due_date && (
                          <span className="text-gray-600">Due: {task.due_date}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
          <p className="text-sm"><strong>🔄 Auto-refresh:</strong> This dashboard updates every 3 seconds to show task status changes from your team.</p>
        </div>
      </div>
    </div>
  );
}
