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

module.exports = router;
