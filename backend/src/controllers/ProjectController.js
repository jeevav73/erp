const ProjectService = require('../services/ProjectService');
const { sendResponse, sendError } = require('../utils/apiResponse');

class ProjectController {
  static async createProject(req, res) {
    try {
      const { client_id, title, description, deadline, status } = req.body;

      if (!client_id || !title) {
        return sendError(res, 400, 'Client ID and title are required');
      }

      const result = await ProjectService.createProject(client_id, title, description, deadline, status);
      return sendResponse(res, 201, result, 'Project created successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getProject(req, res) {
    try {
      const { id } = req.params;
      const project = await ProjectService.getProjectById(id);
      return sendResponse(res, 200, project, 'Project retrieved successfully');
    } catch (error) {
      return sendError(res, 404, error.message);
    }
  }

  static async getAllProjects(req, res) {
    try {
      const projects = await ProjectService.getAllProjects();
      return sendResponse(res, 200, projects, 'Projects retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getProjectsByClient(req, res) {
    try {
      const { clientId } = req.params;
      const projects = await ProjectService.getProjectsByClientId(clientId);
      return sendResponse(res, 200, projects, 'Projects retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getProjectsByStatus(req, res) {
    try {
      const { status } = req.query;
      if (!status) {
        return sendError(res, 400, 'Status query parameter is required');
      }
      const projects = await ProjectService.getProjectsByStatus(status);
      return sendResponse(res, 200, projects, 'Projects retrieved successfully');
    } catch (error) {
      return sendError(res, error.message === 'Invalid status' ? 400 : 500, error.message);
    }
  }

  static async updateProject(req, res) {
    try {
      const { id } = req.params;
      const { title, description, deadline, status } = req.body;

      if (!title) {
        return sendError(res, 400, 'Title is required');
      }

      const result = await ProjectService.updateProject(id, title, description, deadline, status);
      return sendResponse(res, 200, result, 'Project updated successfully');
    } catch (error) {
      return sendError(res, error.message === 'Project not found' ? 404 : 500, error.message);
    }
  }

  static async deleteProject(req, res) {
    try {
      const { id } = req.params;
      await ProjectService.deleteProject(id);
      return sendResponse(res, 200, null, 'Project deleted successfully');
    } catch (error) {
      return sendError(res, error.message === 'Project not found' ? 404 : 500, error.message);
    }
  }
}

module.exports = ProjectController;
