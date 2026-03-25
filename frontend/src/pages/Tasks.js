import React, { useEffect, useState } from 'react';
import { taskService, projectService } from '../services/apiServices';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { formatDate, getPriorityColor } from '../utils/helpers';

const TaskModal = ({ isOpen, task, projects, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    project_id: '',
    title: '',
    description: '',
    assigned_to: '',
    status: 'To Do',
    priority: 'Medium',
    due_date: ''
  });

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        project_id: '',
        title: '',
        description: '',
        assigned_to: '',
        status: 'To Do',
        priority: 'Medium',
        due_date: ''
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{task ? 'Edit Task' : 'Add Task'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Project*</label>
            <select
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            >
              <option value="">Select a project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Title*</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Assign To</label>
            <select
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">Select employee</option>
              <option value="2">Employee One (employee1@erp.com)</option>
              <option value="3">Employee Two (employee2@erp.com)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Due Date</label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TaskCard = ({ task, onEdit, onDelete, user, onStatusChange }) => (
  <div className="bg-white rounded-lg shadow p-4 mb-3 cursor-pointer hover:shadow-md transition">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-gray-800">{task.title}</h4>
      <div className="flex gap-1">
        {user && user.role === 'Employee' ? (
          task.assigned_to === user.id ? (
            <select value={task.status} onChange={(e) => onStatusChange(task, e.target.value)} className="px-2 py-1 border rounded">
              <option>To Do</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          ) : null
        ) : (
          <>
            <button onClick={() => onEdit(task)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
              <Edit2 size={14} />
            </button>
            <button onClick={() => onDelete(task.id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
    <p className="text-xs text-gray-600 mb-2">{task.project_title}</p>
    <p className="text-sm text-gray-700 mb-2">{task.description}</p>
    <div className="flex justify-between items-end">
      <span className={`text-xs px-2 py-1 rounded font-semibold ${getPriorityColor(task.priority)}`}>
        {task.priority}
      </span>
      {task.due_date && <span className="text-xs text-gray-500">{formatDate(task.due_date)}</span>}
    </div>
  </div>
);

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [viewType, setViewType] = useState('kanban'); // kanban or list

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const projectsRes = await projectService.getProjects();
      let tasksRes;
      if (user && user.role === 'Employee') {
        tasksRes = await taskService.getTasksByUser(user.id);
      } else {
        tasksRes = await taskService.getTasks();
      }
      setTasks(tasksRes.data.data || []);
      setProjects(projectsRes.data.data || []);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async (formData) => {
    try {
      setSaving(true);
      if (selectedTask) {
        await taskService.updateTask(selectedTask.id, formData);
      } else {
        await taskService.createTask(formData);
      }
      await fetchData();
      setModalOpen(false);
      setSelectedTask(null);
    } catch (err) {
      setError('Failed to save task');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        await fetchData();
      } catch (err) {
        setError('Failed to delete task');
        console.error(err);
      }
    }
  };

  const statuses = ['To Do', 'In Progress', 'Completed'];
  const tasksByStatus = statuses.map(status => ({
    status,
    tasks: tasks.filter(t => t.status === status)
  }));

  if (loading) return <div className="p-8 text-center">Loading tasks...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
          <div className="flex gap-4">
          <button
            onClick={() => setViewType('kanban')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              viewType === 'kanban' ? 'bg-indigo-600 text-white' : 'bg-white border'
            }`}
          >
            Kanban
          </button>
          <button
            onClick={() => setViewType('list')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              viewType === 'list' ? 'bg-indigo-600 text-white' : 'bg-white border'
            }`}
          >
            List
          </button>
          { !(user && user.role === 'Employee') && (
            <button
              onClick={() => {
                setSelectedTask(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              <Plus size={20} /> Add Task
            </button>
          )}
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

      {viewType === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tasksByStatus.map(column => (
            <div key={column.status} className="bg-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-4">
                {column.status} ({column.tasks.length})
              </h3>
              <div>
                {column.tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    user={user}
                    onEdit={(t) => {
                      setSelectedTask(t);
                      setModalOpen(true);
                    }}
                    onDelete={handleDeleteTask}
                    onStatusChange={async (taskItem, newStatus) => {
                      try {
                        await taskService.updateTask(taskItem.id, { status: newStatus });
                        await fetchData();
                      } catch (err) {
                        console.error('Failed to update status', err);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Title</th>
                  <th className="px-6 py-3 text-left font-semibold">Project</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                  <th className="px-6 py-3 text-left font-semibold">Priority</th>
                  <th className="px-6 py-3 text-left font-semibold">Due Date</th>
                  <th className="px-6 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3">{task.title}</td>
                    <td className="px-6 py-3">{task.project_title}</td>
                    <td className="px-6 py-3">{task.status}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded text-sm font-semibold ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-3">{task.due_date ? formatDate(task.due_date) : '-'}</td>
                    <td className="px-6 py-3 text-center flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <TaskModal
        isOpen={modalOpen}
        task={selectedTask}
        projects={projects}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        loading={saving}
      />
    </div>
  );
}
