import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/mongo.js";
import goalsRouter from "./routes/goals.js";
import tasksRouter from "./routes/tasks.js";
import taskRoutes from "./routes/taskRoutes.js";
import { startSchedulers } from "./scheduler/index.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/goals", goalsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/task-routes", taskRoutes);

app.get("/", (_req, res) => {
  res.send("AI Task Planner with MongoDB is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  startSchedulers();
});
