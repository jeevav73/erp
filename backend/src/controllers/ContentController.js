const ContentService = require('../services/ContentService');
const { sendResponse, sendError } = require('../utils/apiResponse');

class ContentController {
  static async createContent(req, res) {
    try {
      const { topic, contentType, generatedContent } = req.body;
      const createdBy = req.user.id;

      if (!topic || !contentType || !generatedContent) {
        return sendError(res, 400, 'Topic, content type, and generated content are required');
      }

      const result = await ContentService.createContent(topic, contentType, generatedContent, createdBy);
      return sendResponse(res, 201, result, 'Content created successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getAllContent(req, res) {
    try {
      const content = await ContentService.getAllContent();
      return sendResponse(res, 200, content, 'Content retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getContent(req, res) {
    try {
      const { id } = req.params;
      const content = await ContentService.getContentById(id);
      return sendResponse(res, 200, content, 'Content retrieved successfully');
    } catch (error) {
      return sendError(res, 404, error.message);
    }
  }

  static async getContentByType(req, res) {
    try {
      const { contentType } = req.params;
      const content = await ContentService.getContentByType(contentType);
      return sendResponse(res, 200, content, `${contentType} content retrieved successfully`);
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async searchContent(req, res) {
    try {
      const { q } = req.query;
      const content = await ContentService.searchContent(q || '');
      return sendResponse(res, 200, content, 'Content search results retrieved');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async deleteContent(req, res) {
    try {
      const { id } = req.params;
      const result = await ContentService.deleteContent(id);
      return sendResponse(res, 200, result, 'Content deleted successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getContentStats(req, res) {
    try {
      const stats = await ContentService.getContentStats();
      return sendResponse(res, 200, stats, 'Content statistics retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }
}

module.exports = ContentController;
