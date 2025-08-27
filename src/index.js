import express from 'express';
import goalsRouter from './routes/goals.js';
import tasksRouter from './routes/tasks.js';
import taskRoutes from './routes/taskRoutes.js';
import { scheduleEmail } from './utils/email.js';

const app = express();
const PORT = Number(process.env.PORT);
const portToUse = Number.isInteger(PORT) && PORT > 0 ? PORT : 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Mount routers
app.use('/api/goals', goalsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/task-routes', taskRoutes);

app.get('/', (req, res) => {
  res.send('AI Goal Planner API is running!');
});

app.listen(portToUse, () => {
  console.log(`✅ Server is running on http://localhost:${portToUse}`);
  const emoji = "showEmoji" ? '✅ ' : '';
  console.log(`${emoji}Server is running on http://localhost:${PORT}`);
  
  // Example of scheduling a recurring email when the server starts
  // Sends an email every Monday at 9 AM.
  // console.log('🕒 Scheduling weekly summary email...');
  // scheduleEmail(
  //   '0 9 * * 1', 
  //   'admin@example.com', 
  //   'Weekly Report', 
  //   'This is your automated weekly report.'
  // );
});