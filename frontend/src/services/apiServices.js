import api from './api';

export const authService = {
  register: (name, email, password, role = 'Employee') =>
    api.post('/auth/register', { name, email, password, role }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  verify: () =>
    api.get('/auth/verify')
};

export const clientService = {
  createClient: (data) =>
    api.post('/clients', data),

  getClients: () =>
    api.get('/clients'),

  searchClients: (query) =>
    api.get('/clients/search', { params: { q: query } }),

  getClient: (id) =>
    api.get(`/clients/${id}`),

  updateClient: (id, data) =>
    api.put(`/clients/${id}`, data),

  deleteClient: (id) =>
    api.delete(`/clients/${id}`)
};

export const projectService = {
  createProject: (data) =>
    api.post('/projects', data),

  getProjects: () =>
    api.get('/projects'),

  getProject: (id) =>
    api.get(`/projects/${id}`),

  getProjectsByClient: (clientId) =>
    api.get(`/projects/client/${clientId}`),

  getProjectsByStatus: (status) =>
    api.get('/projects/status', { params: { status } }),

  updateProject: (id, data) =>
    api.put(`/projects/${id}`, data),

  deleteProject: (id) =>
    api.delete(`/projects/${id}`)
};

export const taskService = {
  createTask: (data) =>
    api.post('/tasks', data),

  getTasks: () =>
    api.get('/tasks'),

  getTask: (id) =>
    api.get(`/tasks/${id}`),

  getTasksByProject: (projectId) =>
    api.get(`/tasks/project/${projectId}`),

  getTasksByUser: (userId) =>
    api.get(`/tasks/user/${userId}`),

  getTasksByStatus: (status) =>
    api.get('/tasks/status', { params: { status } }),

  updateTask: (id, data) =>
    api.put(`/tasks/${id}`, data),

  deleteTask: (id) =>
    api.delete(`/tasks/${id}`)
};

export const aiService = {
  generateContent: (topic, contentType) =>
    api.post('/ai/generate', { topic, content_type: contentType }),

  getHistory: () =>
    api.get('/ai/history'),

  getAllContent: () =>
    api.get('/ai/all')
};

export const dashboardService = {
  getDashboardStats: () =>
    api.get('/dashboard/stats'),

  getProjectStats: () =>
    api.get('/dashboard/projects'),

  getTaskStats: () =>
    api.get('/dashboard/tasks'),

  getEmployeePerformance: () =>
    api.get('/dashboard/employee-performance'),

  getIndustryDistribution: () =>
    api.get('/dashboard/industry-distribution'),

  getProjectTimeline: () =>
    api.get('/dashboard/project-timeline')
};
