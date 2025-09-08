// /src/scheduler/index.js
import cron from "node-cron";
import Task from "../models/Task.js";
import { sendEmail, formatTasksText } from "../utils/email.js";
import { syncAllTasksToGoogleCalendar } from "../services/calendarSyncService.js";
import config from "../config/env.js";

function normalizeDeadline(task) {
  if (!task.dueDate) return null;
  const dt = new Date(task.dueDate);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function tasksDueToday(tasks, now = new Date()) {
  const y = now.getUTCFullYear(),
    m = now.getUTCMonth(),
    d = now.getUTCDate();
  const start = new Date(Date.UTC(y, m, d, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, d, 23, 59, 59));
  return tasks.filter((t) => {
    const due = normalizeDeadline(t);
    return due && due >= start && due <= end;
  });
}

function tasksDueInNext24h(tasks, now = new Date()) {
  const end = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return tasks.filter((t) => {
    const due = normalizeDeadline(t);
    return due && due > now && due <= end;
  });
}

export function startSchedulers() {
  // Daily summary
  cron.schedule(
    config.cron.dailySummary,
    async () => {
      try {
        const tasks = await Task.find({ completed: false });
        const today = tasksDueToday(tasks);
        if (today.length > 0) {
          const subject = "Daily Task Summary";
          const text = formatTasksText(today, "Today’s Tasks");
          await sendEmail({
            to: config.email.dailySummaryTo,
            subject,
            text,
          });
          console.log("📧 Daily summary email sent");
        }
      } catch (err) {
        console.warn("❌ Daily summary failed:", err?.message || err);
      }
    },
    { timezone: config.cron.timezone }
  );

  // Deadline reminders (24h before)
  cron.schedule(
    config.cron.deadlineCheck,
    async () => {
      try {
        const tasks = await Task.find({ completed: false });
        const upcoming = tasksDueInNext24h(tasks);
        if (upcoming.length > 0) {
          const subject = "Upcoming Deadlines (next 24 hours)";
          const text = formatTasksText(upcoming, "Next 24 Hours");
          await sendEmail({
            to: config.email.dailySummaryTo,
            subject,
            text,
          });
          console.log("📧 24h deadline reminder sent");
        }
      } catch (err) {
        console.warn("❌ Deadline reminder failed:", err?.message || err);
      }
    },
    { timezone: config.cron.timezone }
  );

  // Google Calendar sync (nightly)
  cron.schedule(
    config.cron.calendarSync,
    async () => {
      try {
        await syncAllTasksToGoogleCalendar();
        console.log("📅 Google Calendar sync completed");
      } catch (err) {
        console.warn("❌ Calendar sync failed:", err?.message || err);
      }
    },
    { timezone: config.cron.timezone }
  );
}