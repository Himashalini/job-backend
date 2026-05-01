import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const ssl = process.env.DB_SSL === "true"
  ? {
      rejectUnauthorized:
        process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
    }
  : undefined;

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl,
});