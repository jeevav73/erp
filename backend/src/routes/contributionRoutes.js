const express = require('express');
const router = express.Router();
const ContributionController = require('../controllers/ContributionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, ContributionController.create);
router.get('/', authMiddleware, ContributionController.list);
router.get('/:id', authMiddleware, ContributionController.getById);
router.put('/:id', authMiddleware, ContributionController.update);
router.delete('/:id', authMiddleware, ContributionController.remove);

module.exports = router;
