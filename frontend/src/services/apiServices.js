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

export const contentService = {
  createContent: (data) =>
    api.post('/content', data),

  getAllContent: () =>
    api.get('/content'),

  getContent: (id) =>
    api.get(`/content/${id}`),

  getContentByType: (contentType) =>
    api.get(`/content/type/${contentType}`),

  searchContent: (query) =>
    api.get('/content/search', { params: { q: query } }),

  getContentStats: () =>
    api.get('/content/stats'),

  deleteContent: (id) =>
    api.delete(`/content/${id}`)
};

export const marketingService = {
  createCampaign: (data) =>
    api.post('/marketing', data),

  getAllCampaigns: () =>
    api.get('/marketing'),

  getCampaign: (id) =>
    api.get(`/marketing/${id}`),

  updateCampaign: (id, data) =>
    api.put(`/marketing/${id}`, data),

  addPerformanceMetric: (campaignId, data) =>
    api.post(`/marketing/${campaignId}/performance`, data),

  getCampaignPerformance: (id) =>
    api.get(`/marketing/${id}/performance`),

  getMarketingStats: () =>
    api.get('/marketing/stats'),

  deleteCampaign: (id) =>
    api.delete(`/marketing/${id}`)
};

export const contributionService = {
  createContribution: (data) =>
    api.post('/contributions', data),

  getAllContributions: () =>
    api.get('/contributions'),

  getContribution: (id) =>
    api.get(`/contributions/${id}`),

  updateContribution: (id, data) =>
    api.put(`/contributions/${id}`, data),

  deleteContribution: (id) =>
    api.delete(`/contributions/${id}`)
};

export const contentProductionService = {
  create: (data) => api.post('/content-production', data),
  list: () => api.get('/content-production'),
  get: (id) => api.get(`/content-production/${id}`),
  update: (id, data) => api.put(`/content-production/${id}`, data),
  remove: (id) => api.delete(`/content-production/${id}`)
};

export const marketingMetricsService = {
  insertMetric: (data) => api.post('/marketing-metrics', data),
  getByCampaign: (campaignId, params) => api.get(`/marketing-metrics/campaign/${campaignId}`, { params }),
  aggregate: (campaignId, params) => api.get(`/marketing-metrics/campaign/${campaignId}/aggregate`, { params })
};
