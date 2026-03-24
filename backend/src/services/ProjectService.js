const ProjectModel = require('../models/ProjectModel');

class ProjectService {
  static async createProject(clientId, title, description, deadline, status = 'Pending') {
    if (!clientId || !title) {
      throw new Error('Client ID and title are required');
    }
    return ProjectModel.create(clientId, title, description, deadline, status);
  }

  static async getProjectById(id) {
    const project = await ProjectModel.findById(id);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  static async getAllProjects() {
    return ProjectModel.findAll();
  }

  static async getProjectsByClientId(clientId) {
    return ProjectModel.findByClientId(clientId);
  }

  static async getProjectsByStatus(status) {
    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
    return ProjectModel.findByStatus(status);
  }

  static async updateProject(id, title, description, deadline, status) {
    await this.getProjectById(id);
    return ProjectModel.update(id, title, description, deadline, status);
  }

  static async deleteProject(id) {
    await this.getProjectById(id);
    return ProjectModel.delete(id);
  }
}

module.exports = ProjectService;
