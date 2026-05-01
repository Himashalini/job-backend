import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import compression from "compression";

import jobRoutes from "./routes/job.routes.js";
import dressRoutes from "./routes/dress.routes.js";
import jewelleryRoutes from "./routes/jewellery.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";

import govtJobRoutes from "./routes/govtJob.routes.js";

const app = express();

/* Global Middlewares */
app.use(cors());
app.use(express.json());

// Gzip compression for responses (improves transfer time for assets)
app.use(compression());

/* Base API Routes */
app.use("/api/jobs", jobRoutes);
app.use("/api/dresses", dressRoutes);
app.use("/api/jewellery", jewelleryRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.use("/api/govt-jobs", govtJobRoutes);


/* Health Check */
app.get("/", (req, res) => {
  res.json({ status: "✅ Backend is running" });
});

// Serve uploaded/static assets (if you store images locally under <project-root>/uploads)
// This lets the frontend request '/uploads/...' URLs and have the backend serve them.
// Serve uploads with caching for 7 days to reduce repeated downloads in production
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), { maxAge: "7d" })
);

// Serve frontend build in production (single-server deployment)
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(process.cwd(), "frontend", "build");
  const clientIndexPath = path.join(clientBuildPath, "index.html");

  if (fs.existsSync(clientIndexPath)) {
    // Serve static files from the React app
    app.use(express.static(clientBuildPath, { maxAge: "7d" }));

    // All other requests should return the React app's index.html (SPA fallback)
    app.get("/*", (req, res, next) => {
      res.sendFile(clientIndexPath, (err) => {
        if (err) {
          console.error(
            `Failed to send frontend index.html: ${err.message}`
          );
          if (!res.headersSent) {
            res.status(404).json({ message: "Frontend build not found" });
          }
        }
      });
    });
  } else {
    console.warn(
      `Frontend build not found at ${clientIndexPath}. Skipping SPA static serving.`
    );
  }
}

export default app;