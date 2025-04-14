import Project from '../models/Project.js';

const projectController = {
  // Get all projects
  getAllProjects: async (req, res) => {
    try {
      const projects = await Project.find();
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Create a new project
  createProject: async (req, res) => {
    try {
      const project = new Project(req.body);
      const savedProject = await project.save();
      res.status(201).json(savedProject);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Delete a project
  deleteProject: async (req, res) => {
    try {
      const deletedProject = await Project.findByIdAndDelete(req.params.id);
      if (!deletedProject) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json({ message: 'Project deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default projectController;
