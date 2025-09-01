import { Router } from 'express'
import { db } from '../db.js'
import { nanoid } from 'nanoid'
import dayjs from 'dayjs'
import { upsertCalendarEvent, deleteCalendarEvent } from '../services/calendarService.js'

const router = Router()

// Create task
router.post('/', async (req, res) => {
  try {
    const { title, description, dueAt, email, reminders = [ { minutesBefore: 30 } ] } = req.body
    if (!title || !dueAt) return res.status(400).json({ error: 'title and dueAt required' })

    const task = {
      id: nanoid(),
      title,
      description: description || '',
      dueAt: dayjs(dueAt).toISOString(),
      email: email || null,               // where reminders go
      reminders: reminders.map(r => ({ minutesBefore: Number(r.minutesBefore || 30), sent: false })),
      completed: false,
      calendarEventId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Save first (so ID exists)
    db.data.tasks.push(task)
    await db.write()

    // Try to sync to Google Calendar (if authorized)
    const eventId = await upsertCalendarEvent(task)
    if (eventId) {
      task.calendarEventId = eventId
      await db.write()
    }

    res.status(201).json(task)
  } catch (e) {
    res.status(500).json({ error: 'create_failed' })
  }
})

// List tasks
router.get('/', (_req, res) => {
  res.json(db.data.tasks)
})

// Get one
router.get('/:id', (req, res) => {
  const task = db.data.tasks.find(t => t.id === req.params.id)
  if (!task) return res.status(404).json({ error: 'not_found' })
  res.json(task)
})

// Update
router.put('/:id', async (req, res) => {
  const task = db.data.tasks.find(t => t.id === req.params.id)
  if (!task) return res.status(404).json({ error: 'not_found' })
  const { title, description, dueAt, email, reminders, completed } = req.body

  if (title !== undefined) task.title = title
  if (description !== undefined) task.description = description
  if (email !== undefined) task.email = email
  if (completed !== undefined) task.completed = !!completed
  if (dueAt !== undefined) task.dueAt = dayjs(dueAt).toISOString()
  if (Array.isArray(reminders)) {
    task.reminders = reminders.map(r => ({ minutesBefore: Number(r.minutesBefore || 30), sent: false }))
  }
  task.updatedAt = new Date().toISOString()
  await db.write()

  const eventId = await upsertCalendarEvent(task)
  if (eventId) {
    task.calendarEventId = eventId
    await db.write()
  }

  res.json(task)
})

// Delete
router.delete('/:id', async (req, res) => {
  const idx = db.data.tasks.findIndex(t => t.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'not_found' })
  const [task] = db.data.tasks.splice(idx, 1)
  await db.write()
  await deleteCalendarEvent(task)
  res.json({ ok: true })
})

export default router
