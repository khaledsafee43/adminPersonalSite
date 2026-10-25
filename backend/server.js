import "dotenv/config";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import connectDB from "./src/config/db.js";
import { ensureAdmin } from "./src/utils/ensureAdmin.js";

import authRoutes from "./src/routes/auth.routes.js";
import contentRoutes from "./src/routes/content.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import collectionRoutes from "./src/routes/collection.routes.js";

const app = express();
const port = Number(process.env.PORT) || 5000;

// Allowed frontend origins
const allowedOrigins = (
  process.env.CLIENT_ORIGIN ||
  "http://localhost:5173,https://admin-personal-site.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin, such as server-to-server requests
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }

      console.error("CORS blocked origin:", origin);
      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON request bodies
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Portfolio Admin API is running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
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

// Start server after connecting to MongoDB
try {
  await connectDB();
  await ensureAdmin();

  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
    console.log("Allowed frontend origins:", allowedOrigins);
  });
} catch (error) {
  console.error("Server startup failed:", error.message);
  process.exit(1);
}
