/**
 * server.js
 * ---------
 * ScholarMatch — Node.js / Express Backend Entry Point
 *
 * Responsibilities:
 *   - Load environment variables
 *   - Connect to MongoDB
 *   - Configure middleware (CORS, JSON parsing)
 *   - Mount route handlers
 *   - Start the HTTP server
 */

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// ── Load .env before any other config references process.env ───────────────
dotenv.config();

// ── Connect to MongoDB ─────────────────────────────────────────────────────
connectDB();

// ── Initialise Express app ─────────────────────────────────────────────────
const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────
// Allow requests from the React frontend (Vite default: port 5173)
// In production replace "*" with your actual frontend origin.
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Parse incoming JSON request bodies
app.use(express.json());

// ── Health Check ───────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "healthy",
    service: "ScholarMatch Backend",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ─────────────────────────────────────────────────────────────────
const recommendationRoutes = require("./routes/recommendations");
const statsRoutes = require("./routes/stats");
const historyRoutes = require("./routes/history");
const documentRoutes = require("./routes/documents");
const chatRoutes = require("./routes/chat"); // Phase 1: RAG chat

app.use("/api/recommendations", recommendationRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/chat", chatRoutes);

// ── 404 Handler (catch-all for undefined routes) ───────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ── Global Error Handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// ── Start Server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ScholarMatch backend running on http://localhost:${PORT}`);
  console.log(`📡 ML Service URL: ${process.env.ML_SERVICE_URL}`);
});
