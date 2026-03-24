const { getQuery, allQuery, runQuery } = require('../database/connection');

class UserModel {
  static async create(name, email, password, role) {
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `;
    return runQuery(query, [name, email, password, role]);
  }

  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = ?`;
    return getQuery(query, [email]);
  }

  static async findById(id) {
    const query = `SELECT * FROM users WHERE id = ?`;
    return getQuery(query, [id]);
  }

  static async findAll() {
    const query = `SELECT id, name, email, role, created_at FROM users`;
    return allQuery(query);
  }

  static async update(id, name, email, role) {
    const query = `
      UPDATE users
      SET name = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    return runQuery(query, [name, email, role, id]);
  }

  static async delete(id) {
    const query = `DELETE FROM users WHERE id = ?`;
    return runQuery(query, [id]);
  }
}

module.exports = UserModel;
