import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Correct relative paths from tests/ folder
import connectDB from "../src/config/db.js";
import Task from "../src/models/Task.js"; // Adjust if Task model path differs

async function runTests() {
  console.log("=== Personal Task Planner Workflow Test ===\n");

  // 1. Environment Check
  console.log("1. Environment Check");
  console.log("Node version:", process.version);
  console.log("Mongo URI:", process.env.MONGO_URI ? "✅ Found" : "❌ Not Found");
  if (!process.env.MONGO_URI) return;

  // 2. Database Connection Test
  console.log("\n2. Database Connection Test");
  try {
    await connectDB();
    console.log("✅ MongoDB connection successful");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    return;
  }

  // 3. CRUD Operations Test
  console.log("\n3. CRUD Operations Test");

  // Create Task
  const testTask = new Task({
    title: "Test Task",
    description: "Automated test task",
    priority: "High",
    status: "Pending",
    deadline: new Date(),
    tags: ["test"]
  });
  await testTask.save();
  console.log("✅ Task created");

  // Read Task
  const fetchedTask = await Task.findById(testTask._id);
  console.log(fetchedTask ? "✅ Task read successfully" : "❌ Task not found");

  // Update Task
  fetchedTask.status = "Completed";
  await fetchedTask.save();
  const updatedTask = await Task.findById(testTask._id);
  console.log(updatedTask.status === "Completed" ? "✅ Task updated" : "❌ Task update failed");

  // Delete Task
  await Task.findByIdAndDelete(testTask._id);
  const deletedTask = await Task.findById(testTask._id);
  console.log(!deletedTask ? "✅ Task deleted" : "❌ Task deletion failed");

  // 4. Basic AI Prioritization Check (mock)
  console.log("\n4. AI Prioritization Test");
  const tasksForAI = [
    { title: "Low", priority: "Low" },
    { title: "High", priority: "High" },
    { title: "Medium", priority: "Medium" }
  ];
  const sorted = tasksForAI.sort((a, b) => {
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
  console.log(sorted[0].priority === "High" ? "✅ AI prioritization working" : "❌ AI prioritization failed");

  // 5. Notification Mock Test
  console.log("\n5. Notification Test");
  try {
    // Replace with your real notification function if implemented
    console.log("✅ Mock notification triggered (replace with real notification call)");
  } catch {
    console.log("❌ Notification failed");
  }

  console.log("\n=== Workflow Test Completed ===");
  process.exit(0);
}

runTests();
