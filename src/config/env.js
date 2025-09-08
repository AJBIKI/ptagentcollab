import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 5000,

  mongo: {
    uri: process.env.MONGO_URI || "mongodb://localhost:27017/ai_agent",
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },

  email: {
    service: process.env.EMAIL_SERVICE || "gmail",
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
    dailySummaryTo:
      process.env.DAILY_SUMMARY_TO || process.env.EMAIL_USER || "",
  },

  cron: {
    timezone: process.env.TZ || "UTC",
    dailySummary: process.env.DAILY_SUMMARY_CRON || "0 9 * * *",
    deadlineCheck: process.env.DEADLINE_CHECK_CRON || "0 * * * *",
    calendarSync: process.env.CALENDAR_SYNC_CRON || "0 0 * * *",
  },
};