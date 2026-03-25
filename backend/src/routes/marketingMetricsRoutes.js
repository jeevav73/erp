const express = require('express');
const router = express.Router();
const MarketingMetricsController = require('../controllers/MarketingMetricsController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, MarketingMetricsController.insert);
router.get('/campaign/:campaignId', authMiddleware, MarketingMetricsController.getByCampaign);
router.get('/campaign/:campaignId/aggregate', authMiddleware, MarketingMetricsController.aggregate);

module.exports = router;
