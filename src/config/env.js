import dotenv from "dotenv";
dotenv.config();

function requireEnv(name) {
  if (!process.env[name]) {
    throw new Error(`❌ Missing required environment variable: ${name}`);
  }
  return process.env[name];
}

export default {
  port: process.env.PORT || 5000,

  mongo: {
    uri:
      process.env.MONGO_URI ||
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}` +
      `@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
  },

  google: {
    clientId: requireEnv("GOOGLE_CLIENT_ID"),
    clientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
    redirectUri: requireEnv("GOOGLE_REDIRECT_URI"),
    refreshToken: requireEnv("GOOGLE_REFRESH_TOKEN"),
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

  apikey: {
    openai: requireEnv("OPENAI_API_KEY"),
  },
};
