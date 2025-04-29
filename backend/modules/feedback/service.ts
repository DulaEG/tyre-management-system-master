import { PrismaClient, Feedback } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new feedback
export const createFeedback = async (
  feedbackData: Omit<Feedback, "id" | "createdAt" | "updatedAt">
): Promise<Feedback> => {
  return await prisma.feedback.create({ data: feedbackData });
};

// Get all feedbacks
export const getAllFeedbacks = async (): Promise<Feedback[]> => {
  return await prisma.feedback.findMany({
    include: {
      customer: true,
    },
  });
};

// Get a feedback by ID
export const getFeedbackById = async (id: string): Promise<Feedback | null> => {
  return await prisma.feedback.findUnique({ where: { id } });
};

// Update a feedback by ID
export const updateFeedback = async (
  id: string,
  feedbackData: Partial<Feedback>
): Promise<Feedback> => {
  return await prisma.feedback.update({ where: { id }, data: feedbackData });
};

// Delete a feedback by ID
export const deleteFeedback = async (id: string): Promise<Feedback> => {
  return await prisma.feedback.delete({ where: { id } });
};
