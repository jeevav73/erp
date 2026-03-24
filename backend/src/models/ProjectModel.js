const { getQuery, allQuery, runQuery } = require('../database/connection');

class ProjectModel {
  static async create(clientId, title, description, deadline, status = 'Pending') {
    const query = `
      INSERT INTO projects (client_id, title, description, deadline, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    return runQuery(query, [clientId, title, description, deadline, status]);
  }

  static async findById(id) {
    const query = `
      SELECT p.*, c.company_name 
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      WHERE p.id = ?
    `;
    return getQuery(query, [id]);
  }

  static async findAll() {
    const query = `
      SELECT p.*, c.company_name
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      ORDER BY p.created_at DESC
    `;
    return allQuery(query);
  }

  static async findByClientId(clientId) {
    const query = `
      SELECT * FROM projects WHERE client_id = ?
      ORDER BY created_at DESC
    `;
    return allQuery(query, [clientId]);
  }

  static async findByStatus(status) {
    const query = `
      SELECT p.*, c.company_name
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      WHERE p.status = ?
      ORDER BY p.created_at DESC
    `;
    return allQuery(query, [status]);
  }

  static async update(id, title, description, deadline, status) {
    const query = `
      UPDATE projects
      SET title = ?, description = ?, deadline = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    return runQuery(query, [title, description, deadline, status, id]);
  }

  static async delete(id) {
    const query = `DELETE FROM projects WHERE id = ?`;
    return runQuery(query, [id]);
  }
}

module.exports = ProjectModel;
