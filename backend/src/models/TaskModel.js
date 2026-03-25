const { getQuery, allQuery, runQuery } = require('../database/connection');

class TaskModel {
  static async create(projectId, assignedTo, title, description, status = 'To Do', priority = 'Medium', dueDate = null) {
    const query = `
      INSERT INTO tasks (project_id, assigned_to, title, description, status, priority, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    return runQuery(query, [projectId, assignedTo, title, description, status, priority, dueDate]);
  }

  static async findById(id) {
    const query = `
      SELECT t.*, u.name as assigned_to_name, p.title as project_title
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.id = ?
    `;
    return getQuery(query, [id]);
  }

  static async findAll() {
    const query = `
      SELECT t.*, u.name as assigned_to_name, p.title as project_title
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN projects p ON t.project_id = p.id
      ORDER BY t.created_at DESC
    `;
    return allQuery(query);
  }

  static async findByProjectId(projectId) {
    const query = `
      SELECT t.*, u.name as assigned_to_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.project_id = ?
      ORDER BY t.status, t.priority DESC
    `;
    return allQuery(query, [projectId]);
  }

  static async findByAssignedTo(userId) {
    const query = `
      SELECT t.*, u.name as assigned_to_name, p.title as project_title
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.assigned_to = ?
      ORDER BY t.created_at DESC
    `;
    return allQuery(query, [userId]);
  }

  static async findByStatus(status) {
    const query = `
      SELECT t.*, u.name as assigned_to_name, p.title as project_title
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.status = ?
      ORDER BY t.created_at DESC
    `;
    return allQuery(query, [status]);
  }

  static async update(id, assignedTo, title, description, status, priority, dueDate) {
    const query = `
      UPDATE tasks
      SET assigned_to = ?, title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    return runQuery(query, [assignedTo, title, description, status, priority, dueDate, id]);
  }

  static async delete(id) {
    const query = `DELETE FROM tasks WHERE id = ?`;
    return runQuery(query, [id]);
  }
}

module.exports = TaskModel;
