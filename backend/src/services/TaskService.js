const TaskModel = require('../models/TaskModel');

class TaskService {
  static async createTask(projectId, assignedTo, title, description, status = 'To Do', priority = 'Medium', dueDate = null) {
    if (!projectId || !title) {
      throw new Error('Project ID and title are required');
    }
    return TaskModel.create(projectId, assignedTo, title, description, status, priority, dueDate);
  }

  static async getTaskById(id) {
    const task = await TaskModel.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  static async getAllTasks() {
    return TaskModel.findAll();
  }

  static async getTasksByProjectId(projectId) {
    return TaskModel.findByProjectId(projectId);
  }

  static async getTasksByAssignedTo(userId) {
    return TaskModel.findByAssignedTo(userId);
  }

  static async getTasksByStatus(status) {
    const validStatuses = ['To Do', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
    return TaskModel.findByStatus(status);
  }

  static async updateTask(id, assignedTo, title, description, status, priority, dueDate) {
    await this.getTaskById(id);
    return TaskModel.update(id, assignedTo, title, description, status, priority, dueDate);
  }

  static async deleteTask(id) {
    await this.getTaskById(id);
    return TaskModel.delete(id);
  }
}

module.exports = TaskService;
