import { EmployeeLeave } from "@/types/employee-leaves";
import axiosInstance from "./axiosConfig";

export const getAllEmployeeLeaves = async (): Promise<EmployeeLeave[]> => {
  const response = await axiosInstance.get("/employee-leaves");
  return response.data;
};

export const getEmployeeLeaveById = async (
  id: string
): Promise<EmployeeLeave> => {
  const response = await axiosInstance.get(`/employee-leaves/${id}`);
  return response.data;
};

export const createEmployeeLeave = async (
  leaveData: Omit<EmployeeLeave, "id" | "createdAt" | "updatedAt">
): Promise<EmployeeLeave> => {
  const response = await axiosInstance.post("/employee-leaves", leaveData);
  return response.data;
};

export const updateEmployeeLeave = async (
  id: string,
  leaveData: Partial<EmployeeLeave>
): Promise<EmployeeLeave> => {
  const response = await axiosInstance.put(`/employee-leaves/${id}`, leaveData);
  return response.data;
};

export const deleteEmployeeLeave = async (
  id: string
): Promise<EmployeeLeave> => {
  const response = await axiosInstance.delete(`/employee-leaves/${id}`);
  return response.data;
};
