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
      // If caller is Employee, ensure they can only request their own tasks
      if (req.user.role === 'Employee' && Number(userId) !== Number(req.user.id)) {
        return sendError(res, 403, 'Employees can only view their own tasks');
      }
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
    // Request body-la irundhu vara values
    const { assigned_to, title, description, status, priority, due_date } = req.body;

    // 1. Modhala database-la irukqa current task details-ah edunga
    const existing = await TaskService.getTaskById(id);
    if (!existing) return sendError(res, 404, 'Task not found');

    // 2. Employee check (Already neenga pottadhudhaan)
    if (req.user.role === 'Employee' && Number(existing.assigned_to) !== Number(req.user.id)) {
      return sendError(res, 403, 'Employees can only update their own tasks');
    }

    // 3. IMPORTANT: Title or other fields varalana, DB-la irukqa palaiya values-aye eduthuko nu solrom
    const final_title = title || existing.title;
    const final_assigned = assigned_to || existing.assigned_to;
    const final_desc = description || existing.description;
    const final_status = status || existing.status;
    const final_priority = priority || existing.priority;
    const final_due = due_date || existing.due_date;

    // 4. Ippo update pannunga
    const result = await TaskService.updateTask(
      id, 
      final_assigned, 
      final_title, 
      final_desc, 
      final_status, 
      final_priority, 
      final_due
    );

    return sendResponse(res, 200, result, 'Task updated successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
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
