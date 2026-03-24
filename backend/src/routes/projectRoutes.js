const express = require('express');
const ProjectController = require('../controllers/ProjectController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', ProjectController.createProject);
router.get('/', ProjectController.getAllProjects);
router.get('/status', ProjectController.getProjectsByStatus);
router.get('/client/:clientId', ProjectController.getProjectsByClient);
router.get('/:id', ProjectController.getProject);
router.put('/:id', ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);

module.exports = router;
