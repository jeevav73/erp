const express = require('express');
const MarketingController = require('../controllers/MarketingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All marketing routes require authentication
router.use(authMiddleware);

router.post('/', MarketingController.createCampaign);
router.get('/', MarketingController.getAllCampaigns);
router.get('/stats', MarketingController.getMarketingStats);
router.get('/:id', MarketingController.getCampaign);
router.put('/:id', MarketingController.updateCampaign);
router.delete('/:id', MarketingController.deleteCampaign);

// Performance metrics
router.post('/:campaignId/performance', MarketingController.addPerformanceMetric);
router.get('/:id/performance', MarketingController.getCampaignPerformance);

module.exports = router;
