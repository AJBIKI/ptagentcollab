import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  mainGoal: { type: String, required: true },
  subgoals: [
    {
      title: String,
      tasks: [
        {
          title: String,
          source: { type: String, enum: ["user", "ai"], default: "ai" },
          deadline: Date,
          completed: { type: Boolean, default: false }
        }
      ]
    }
  ],
  additionalTasks: [
    {
      title: String,
      source: { type: String, enum: ["user", "ai"], default: "ai" },
      deadline: Date,
      completed: { type: Boolean, default: false }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Task", TaskSchema);
