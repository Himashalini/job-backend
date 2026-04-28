import { db } from "../config/database.js";

export const GovtJobModel = {
  // ✅ GET ALL + SEARCH
  getAll: async (query) => {
    let sql = "SELECT * FROM govt_jobs";
    let params = [];

    if (query) {
      sql += `
        WHERE title LIKE ?
        OR organization LIKE ?
        OR department LIKE ?
      `;
      params = [`%${query}%`, `%${query}%`, `%${query}%`];
    }

    sql += " ORDER BY application_end DESC";

    const [rows] = await db.query(sql, params);
    return rows;
  },

  // ✅ CREATE
  create: async (job) => {
    const {
      id,
      title,
      department,
      organization,
      location,
      qualification,
      age_limit,
      employment_type,
      application_start,
      application_end,
      exam_date,
      salary,
      description,
      apply_link,
      notification_pdf,
    } = job;

    await db.query(
      `INSERT INTO govt_jobs VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        id,
        title,
        department,
        organization,
        location,
        qualification,
        age_limit,
        employment_type,
        application_start,
        application_end,
        exam_date,
        salary,
        description,
        apply_link,
        notification_pdf,
      ]
    );
  },

  // ✅ UPDATE
  update: async (id, job) => {
    await db.query(
      `UPDATE govt_jobs SET ? WHERE id = ?`,
      [job, id]
    );
  },

  // ✅ DELETE
  delete: async (id) => {
    await db.query("DELETE FROM govt_jobs WHERE id = ?", [id]);
  },
};