// backend/src/config/database.js
import mongoose from "mongoose";

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("FATAL: MONGODB_URI environment variable is NOT set.");
    throw new Error("MONGODB_URI is required");
  }

  try {
    const masked = mongoUri.replace(/(^.*:\/\/.*:)(.*)(@.*$)/, "$1*****$3");
    console.log("Attempting to connect to MongoDB...");
    console.log(`(masked) MONGODB_URI: ${masked}`);
  } catch (e) {
    console.log("Attempting to connect to MongoDB (unable to mask URI in logs).");
  }

  try {
    mongoose.set("strictQuery", false);
    // <-- UPDATED: removed legacy options here
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DBNAME || "truestate",
      serverSelectionTimeoutMS: 10000
    });

    console.log("✅ MongoDB connected successfully.");
    console.log(`✅ Database: ${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err && err.message ? err.message : err);
    throw err;
  }
}
