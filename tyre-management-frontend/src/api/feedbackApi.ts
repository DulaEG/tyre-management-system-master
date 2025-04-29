import { Feedback } from "@/types/feedback";
import axiosInstance from "./axiosConfig";

export const getAllFeedbacks = async (): Promise<Feedback[]> => {
  const response = await axiosInstance.get("/feedbacks");
  return response.data;
};

export const getFeedbackById = async (id: string): Promise<Feedback> => {
  const response = await axiosInstance.get(`/feedbacks/${id}`);
  return response.data;
};

export const createFeedback = async (
  feedbackData: Omit<Feedback, "id" | "createdAt" | "updatedAt">
): Promise<Feedback> => {
  const response = await axiosInstance.post("/feedbacks", feedbackData);
  return response.data;
};

export const updateFeedback = async (
  id: string,
  feedbackData: Partial<Feedback>
): Promise<Feedback> => {
  const response = await axiosInstance.put(`/feedbacks/${id}`, feedbackData);
  return response.data;
};

export const deleteFeedback = async (id: string): Promise<Feedback> => {
  const response = await axiosInstance.delete(`/feedbacks/${id}`);
  return response.data;
};
