import dayjs from 'dayjs'
import { calendar, getOAuthClient, loadTokens } from '../config/google.js'

async function getClient() {
  const client = getOAuthClient()
  const ok = await loadTokens(client)
  if (!ok) return null
  return client
}

export async function upsertCalendarEvent(task) {
  const client = await getClient()
  if (!client) return null

  const cal = calendar(client)
  const start = dayjs(task.dueAt).toISOString()
  const end = dayjs(task.dueAt).add(30, 'minute').toISOString()

  const eventBody = {
    summary: task.title,
    description: task.description || '',
    start: { dateTime: start },
    end: { dateTime: end }
  }

  if (task.calendarEventId) {
    const updated = await cal.events.update({
      calendarId: 'primary',
      eventId: task.calendarEventId,
      requestBody: eventBody
    })
    return updated.data.id
  } else {
    const created = await cal.events.insert({
      calendarId: 'primary',
      requestBody: eventBody
    })
    return created.data.id
  }
}

export async function deleteCalendarEvent(task) {
  const client = await getClient()
  if (!client || !task.calendarEventId) return
  const cal = calendar(client)
  await cal.events.delete({ calendarId: 'primary', eventId: task.calendarEventId })
}
