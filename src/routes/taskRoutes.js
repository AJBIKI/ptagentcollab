import { Router } from 'express';
import Task from '../models/Task.js';
import { upsertCalendarEvent, deleteCalendarEvent } from '../services/calendarSyncService.js';

const router = Router();

// Get all tasks
router.get('/', async (_req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();

    // Sync with Google Calendar if due date exists
    if (task.dueDate) {
      task.calendarEventId = await upsertCalendarEvent(task);
      await task.save();
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Sync updated info with Google Calendar
    if (task.dueDate) {
      task.calendarEventId = await upsertCalendarEvent(task);
      await task.save();
    }

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (task.calendarEventId) {
      await deleteCalendarEvent(task);
    }

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
