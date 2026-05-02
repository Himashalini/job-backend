import fs from "fs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

const sslCaEnv = process.env.DB_SSL_CA;
let ssl;

if (sslCaEnv) {
  const ca = sslCaEnv.includes("-----BEGIN CERTIFICATE-----")
    ? sslCaEnv
    : fs.existsSync(sslCaEnv)
    ? fs.readFileSync(sslCaEnv, "utf8")
    : sslCaEnv;

  ssl = {
    ca: [ca],
    rejectUnauthorized: true,
    minVersion: "TLSv1.2",
  };
} else if (process.env.DB_SSL === "true" || process.env.DB_SSL === "1") {
  ssl = { rejectUnauthorized: false, minVersion: "TLSv1.2" };
}

if (
  process.env.NODE_ENV === "production" &&
  (process.env.DB_SSL === "true" || process.env.DB_SSL === "1") &&
  !sslCaEnv
) {
  throw new Error(
    "Production DB SSL requires DB_SSL_CA with Aiven MySQL CA certificate."
  );
}

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
    console.log("✅ DB Connected");
  } catch (err) {
    console.error("❌ DB Error:", err.message);
  }
}