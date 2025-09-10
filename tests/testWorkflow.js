// tests/testWorkflow.js
import dotenv from "dotenv";
import connectDB from "../src/config/db.js";
import Task from "../src/models/Task.js";
import * as emailUtils from "../src/utils/email.js";
import { syncAllTasksToGoogleCalendar } from "../src/services/calendarSyncService.js";

dotenv.config();

console.log("=== Personal Task Planner Workflow Test ===\n");

// -----------------------------
// 1. Environment Check
// -----------------------------
console.log("1. Environment Check");
console.log("Node version:", process.version);
console.log("Mongo URI:", process.env.MONGO_URI ? "✅ Found" : "❌ Missing");

// -----------------------------
// 2. Database Connection
// -----------------------------
console.log("\n2. Database Connection Test");
await connectDB();
console.log("✅ MongoDB connected");

// -----------------------------
// 3. Mocking External Services
// -----------------------------
console.log("\n3. Mocking external services");

// Mock email
const mockSendEmail = async ({ to, subject, text }) => {
  console.log(`📧 Mock Email -> ${to}\nSubject: ${subject}\nBody: ${text}\n`);
  return true;
};
const sendEmail = mockSendEmail;

// Mock Google Calendar
const mockSyncCalendar = async () => {
  console.log("📅 Mock Google Calendar sync completed");
  return true;
};

// -----------------------------
// 4. CRUD Operations
// -----------------------------
console.log("\n4. CRUD Operations Test");

try {
  // Create
  const task = await Task.create({
    mainGoal: "Test main goal",
    subgoals: [
      {
        title: "Subgoal 1",
        tasks: [
          { title: "Task 1", source: "user" },
          { title: "Task 2", source: "ai" }
        ]
      }
    ],
    additionalTasks: [{ title: "Extra Task", source: "ai" }]
  });
  console.log("✅ Created task:", task.mainGoal);

  // Read
  const found = await Task.findById(task._id);
  console.log("✅ Found task:", found.mainGoal);

  // Update
  found.subgoals[0].tasks[0].completed = true;
  await found.save();
  console.log("✅ Updated task -> marked completed");

  // Delete
  await Task.findByIdAndDelete(task._id);
  console.log("✅ Deleted task");

  // Mock notifications
  await sendEmail({
    to: "test@example.com",
    subject: "Workflow Notification",
    text: "This is a test workflow notification."
  });

  await mockSyncCalendar();
} catch (err) {
  console.error("❌ CRUD test failed:", err.message);
}

console.log("\n=== Workflow Test Completed ===");
process.exit(0);
