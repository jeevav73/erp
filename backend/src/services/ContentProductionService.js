const { runQuery, allQuery, getQuery } = require('../database/connection');

class ContentProductionService {
  static async create(payload) {
    try {
      const q = `
        INSERT INTO content_production
          (title, ai_content_id, content_type, body, client_id, project_id, campaign_id, created_by, assigned_to, status, scheduled_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        payload.title,
        payload.ai_content_id || null,
        payload.content_type || 'Other',
        payload.body || null,
        payload.client_id || null,
        payload.project_id || null,
        payload.campaign_id || null,
        payload.created_by || null,
        payload.assigned_to || null,
        payload.status || 'Draft',
        payload.scheduled_date || null
      ];
      const res = await runQuery(q, params);
      return { id: res.id, message: 'Content production created' };
    } catch (err) {
      throw new Error(`Failed to create content production: ${err.message}`);
    }
  }

  static async list() {
    try {
      const q = `
        SELECT cp.*, u.name AS creator, a.name AS assignee, cl.company_name AS client_name, p.title AS project_title, mc.campaign_name
        FROM content_production cp
        LEFT JOIN users u ON cp.created_by = u.id
        LEFT JOIN users a ON cp.assigned_to = a.id
        LEFT JOIN clients cl ON cp.client_id = cl.id
        LEFT JOIN projects p ON cp.project_id = p.id
        LEFT JOIN marketing_campaigns mc ON cp.campaign_id = mc.id
        ORDER BY cp.created_at DESC
      `;
      const rows = await allQuery(q);
      return rows;
    } catch (err) {
      throw new Error(`Failed to list content production: ${err.message}`);
    }
  }

  static async getById(id) {
    try {
      const q = `SELECT * FROM content_production WHERE id = ?`;
      const row = await getQuery(q, [id]);
      if (!row) throw new Error('Not found');
      return row;
    } catch (err) {
      throw new Error(`Failed to get content production: ${err.message}`);
    }
  }

  static async update(id, payload) {
    try {
      const q = `
        UPDATE content_production SET
          title = ?, ai_content_id = ?, content_type = ?, body = ?, client_id = ?, project_id = ?, campaign_id = ?, assigned_to = ?, status = ?, scheduled_date = ?, published_date = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      const params = [
        payload.title,
        payload.ai_content_id || null,
        payload.content_type || 'Other',
        payload.body || null,
        payload.client_id || null,
        payload.project_id || null,
        payload.campaign_id || null,
        payload.assigned_to || null,
        payload.status || 'Draft',
        payload.scheduled_date || null,
        payload.published_date || null,
        id
      ];
      await runQuery(q, params);
      return { message: 'Updated' };
    } catch (err) {
      throw new Error(`Failed to update content production: ${err.message}`);
    }
  }

  static async remove(id) {
    try {
      const q = 'DELETE FROM content_production WHERE id = ?';
      await runQuery(q, [id]);
      return { message: 'Deleted' };
    } catch (err) {
      throw new Error(`Failed to delete: ${err.message}`);
    }
  }
}

module.exports = ContentProductionService;
