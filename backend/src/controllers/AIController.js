const AIService = require('../services/AIService');
const { sendResponse, sendError } = require('../utils/apiResponse');

class AIController {
  static async generateContent(req, res) {
    try {
      const { topic, content_type } = req.body;
      const userId = req.user?.id;

      if (!topic || !content_type) {
        return sendError(res, 400, 'Topic and content_type are required');
      }

      const aiService = new AIService();
      const result = await aiService.generateContent(topic, content_type, userId);
      return sendResponse(res, 200, result, 'Content generated successfully');
    } catch (error) {
      // Check for Gemini API quota errors
      if (error.message.includes('quota') || error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED')) {
        return sendError(res, 429, error.message);
      }
      return sendError(res, error.message.includes('Invalid content type') ? 400 : 500, error.message);
    }
  }

  static async getContentHistory(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, 401, 'User not authenticated');
      }

      const aiService = new AIService();
      const content = await aiService.getContentHistory(userId);
      return sendResponse(res, 200, content, 'Content history retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getAllContent(req, res) {
    try {
      const aiService = new AIService();
      const content = await aiService.getAllContent();
      return sendResponse(res, 200, content, 'All content retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }
}

module.exports = AIController;
