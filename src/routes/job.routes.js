import express from "express";
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

/* Public */
router.get("/", getJobs);

/* Admin */
router.post("/", authMiddleware, adminOnly, createJob);
router.put("/:id", authMiddleware, adminOnly, updateJob);
router.delete("/:id", authMiddleware, adminOnly, deleteJob);

export default router;
