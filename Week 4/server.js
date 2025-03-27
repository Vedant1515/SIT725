const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (auto-creates 'projectGallery' on first insert)
mongoose.connect('mongodb://127.0.0.1:27017/projectGallery')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Project Schema
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  link: String,
  imageId: { type: Number, default: () => Math.floor(Math.random() * 1000) }
}, {
  toJSON: { virtuals: true }, // Ensure virtuals are included in API responses
  toObject: { virtuals: true }
});

// Virtual for dynamic image URL
ProjectSchema.virtual('imageUrl').get(function() {
  return `https://picsum.photos/id/${this.imageId}/300/200`;
});

const Project = mongoose.model('Project', ProjectSchema);

// API Routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add this to your server.js
app.delete('/api/projects/:id', async (req, res) => {
  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ 
      message: 'Project deleted successfully',
      deletedId: req.params.id 
    });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Server error while deleting project' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));