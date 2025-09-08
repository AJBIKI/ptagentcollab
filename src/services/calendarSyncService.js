import { google } from "googleapis";
import Task from "../models/Task.js";
import connectDB from "../db/mongo.js";

export async function syncAllTasksToGoogleCalendar() {
  await connectDB();
  const tasks = await Task.find();

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  for (const task of tasks) {
    const allTasks = [
      ...task.subgoals.flatMap(sg => sg.tasks),
      ...task.additionalTasks
    ];

    for (const t of allTasks) {
      if (!t.deadline) continue;
      await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: t.title,
          start: { dateTime: new Date(t.deadline).toISOString() },
          end: { dateTime: new Date(new Date(t.deadline).getTime() + 60 * 60 * 1000).toISOString() },
        },
      });
    }
  }
}
