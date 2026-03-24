const express = require('express');
const AIController = require('../controllers/AIController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/generate', AIController.generateContent);
router.get('/history', AIController.getContentHistory);
router.get('/all', AIController.getAllContent);

module.exports = router;
