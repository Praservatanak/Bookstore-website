import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";

const connectDB = asyncHandler(async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
});

export { connectDB };
