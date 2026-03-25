const MarketingMetricsService = require('../services/MarketingMetricsService');

class MarketingMetricsController {
  static async insert(req, res, next) {
    try {
      const payload = req.body;
      const result = await MarketingMetricsService.insertMetric(payload);
      res.json({ statusCode: 200, data: result, message: 'Inserted', success: true });
    } catch (err) {
      next(err);
    }
  }

  static async getByCampaign(req, res, next) {
    try {
      const campaignId = req.params.campaignId;
      const { from, to } = req.query;
      const rows = await MarketingMetricsService.getMetricsByCampaign(campaignId, from, to);
      res.json({ statusCode: 200, data: rows, message: 'OK', success: true });
    } catch (err) {
      next(err);
    }
  }

  static async aggregate(req, res, next) {
    try {
      const campaignId = req.params.campaignId;
      const { from, to } = req.query;
      const row = await MarketingMetricsService.aggregateCampaign(campaignId, from, to);
      res.json({ statusCode: 200, data: row, message: 'OK', success: true });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MarketingMetricsController;
