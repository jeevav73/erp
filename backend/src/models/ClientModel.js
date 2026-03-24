const { getQuery, allQuery, runQuery } = require('../database/connection');

class ClientModel {
  static async create(companyName, industry, contactName, phone, email) {
    const query = `
      INSERT INTO clients (company_name, industry, contact_name, phone, email)
      VALUES (?, ?, ?, ?, ?)
    `;
    return runQuery(query, [companyName, industry, contactName, phone, email]);
  }

  static async findById(id) {
    const query = `SELECT * FROM clients WHERE id = ?`;
    return getQuery(query, [id]);
  }

  static async findAll() {
    const query = `SELECT * FROM clients ORDER BY created_at DESC`;
    return allQuery(query);
  }

  static async search(searchTerm) {
    const query = `
      SELECT * FROM clients 
      WHERE company_name LIKE ? OR contact_name LIKE ? OR email LIKE ?
      ORDER BY created_at DESC
    `;
    const term = `%${searchTerm}%`;
    return allQuery(query, [term, term, term]);
  }

  static async update(id, companyName, industry, contactName, phone, email) {
    const query = `
      UPDATE clients
      SET company_name = ?, industry = ?, contact_name = ?, phone = ?, email = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    return runQuery(query, [companyName, industry, contactName, phone, email, id]);
  }

  static async delete(id) {
    const query = `DELETE FROM clients WHERE id = ?`;
    return runQuery(query, [id]);
  }
}

module.exports = ClientModel;
