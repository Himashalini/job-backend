import { db } from "../config/database.js";

export const FeedbackModel = {
  create: async (feedback) => {
    const { message } = feedback;

    await db.query(
      "INSERT INTO feedback (message) VALUES (?)",
      [message]
    );
  },
};