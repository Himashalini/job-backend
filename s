import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

// SSL configuration for providers that require TLS (Aiven requires SSL)
const ssl = process.env.DB_SSL === "true" || process.env.DB_SSL === "1"
  ? { rejectUnauthorized: true }
  : undefined;

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONN_LIMIT) || 10,
});

/**
 * Test DB connection once at startup and log meaningful messages.
 * We don't throw here to avoid crashing the process automatically,
 * but the logs will make it obvious in the Render console if DB fails.
 */
export async function initDB() {
  try {
    const conn = await db.getConnection();
    await conn.ping();
    conn.release();
    console.log(`✅ DB connected to ${process.env.DB_HOST}:${port}/${process.env.DB_NAME}`);
  } catch (err) {
    console.error("❌ DB connection error:", err?.message || err);
  }
}


















import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

const ssl = process.env.DB_SSL === "true" || process.env.DB_SSL === "1"
  ? { rejectUnauthorized: true }
  : undefined;

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONN_LIMIT) || 10,
});

export async function initDB() {
  try {
    const conn = await db.getConnection();
    await conn.ping();
    conn.release();
    console.log(`✅ DB connected to ${process.env.DB_HOST}:${port}/${process.env.DB_NAME}`);
  } catch (err) {
    console.error("❌ DB connection error:", err?.message || err);
  }
}







import dotenv from "dotenv";
import app from "./app.js";
import { initDB } from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

(async function start() {
  // Initialize DB (logs success or errors)
  await initDB();

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
})();







import dotenv from "dotenv";
import app from "./app.js";
import { initDB } from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

(async function start() {
  // Initialize DB (logs success or errors)
  await initDB();

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
})();

