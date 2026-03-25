const { getQuery, allQuery } = require('../database/connection');

class DashboardService {
  static async getDashboardStats() {
    try {
      // Total Clients
      const clientCount = await getQuery('SELECT COUNT(*) as count FROM clients');
      
      // Active Projects
      const activeProjects = await getQuery(
        'SELECT COUNT(*) as count FROM projects WHERE status IN ("Pending", "In Progress")'
      );
      
      // Completed Tasks
      const completedTasks = await getQuery(
        'SELECT COUNT(*) as count FROM tasks WHERE status = "Completed"'
      );

      // Total Tasks
      const totalTasks = await getQuery('SELECT COUNT(*) as count FROM tasks');

      // Total Users
      const totalUsers = await getQuery('SELECT COUNT(*) as count FROM users');

      return {
        total_clients: clientCount.count,
        active_projects: activeProjects.count,
        completed_tasks: completedTasks.count,
        total_tasks: totalTasks.count,
        total_users: totalUsers.count
      };
    } catch (error) {
      throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
    }
  }

  static async getProjectStats() {
    try {
      const stats = await allQuery(`
        SELECT 
          status,
          COUNT(*) as count
        FROM projects
        GROUP BY status
      `);
      return stats;
    } catch (error) {
      throw new Error(`Failed to fetch project stats: ${error.message}`);
    }
  }

  static async getTaskStats() {
    try {
      const stats = await allQuery(`
        SELECT 
          status,
          COUNT(*) as count
        FROM tasks
        GROUP BY status
      `);
      return stats;
    } catch (error) {
      throw new Error(`Failed to fetch task stats: ${error.message}`);
    }
  }

  static async getEmployeePerformance() {
    try {
      const performance = await allQuery(`
        SELECT 
          u.id,
          u.name,
          COUNT(t.id) as total_tasks,
          SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks
        FROM users u
        LEFT JOIN tasks t ON u.id = t.assigned_to
        WHERE u.role = 'Employee'
        GROUP BY u.id, u.name
      `);
      return performance;
    } catch (error) {
      throw new Error(`Failed to fetch employee performance: ${error.message}`);
    }
  }

  static async getIndustryDistribution() {
    try {
      const distribution = await allQuery(`
        SELECT 
          industry,
          COUNT(*) as count
        FROM clients
        WHERE industry IS NOT NULL
        GROUP BY industry
      `);
      return distribution;
    } catch (error) {
      throw new Error(`Failed to fetch industry distribution: ${error.message}`);
    }
  }

  static async getProjectTimeline() {
    try {
      const timeline = await allQuery(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as projects_created
        FROM projects
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      `);
      return timeline;
    } catch (error) {
      throw new Error(`Failed to fetch project timeline: ${error.message}`);
    }
  }

  static async getContributionStats() {
    try {
      const stats = await allQuery(`
        SELECT status, COUNT(*) as count
        FROM contributions
        GROUP BY status
      `);
      return stats;
    } catch (error) {
      throw new Error(`Failed to fetch contribution stats: ${error.message}`);
    }
  }

  static async getContentCounts() {
    try {
      const aiCounts = await allQuery(`
        SELECT content_type, COUNT(*) as count
        FROM ai_content
        GROUP BY content_type
      `);

      const productionCounts = await allQuery(`
        SELECT content_type, COUNT(*) as count
        FROM content_production
        GROUP BY content_type
      `);

      return { ai_counts: aiCounts, production_counts: productionCounts };
    } catch (error) {
      throw new Error(`Failed to fetch content counts: ${error.message}`);
    }
  }

  static async getCampaignKPIs(campaignId, from, to) {
    try {
      const params = [campaignId];
      let dateFilter = '';
      if (from && to) {
        dateFilter = ' AND metric_date BETWEEN ? AND ?';
        params.push(from, to);
      }

      const q = `
        SELECT mc.id, mc.campaign_name,
          SUM(mpm.impressions) AS impressions,
          SUM(mpm.clicks) AS clicks,
          SUM(mpm.conversions) AS conversions,
          SUM(mpm.leads) AS leads,
          SUM(mpm.spend) AS spend,
          AVG(mpm.roi) AS avg_roi
        FROM marketing_campaigns mc
        LEFT JOIN marketing_performance_metrics mpm ON mpm.campaign_id = mc.id ${dateFilter}
        WHERE mc.id = ?
        GROUP BY mc.id, mc.campaign_name
      `;
      const rows = await allQuery(q, params);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch campaign KPIs: ${error.message}`);
    }
  }
}

module.exports = DashboardService;
