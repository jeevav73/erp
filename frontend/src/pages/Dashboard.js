import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboardService } from '../services/apiServices';
import { Users, Briefcase, CheckCircle, ListTodo } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`${color} rounded-lg shadow-md p-6 text-white`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold opacity-80">{label}</p>
        <p className="text-3xl font-bold mt-2">{value || 0}</p>
      </div>
      <Icon size={40} className="opacity-80" />
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [projectStats, setProjectStats] = useState([]);
  const [taskStats, setTaskStats] = useState([]);
  const [empPerformance, setEmpPerformance] = useState([]);
  const [industryDist, setIndustryDist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const COLORS = ['#4F46E5', '#06B6D4', '#EC4899', '#F59E0B', '#8B5CF6'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [s, ps, ts, ep, id] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getProjectStats(),
          dashboardService.getTaskStats(),
          dashboardService.getEmployeePerformance(),
          dashboardService.getIndustryDistribution()
        ]);

        setStats(s.data.data);
        setProjectStats(ps.data.data);
        setTaskStats(ts.data.data);
        setEmpPerformance(ep.data.data);
        setIndustryDist(id.data.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard icon={Users} label="Total Clients" value={stats?.total_clients} color="bg-blue-500" />
        <StatCard icon={Briefcase} label="Active Projects" value={stats?.active_projects} color="bg-indigo-500" />
        <StatCard icon={CheckCircle} label="Completed Tasks" value={stats?.completed_tasks} color="bg-green-500" />
        <StatCard icon={ListTodo} label="Total Tasks" value={stats?.total_tasks} color="bg-orange-500" />
        <StatCard icon={Users} label="Total Users" value={stats?.total_users} color="bg-pink-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Status Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Project Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Task Status Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Task Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#06B6D4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Employee Performance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Employee Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={empPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_tasks" fill="#8B5CF6" />
              <Bar dataKey="completed_tasks" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Industry Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Industry Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={industryDist}
                nameKey="industry"
                dataKey="count"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {industryDist.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
