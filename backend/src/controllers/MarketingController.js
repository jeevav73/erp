const MarketingService = require('../services/MarketingService');
const { sendResponse, sendError } = require('../utils/apiResponse');

class MarketingController {
  static async createCampaign(req, res) {
    try {
      const { campaignName, campaignType, startDate, endDate, budget, description } = req.body;
      const createdBy = req.user.id;

      if (!campaignName) {
        return sendError(res, 400, 'Campaign name is required');
      }

      const result = await MarketingService.createCampaign(campaignName, campaignType, startDate, endDate, budget, description, createdBy);
      return sendResponse(res, 201, result, 'Campaign created successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getAllCampaigns(req, res) {
    try {
      const campaigns = await MarketingService.getAllCampaigns();
      return sendResponse(res, 200, campaigns, 'Campaigns retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getCampaign(req, res) {
    try {
      const { id } = req.params;
      const campaign = await MarketingService.getCampaignById(id);
      return sendResponse(res, 200, campaign, 'Campaign retrieved successfully');
    } catch (error) {
      return sendError(res, 404, error.message);
    }
  }

  static async updateCampaign(req, res) {
    try {
      const { id } = req.params;
      const { campaignName, campaignType, startDate, endDate, budget, status, description } = req.body;

      if (!campaignName) {
        return sendError(res, 400, 'Campaign name is required');
      }

      const result = await MarketingService.updateCampaign(id, campaignName, campaignType, startDate, endDate, budget, status, description);
      return sendResponse(res, 200, result, 'Campaign updated successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async addPerformanceMetric(req, res) {
    try {
      const { campaignId } = req.params;
      const { metricName, metricValue, metricDate, conversions, leads, roi } = req.body;

      if (!metricName) {
        return sendError(res, 400, 'Metric name is required');
      }

      const result = await MarketingService.addPerformanceMetric(campaignId, metricName, metricValue, metricDate, conversions, leads, roi);
      return sendResponse(res, 201, result, 'Performance metric added successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getCampaignPerformance(req, res) {
    try {
      const { id } = req.params;
      const performance = await MarketingService.getCampaignPerformance(id);
      return sendResponse(res, 200, performance, 'Performance data retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async deleteCampaign(req, res) {
    try {
      const { id } = req.params;
      const result = await MarketingService.deleteCampaign(id);
      return sendResponse(res, 200, result, 'Campaign deleted successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getMarketingStats(req, res) {
    try {
      const stats = await MarketingService.getMarketingStats();
      return sendResponse(res, 200, stats, 'Marketing statistics retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }
}

module.exports = MarketingController;
