/**
 * config/db.js
 * ------------
 * Establishes and exports the Mongoose connection to MongoDB.
 * Called once from server.js before the HTTP listener starts.
 */

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Exit the process — no point running the server without a database
    process.exit(1);
  }
};

module.exports = connectDB;
