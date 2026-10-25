
import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./src/config/db.js";
import { ensureAdmin } from "./src/utils/ensureAdmin.js";

import authRoutes from "./src/routes/auth.routes.js";
import contentRoutes from "./src/routes/content.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import collectionRoutes from "./src/routes/collection.routes.js";

const app = express();

const port = Number(process.env.PORT) || 5000;

const allowedOrigins = (
  process.env.CLIENT_ORIGIN || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Portfolio Admin API is running",
    database:
      connectDBStatus(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", collectionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("API error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Database status helper
import mongoose from "mongoose";

function connectDBStatus() {
  return mongoose.connection.readyState === 1
    ? "connected"
    : "disconnected";
}

// Start server only after database connection
try {
  await connectDB();

  await ensureAdmin();

  app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
  });
} catch (error) {
  console.error("Server startup failed:", error.message);
  process.exit(1);
}
