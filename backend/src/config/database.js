// backend/src/config/database.js
import mongoose from "mongoose";

/**
 * Connect to MongoDB database
 */
export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("FATAL: MONGODB_URI environment variable is NOT set.");
    throw new Error("MONGODB_URI is required");
  }

  // Log a masked version (so you can see which cluster is used but not the password)
  try {
    const masked = mongoUri.replace(/(^.*:\/\/.*:)(.*)(@.*$)/, "$1*****$3");
    console.log("Attempting to connect to MongoDB...");
    console.log(`(masked) MONGODB_URI: ${masked}`);
  } catch (e) {
    console.log("Attempting to connect to MongoDB (unable to mask URI in logs).");
  }

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Ensures the DB name if not provided in the URI
      dbName: process.env.MONGODB_DBNAME || "truestate",
      serverSelectionTimeoutMS: 10000, // 10s
    });

    console.log("✅ MongoDB connected successfully.");
    console.log(`✅ Database: ${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (err) {
    // Log useful error text for Render logs (do NOT print the URI or password)
    console.error("❌ MongoDB connection error:", err && err.message ? err.message : err);
    throw err;
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDatabase() {
  await mongoose.disconnect();
  console.log("✅ Disconnected from MongoDB");
}
