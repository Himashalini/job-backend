import express from "express";
import { generateToken } from "../utils/jwt.js";

const router = express.Router();

/*
  Admin login backed by environment variables.
  Set ADMIN_USERNAME and ADMIN_PASSWORD in your backend environment before deploying.
  This is still a minimal approach; for production consider a proper user table and hashed passwords.
*/
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminPass = process.env.ADMIN_PASSWORD || "admin123";

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (username !== adminUser || password !== adminPass) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({ role: "admin" });
  res.json({ token });
});

export default router;
