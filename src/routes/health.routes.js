import express from "express";
import { db } from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS db");
    const dbResult = rows[0]?.db ?? rows[0]?.["1"] ?? null;

    return res.json({
      backend: "running",
      database: "connected",
      db_result: dbResult,
      status: "all systems working",
    });
  } catch (error) {
    console.error("Health check failed:", error?.message || error);
    return res.status(503).json({
      backend: "running",
      database: "disconnected",
      error: error?.message || "Database connection failed",
      status: "database error",
    });
  }
});

export default router;
