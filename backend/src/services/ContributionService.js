const { runQuery, allQuery, getQuery } = require('../database/connection');

class ContributionService {
  static async createContribution(payload) {
    try {
      const query = `
        INSERT INTO contributions
        (title, description, contribution_type, source, ai_generated, ai_content_id, campaign_id, project_id, client_id, created_by, assigned_to, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        payload.title,
        payload.description || null,
        payload.contribution_type || 'Other',
        payload.source || 'Content',
        payload.ai_generated ? 1 : 0,
        payload.ai_content_id || null,
        payload.campaign_id || null,
        payload.project_id || null,
        payload.client_id || null,
        payload.created_by || null,
        payload.assigned_to || null,
        payload.status || 'Draft'
      ];
      const result = await runQuery(query, params);
      return { id: result.id, message: 'Contribution created successfully' };
    } catch (error) {
      throw new Error(`Failed to create contribution: ${error.message}`);
    }
  }

  static async getAllContributions() {
    try {
      const query = `
        SELECT c.*, u.name as created_by_name, a.name as assigned_to_name, cl.company_name as client_name, p.title as project_title, mc.campaign_name
        FROM contributions c
        LEFT JOIN users u ON c.created_by = u.id
        LEFT JOIN users a ON c.assigned_to = a.id
        LEFT JOIN clients cl ON c.client_id = cl.id
        LEFT JOIN projects p ON c.project_id = p.id
        LEFT JOIN marketing_campaigns mc ON c.campaign_id = mc.id
        ORDER BY c.created_at DESC
      `;
      const rows = await allQuery(query);
      return rows;
    } catch (error) {
      throw new Error(`Failed to retrieve contributions: ${error.message}`);
    }
  }

  static async getContributionById(id) {
    try {
      const query = `
        SELECT c.*, u.name as created_by_name, a.name as assigned_to_name
        FROM contributions c
        LEFT JOIN users u ON c.created_by = u.id
        LEFT JOIN users a ON c.assigned_to = a.id
        WHERE c.id = ?
      `;
      const row = await getQuery(query, [id]);
      if (!row) throw new Error('Contribution not found');
      return row;
    } catch (error) {
      throw new Error(`Failed to retrieve contribution: ${error.message}`);
    }
  }

  static async updateContribution(id, payload) {
    try {
      const query = `
        UPDATE contributions SET
          title = ?,
          description = ?,
          contribution_type = ?,
          source = ?,
          ai_generated = ?,
          ai_content_id = ?,
          campaign_id = ?,
          project_id = ?,
          client_id = ?,
          assigned_to = ?,
          status = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      const params = [
        payload.title,
        payload.description || null,
        payload.contribution_type || 'Other',
        payload.source || 'Content',
        payload.ai_generated ? 1 : 0,
        payload.ai_content_id || null,
        payload.campaign_id || null,
        payload.project_id || null,
        payload.client_id || null,
        payload.assigned_to || null,
        payload.status || 'Draft',
        id
      ];
      await runQuery(query, params);
      return { message: 'Contribution updated successfully' };
    } catch (error) {
      throw new Error(`Failed to update contribution: ${error.message}`);
    }
  }

  static async deleteContribution(id) {
    try {
      const query = 'DELETE FROM contributions WHERE id = ?';
      await runQuery(query, [id]);
      return { message: 'Contribution deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete contribution: ${error.message}`);
    }
  }
}

module.exports = ContributionService;
