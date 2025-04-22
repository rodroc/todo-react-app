import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.js';
import taskRoutes from './src/routes/tasks.js';
import { setupDB } from './src/db/setup.js';

dotenv.config({ path: '../local.env' })

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Todo API is running');
});

await setupDB()
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

