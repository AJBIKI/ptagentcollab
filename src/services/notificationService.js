import cron from 'node-cron'
import nodemailer from 'nodemailer'
import dayjs from 'dayjs'
import { db } from '../db.js'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text
  })
}

export function startScheduler() {
  // Every minute: find reminders that should fire now or are overdue by < 1 minute
  cron.schedule('* * * * *', async () => {
    const now = dayjs()
    for (const task of db.data.tasks) {
      if (task.completed) continue
      if (!task.reminders?.length) continue

      // userEmail could be per-user; here using task.email for demo
      const to = task.email
      if (!to) continue

      for (const r of task.reminders) {
        if (r.sent) continue
        const when = dayjs(task.dueAt).subtract(r.minutesBefore, 'minute')
        if (now.isAfter(when)) {
          try {
            await sendEmail(
              to,
              `Reminder: ${task.title}`,
              `Task "${task.title}" is due at ${dayjs(task.dueAt).format('YYYY-MM-DD HH:mm')}.`
            )
            r.sent = true
            await db.write()
          } catch (e) {
            // log and continue
          }
        }
      }
    }
  })
}
