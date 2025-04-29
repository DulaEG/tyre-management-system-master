import express from "express";
import {
  createFeedbackHandler,
  getAllFeedbacksHandler,
  getFeedbackByIdHandler,
  updateFeedbackHandler,
  deleteFeedbackHandler,
} from "./controller";

const router = express.Router();

// Feedback routes
router.post("/", createFeedbackHandler);
router.get("/", getAllFeedbacksHandler);
router.get("/:id", getFeedbackByIdHandler);
router.put("/:id", updateFeedbackHandler);
router.delete("/:id", deleteFeedbackHandler);

export default router;
