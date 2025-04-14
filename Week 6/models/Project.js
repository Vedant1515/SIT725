import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: String
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
