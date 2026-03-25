const { runQuery, allQuery, getQuery } = require('../database/connection');

class MarketingService {
  // Create campaign
  static async createCampaign(campaignName, campaignType, startDate, endDate, budget, description, createdBy) {
    try {
      const query = `
        INSERT INTO marketing_campaigns (campaign_name, campaign_type, start_date, end_date, budget, description, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const result = await runQuery(query, [campaignName, campaignType, startDate, endDate, budget, description, createdBy]);
      return {
        id: result.id,
        campaignName,
        message: 'Campaign created successfully'
      };
    } catch (error) {
      throw new Error(`Failed to create campaign: ${error.message}`);
    }
  }

  // Get all campaigns
  static async getAllCampaigns() {
    try {
      const query = `
        SELECT mc.*, u.name as created_by_name,
        COUNT(mp.id) as performance_metrics_count,
        SUM(mp.conversions) as total_conversions,
        SUM(mp.leads) as total_leads,
        AVG(mp.roi) as avg_roi
        FROM marketing_campaigns mc
        LEFT JOIN users u ON mc.created_by = u.id
        LEFT JOIN marketing_performance mp ON mc.id = mp.campaign_id
        GROUP BY mc.id
        ORDER BY mc.created_at DESC
      `;
      const campaigns = await allQuery(query);
      return campaigns;
    } catch (error) {
      throw new Error(`Failed to retrieve campaigns: ${error.message}`);
    }
  }

  // Get campaign by ID with performance data
  static async getCampaignById(id) {
    try {
      const query = `
        SELECT mc.*, u.name as created_by_name
        FROM marketing_campaigns mc
        LEFT JOIN users u ON mc.created_by = u.id
        WHERE mc.id = ?
      `;
      const campaign = await getQuery(query, [id]);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Get performance metrics for this campaign
      const performanceQuery = `
        SELECT * FROM marketing_performance
        WHERE campaign_id = ?
        ORDER BY metric_date DESC
      `;
      const performance = await allQuery(performanceQuery, [id]);
      campaign.performance = performance;

      return campaign;
    } catch (error) {
      throw new Error(`Failed to retrieve campaign: ${error.message}`);
    }
  }

  // Update campaign
  static async updateCampaign(id, campaignName, campaignType, startDate, endDate, budget, status, description) {
    try {
      const query = `
        UPDATE marketing_campaigns
        SET campaign_name = ?, campaign_type = ?, start_date = ?, end_date = ?, budget = ?, status = ?, description = ?
        WHERE id = ?
      `;
      await runQuery(query, [campaignName, campaignType, startDate, endDate, budget, status, description, id]);
      return { message: 'Campaign updated successfully' };
    } catch (error) {
      throw new Error(`Failed to update campaign: ${error.message}`);
    }
  }

  // Add performance metrics
  static async addPerformanceMetric(campaignId, metricName, metricValue, metricDate, conversions, leads, roi) {
    try {
      const query = `
        INSERT INTO marketing_performance (campaign_id, metric_name, metric_value, metric_date, conversions, leads, roi)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const result = await runQuery(query, [campaignId, metricName, metricValue, metricDate, conversions, leads, roi]);
      return {
        id: result.id,
        message: 'Performance metric added successfully'
      };
    } catch (error) {
      throw new Error(`Failed to add performance metric: ${error.message}`);
    }
  }

  // Get campaign performance
  static async getCampaignPerformance(campaignId) {
    try {
      const query = `
        SELECT * FROM marketing_performance
        WHERE campaign_id = ?
        ORDER BY metric_date DESC
      `;
      const performance = await allQuery(query, [campaignId]);
      return performance;
    } catch (error) {
      throw new Error(`Failed to retrieve performance data: ${error.message}`);
    }
  }

  // Delete campaign
  static async deleteCampaign(id) {
    try {
      const query = 'DELETE FROM marketing_campaigns WHERE id = ?';
      await runQuery(query, [id]);
      return { message: 'Campaign deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete campaign: ${error.message}`);
    }
  }

  // Get marketing statistics
  static async getMarketingStats() {
    try {
      const query = `
        SELECT 
          COUNT(DISTINCT mc.id) as total_campaigns,
          SUM(mc.budget) as total_budget,
          SUM(mp.conversions) as total_conversions,
          SUM(mp.leads) as total_leads,
          AVG(mp.roi) as average_roi,
          mc.status,
          COUNT(mc.id) as count_by_status
        FROM marketing_campaigns mc
        LEFT JOIN marketing_performance mp ON mc.id = mp.campaign_id
        GROUP BY mc.status
      `;
      const stats = await allQuery(query);
      return stats;
    } catch (error) {
      throw new Error(`Failed to get marketing stats: ${error.message}`);
    }
  }
}

module.exports = MarketingService;
