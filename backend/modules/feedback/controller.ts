import { Request, Response, NextFunction } from "express";
import {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} from "./service";

// Create a new feedback
export const createFeedbackHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const feedbackData = req.body;
    const newFeedback = await createFeedback(feedbackData);
    res.status(201).json(newFeedback);
  } catch (error) {
    next(error);
  }
};

// Get all feedbacks
export const getAllFeedbacksHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const feedbacks = await getAllFeedbacks();
    res.status(200).json(feedbacks);
  } catch (error) {
    next(error);
  }
};

// Get a feedback by ID
export const getFeedbackByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const feedback = await getFeedbackById(id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
};

// Update a feedback by ID
export const updateFeedbackHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const feedbackData = req.body;
    const updatedFeedback = await updateFeedback(id, feedbackData);
    res.status(200).json(updatedFeedback);
  } catch (error) {
    next(error);
  }
};

// Delete a feedback by ID
export const deleteFeedbackHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedFeedback = await deleteFeedback(id);
    res.status(200).json(deletedFeedback);
  } catch (error) {
    next(error);
  }
};
