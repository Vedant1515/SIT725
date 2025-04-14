import express from 'express';
import projectController from '../controllers/projectController.js';

const router = express.Router();

// routes
router.get('/projects', projectController.getAllProjects);
router.post('/projects', projectController.createProject);
router.delete('/projects/:id', projectController.deleteProject);

export default router;
