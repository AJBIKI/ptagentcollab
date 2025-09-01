import express from 'express';
import goalsRouter from './routes/goals.js';
import tasksRouter from './routes/tasks.js';
import taskRoutes from './routes/taskRoutes.js';
import { scheduleEmail } from './utils/email.js';

const app = express();
const PORT = process.env.PORT && Number(process.env.PORT) > 0 ? Number(process.env.PORT) : 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/goals', goalsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/task-routes', taskRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('AI Goal Planner API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
