const { runQuery, allQuery, getQuery } = require('../database/connection');

class ContentService {
  // Create new content
  static async createContent(topic, contentType, generatedContent, createdBy) {
    try {
      const query = `
        INSERT INTO ai_content (topic, content_type, generated_content, created_by)
        VALUES (?, ?, ?, ?)
      `;
      const result = await runQuery(query, [topic, contentType, generatedContent, createdBy]);
      return {
        id: result.id,
        topic,
        contentType,
        message: 'Content created successfully'
      };
    } catch (error) {
      throw new Error(`Failed to create content: ${error.message}`);
    }
  }

  // Get all content
  static async getAllContent() {
    try {
      const query = `
        SELECT ac.*, u.name as created_by_name
        FROM ai_content ac
        LEFT JOIN users u ON ac.created_by = u.id
        ORDER BY ac.created_at DESC
      `;
      const content = await allQuery(query);
      return content;
    } catch (error) {
      throw new Error(`Failed to retrieve content: ${error.message}`);
    }
  }

  // Get content by ID
  static async getContentById(id) {
    try {
      const query = `
        SELECT ac.*, u.name as created_by_name
        FROM ai_content ac
        LEFT JOIN users u ON ac.created_by = u.id
        WHERE ac.id = ?
      `;
      const content = await getQuery(query, [id]);
      if (!content) {
        throw new Error('Content not found');
      }
      return content;
    } catch (error) {
      throw new Error(`Failed to retrieve content: ${error.message}`);
    }
  }

  // Get content by type
  static async getContentByType(contentType) {
    try {
      const query = `
        SELECT ac.*, u.name as created_by_name
        FROM ai_content ac
        LEFT JOIN users u ON ac.created_by = u.id
        WHERE ac.content_type = ?
        ORDER BY ac.created_at DESC
      `;
      const content = await allQuery(query, [contentType]);
      return content;
    } catch (error) {
      throw new Error(`Failed to retrieve content: ${error.message}`);
    }
  }

  // Search content
  static async searchContent(searchTerm) {
    try {
      const query = `
        SELECT ac.*, u.name as created_by_name
        FROM ai_content ac
        LEFT JOIN users u ON ac.created_by = u.id
        WHERE ac.topic LIKE ? OR ac.generated_content LIKE ?
        ORDER BY ac.created_at DESC
      `;
      const searchPattern = `%${searchTerm}%`;
      const content = await allQuery(query, [searchPattern, searchPattern]);
      return content;
    } catch (error) {
      throw new Error(`Failed to search content: ${error.message}`);
    }
  }

  // Delete content
  static async deleteContent(id) {
    try {
      const query = 'DELETE FROM ai_content WHERE id = ?';
      await runQuery(query, [id]);
      return { message: 'Content deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete content: ${error.message}`);
    }
  }

  // Get content statistics
  static async getContentStats() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_content,
          content_type,
          COUNT(*) as count_by_type
        FROM ai_content
        GROUP BY content_type
      `;
      const stats = await allQuery(query);
      return stats;
    } catch (error) {
      throw new Error(`Failed to get content stats: ${error.message}`);
    }
  }
}

module.exports = ContentService;
