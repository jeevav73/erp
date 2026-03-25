const DashboardService = require('../services/DashboardService');
const { sendResponse, sendError } = require('../utils/apiResponse');

class DashboardController {
  static async getDashboardStats(req, res) {
    try {
      const stats = await DashboardService.getDashboardStats();
      return sendResponse(res, 200, stats, 'Dashboard stats retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getProjectStats(req, res) {
    try {
      const stats = await DashboardService.getProjectStats();
      return sendResponse(res, 200, stats, 'Project stats retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getTaskStats(req, res) {
    try {
      const stats = await DashboardService.getTaskStats();
      return sendResponse(res, 200, stats, 'Task stats retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getEmployeePerformance(req, res) {
    try {
      const performance = await DashboardService.getEmployeePerformance();
      return sendResponse(res, 200, performance, 'Employee performance retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getIndustryDistribution(req, res) {
    try {
      const distribution = await DashboardService.getIndustryDistribution();
      return sendResponse(res, 200, distribution, 'Industry distribution retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getProjectTimeline(req, res) {
    try {
      const timeline = await DashboardService.getProjectTimeline();
      return sendResponse(res, 200, timeline, 'Project timeline retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getContributionStats(req, res) {
    try {
      const stats = await DashboardService.getContributionStats();
      return sendResponse(res, 200, stats, 'Contribution stats retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getContentCounts(req, res) {
    try {
      const counts = await DashboardService.getContentCounts();
      return sendResponse(res, 200, counts, 'Content counts retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async getCampaignKPIs(req, res) {
    try {
      const { from, to } = req.query;
      const campaignId = req.params.campaignId;
      const kpi = await DashboardService.getCampaignKPIs(campaignId, from, to);
      return sendResponse(res, 200, kpi, 'Campaign KPI retrieved successfully');
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }
}

module.exports = DashboardController;
