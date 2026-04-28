import express from "express";
import {
  getGovtJobs,
  createGovtJob,
  updateGovtJob,
  deleteGovtJob,
} from "../controllers/govtJob.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", getGovtJobs); // ✅ public
router.post("/", authMiddleware, adminOnly, createGovtJob);
router.put("/:id", authMiddleware, adminOnly, updateGovtJob);
router.delete("/:id", authMiddleware, adminOnly, deleteGovtJob);

export default router;