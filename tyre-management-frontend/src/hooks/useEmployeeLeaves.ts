// src/hooks/useEmployeeLeave.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllEmployeeLeaves,
  getEmployeeLeaveById,
  createEmployeeLeave,
  updateEmployeeLeave,
  deleteEmployeeLeave,
} from "../api/employeeLeavesApi";
import { EmployeeLeave } from "../types/employee-leaves";
import { toast } from "sonner";

export const useEmployeeLeaves = () => {
  return useQuery<EmployeeLeave[]>({
    queryKey: ["employee-leaves"],
    queryFn: getAllEmployeeLeaves,
  });
};

export const useEmployeeLeave = (id: string) => {
  return useQuery<EmployeeLeave>({
    queryKey: ["employee-leave", id],
    queryFn: () => getEmployeeLeaveById(id),
    enabled: !!id,
  });
};

export const useCreateEmployeeLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployeeLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-leaves"] });
      toast.success("Leave created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateEmployeeLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      leaveData,
    }: {
      id: string;
      leaveData: Partial<EmployeeLeave>;
    }) => updateEmployeeLeave(id, leaveData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-leaves"] });
      toast.success("Leave updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteEmployeeLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployeeLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-leaves"] });
      toast.success("Leave deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
