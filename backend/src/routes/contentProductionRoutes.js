const express = require('express');
const router = express.Router();
const ContentProductionController = require('../controllers/ContentProductionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, ContentProductionController.create);
router.get('/', authMiddleware, ContentProductionController.list);
router.get('/:id', authMiddleware, ContentProductionController.getById);
router.put('/:id', authMiddleware, ContentProductionController.update);
router.delete('/:id', authMiddleware, ContentProductionController.remove);

module.exports = router;
