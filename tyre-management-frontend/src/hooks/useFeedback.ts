import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllFeedbacks,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} from "../api/feedbackApi";
import { Feedback } from "../types/feedback";
import { toast } from "sonner";

export const useFeedbacks = () => {
  return useQuery<Feedback[]>({
    queryKey: ["feedbacks"],
    queryFn: getAllFeedbacks,
  });
};

export const useFeedback = (id: string) => {
  return useQuery<Feedback>({
    queryKey: ["feedback", id],
    queryFn: () => getFeedbackById(id),
    enabled: !!id,
  });
};

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      toast.success("Feedback created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      feedbackData,
    }: {
      id: string;
      feedbackData: Partial<Feedback>;
    }) => updateFeedback(id, feedbackData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      toast.success("Feedback updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      toast.success("Feedback deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
