// src/config/db.js
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ai_agent";

// Main async function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI); // modern Mongoose defaults handle parser & topology
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Named export
export { connectDB };

// Default export
export default connectDB;
