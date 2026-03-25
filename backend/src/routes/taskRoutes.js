const express = require('express');
const TaskController = require('../controllers/TaskController');
const authMiddleware = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', checkRole(['Admin','Manager']), TaskController.createTask);
router.get('/', checkRole(['Admin','Manager']), TaskController.getAllTasks);
router.get('/status', TaskController.getTasksByStatus);
router.get('/project/:projectId', TaskController.getTasksByProject);
router.get('/user/:userId', TaskController.getTasksByUser);
router.get('/:id', TaskController.getTask);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', checkRole(['Admin','Manager']), TaskController.deleteTask);

module.exports = router;
