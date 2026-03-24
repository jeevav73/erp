const TaskService = require('../services/TaskService');
const { sendResponse, sendError } = require('../utils/apiResponse');

class TaskController {
  static async createTask(req, res) {
    try {
      const { project_id, assigned_to, title, description, status, priority, due_date } = req.body;

      if (!project_id || !title) {
        return sendError(res, 400, 'Project ID and title are required');
      }

      const result = await TaskService.createTask(project_id, assigned_to, title, description, status, priority, due_date);
      return sendResponse(res, 201, result, 'Task created successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getTask(req, res) {
    try {
      const { id } = req.params;
      const task = await TaskService.getTaskById(id);
      return sendResponse(res, 200, task, 'Task retrieved successfully');
    } catch (error) {
      return sendError(res, 404, error.message);
    }
  }

  static async getAllTasks(req, res) {
    try {
      const tasks = await TaskService.getAllTasks();
      return sendResponse(res, 200, tasks, 'Tasks retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getTasksByProject(req, res) {
    try {
      const { projectId } = req.params;
      const tasks = await TaskService.getTasksByProjectId(projectId);
      return sendResponse(res, 200, tasks, 'Tasks retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getTasksByUser(req, res) {
    try {
      const { userId } = req.params;
      const tasks = await TaskService.getTasksByAssignedTo(userId);
      return sendResponse(res, 200, tasks, 'Tasks retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getTasksByStatus(req, res) {
    try {
      const { status } = req.query;
      if (!status) {
        return sendError(res, 400, 'Status query parameter is required');
      }
      const tasks = await TaskService.getTasksByStatus(status);
      return sendResponse(res, 200, tasks, 'Tasks retrieved successfully');
    } catch (error) {
      return sendError(res, error.message === 'Invalid status' ? 400 : 500, error.message);
    }
  }

  static async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { assigned_to, title, description, status, priority, due_date } = req.body;

      if (!title) {
        return sendError(res, 400, 'Title is required');
      }

      const result = await TaskService.updateTask(id, assigned_to, title, description, status, priority, due_date);
      return sendResponse(res, 200, result, 'Task updated successfully');
    } catch (error) {
      return sendError(res, error.message === 'Task not found' ? 404 : 500, error.message);
    }
  }

  static async deleteTask(req, res) {
    try {
      const { id } = req.params;
      await TaskService.deleteTask(id);
      return sendResponse(res, 200, null, 'Task deleted successfully');
    } catch (error) {
      return sendError(res, error.message === 'Task not found' ? 404 : 500, error.message);
    }
  }
}

module.exports = TaskController;
