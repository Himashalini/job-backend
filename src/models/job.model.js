import { db } from "../config/database.js";

export const JobModel = {
  // ✅ READ - Get all jobs
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM jobs ORDER BY id DESC");
    return rows;
  },

  // ✅ CREATE - Add a new job
  create: async (job) => {
    const { id, title, company, description, image_url, apply_link } = job;
    await db.query(
      `INSERT INTO jobs (id, title, company, description, image_url, apply_link)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, title, company, description, image_url, apply_link]
    );
  },

  // ✅ UPDATE - Modify an existing job
  update: async (id, job) => {
    const { title, company, description, image_url, apply_link } = job;
    await db.query(
      `UPDATE jobs
       SET title=?, company=?, description=?, image_url=?, apply_link=?
       WHERE id=?`,
      [title, company, description, image_url, apply_link, id]
    );
  },

  // ✅ DELETE - Remove a job
  delete: async (id) => {
    await db.query(`DELETE FROM jobs WHERE id = ?`, [id]);
  },
};
