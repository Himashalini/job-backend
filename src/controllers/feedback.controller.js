import { FeedbackModel } from "../models/feedback.model.js";

export const submitFeedback = async (req, res) => {
  try {
    await FeedbackModel.create(req.body);
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};