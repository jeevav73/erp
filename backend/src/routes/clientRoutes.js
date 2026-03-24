const express = require('express');
const ClientController = require('../controllers/ClientController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All client routes require authentication
router.use(authMiddleware);

router.post('/', ClientController.createClient);
router.get('/', ClientController.getAllClients);
router.get('/search', ClientController.searchClients);
router.get('/:id', ClientController.getClient);
router.put('/:id', ClientController.updateClient);
router.delete('/:id', ClientController.deleteClient);

module.exports = router;
