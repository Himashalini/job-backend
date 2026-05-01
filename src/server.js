import dotenv from "dotenv";
import app from "./app.js";
import { initDB } from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
  await initDB();

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
})();