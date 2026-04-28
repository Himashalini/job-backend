import { JobModel } from "../models/job.model.js";
import { db } from "../config/database.js"; // only if you need direct queries

// ✅ READ - Get all jobs with pagination
export const getJobs = async (req, res) => {
  try {
    // Read query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Query with LIMIT and OFFSET
    const [rows] = await db.query(
      "SELECT * FROM jobs LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.json({
      page,
      limit,
      jobs: rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

// ✅ CREATE - Add a new job
export const createJob = async (req, res) => {
  try {
    await JobModel.create(req.body);
    res.status(201).json({ message: "Job created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create job" });
  }
};

// ✅ UPDATE - Modify an existing job
export const updateJob = async (req, res) => {
  try {
    await JobModel.update(req.params.id, req.body);
    res.json({ message: "Job updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update job" });
  }
};

// ✅ DELETE - Remove a job
export const deleteJob = async (req, res) => {
  try {
    await JobModel.delete(req.params.id);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete job" });
  }
};
