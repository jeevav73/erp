const { runQuery, allQuery, getQuery } = require('../database/connection');

class MarketingMetricsService {
  static async insertMetric(payload) {
    try {
      const q = `
        INSERT INTO marketing_performance_metrics
          (campaign_id, metric_date, impressions, clicks, conversions, leads, spend, ctr, cpc, roi)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        payload.campaign_id,
        payload.metric_date,
        payload.impressions || 0,
        payload.clicks || 0,
        payload.conversions || 0,
        payload.leads || 0,
        payload.spend || 0.0,
        payload.ctr || 0.0,
        payload.cpc || 0.0,
        payload.roi || 0.0
      ];
      const res = await runQuery(q, params);
      return { id: res.id, message: 'Metric inserted' };
    } catch (err) {
      throw new Error(`Failed to insert metric: ${err.message}`);
    }
  }

  static async getMetricsByCampaign(campaignId, from, to) {
    try {
      const q = `SELECT * FROM marketing_performance_metrics WHERE campaign_id = ?` +
        (from && to ? ' AND metric_date BETWEEN ? AND ?' : '') + ' ORDER BY metric_date';
      const params = from && to ? [campaignId, from, to] : [campaignId];
      const rows = await allQuery(q, params);
      return rows;
    } catch (err) {
      throw new Error(`Failed to get metrics: ${err.message}`);
    }
  }

  static async aggregateCampaign(campaignId, from, to) {
    try {
      const q = `
        SELECT campaign_id,
          SUM(impressions) AS impressions,
          SUM(clicks) AS clicks,
          SUM(conversions) AS conversions,
          SUM(leads) AS leads,
          SUM(spend) AS spend,
          (SUM(conversions) / NULLIF(SUM(clicks),0)) AS conv_rate,
          AVG(roi) AS avg_roi
        FROM marketing_performance_metrics
        WHERE campaign_id = ? AND metric_date BETWEEN ? AND ?
        GROUP BY campaign_id
      `;
      const rows = await allQuery(q, [campaignId, from, to]);
      return rows[0] || null;
    } catch (err) {
      throw new Error(`Failed to aggregate metrics: ${err.message}`);
    }
  }
}

module.exports = MarketingMetricsService;
