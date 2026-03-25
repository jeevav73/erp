const express = require('express');
const ContentController = require('../controllers/ContentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All content routes require authentication
router.use(authMiddleware);

router.post('/', ContentController.createContent);
router.get('/', ContentController.getAllContent);
router.get('/stats', ContentController.getContentStats);
router.get('/type/:contentType', ContentController.getContentByType);
router.get('/search', ContentController.searchContent);
router.get('/:id', ContentController.getContent);
router.delete('/:id', ContentController.deleteContent);

module.exports = router;
