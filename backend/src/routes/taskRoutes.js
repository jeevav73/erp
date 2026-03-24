const express = require('express');
const TaskController = require('../controllers/TaskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', TaskController.createTask);
router.get('/', TaskController.getAllTasks);
router.get('/status', TaskController.getTasksByStatus);
router.get('/project/:projectId', TaskController.getTasksByProject);
router.get('/user/:userId', TaskController.getTasksByUser);
router.get('/:id', TaskController.getTask);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

module.exports = router;
