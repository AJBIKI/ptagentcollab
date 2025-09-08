// server.js
import express from "express";
import mongoose from "mongoose";
import config from "./src/config/env.js";
import goalRoutes from "./src/routes/goalRoutes.js";
import { startSchedulers } from "./src/scheduler/index.js";

const app = express();
app.use(express.json());

// MongoDB connection
mongoose
  .connect(config.mongo.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/goals", goalRoutes);

app.get("/", (req, res) => {
  res.send("🚀 AI Task Planner Agent API is running");
});

// Start server
app.listen(config.port, () => {
  console.log(`✅ Server running on http://localhost:${config.port}`);

  // Start schedulers (daily summary, deadline reminders, calendar sync)
  startSchedulers();
});
