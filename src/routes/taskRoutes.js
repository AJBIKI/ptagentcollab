import { Router } from 'express';
import { getTasks } from '../services/taskService.js';

const router = Router();

router.get('/', async (req, res) => {
  const tasks = await getTasks();
  res.json(tasks);
});

export default router;
