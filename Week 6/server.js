import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import projectRoutes from './routes/projectRoutes.js';

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', projectRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Export for testing
export default app;
