const express = require('express');
const DashboardController = require('../controllers/DashboardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/stats', DashboardController.getDashboardStats);
router.get('/projects', DashboardController.getProjectStats);
router.get('/tasks', DashboardController.getTaskStats);
router.get('/employee-performance', DashboardController.getEmployeePerformance);
router.get('/industry-distribution', DashboardController.getIndustryDistribution);
router.get('/project-timeline', DashboardController.getProjectTimeline);
router.get('/contributions', DashboardController.getContributionStats);
router.get('/content-counts', DashboardController.getContentCounts);
router.get('/campaign-kpis/:campaignId', DashboardController.getCampaignKPIs);

module.exports = router;
