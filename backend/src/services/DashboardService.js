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
}

module.exports = DashboardService;
