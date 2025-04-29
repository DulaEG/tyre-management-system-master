import { EmployeeDocument } from "@/types/employee-docs";
import axiosInstance from "./axiosConfig";

export const getEmployeeDocumentById = async (
  id: string
): Promise<EmployeeDocument> => {
  const response = await axiosInstance.get(`/employee-documents/${id}`);
  return response.data;
};

export const createEmployeeDocument = async (
  documentData: Omit<EmployeeDocument, "id" | "createdAt" | "updatedAt">
): Promise<EmployeeDocument> => {
  const response = await axiosInstance.post(
    "/employee-documents",
    documentData
  );
  return response.data;
};

export const updateEmployeeDocument = async (
  id: string,
  documentData: Partial<EmployeeDocument>
): Promise<EmployeeDocument> => {
  const response = await axiosInstance.put(
    `/employee-documents/${id}`,
    documentData
  );
  return response.data;
};

export const deleteEmployeeDocument = async (
  id: string
): Promise<EmployeeDocument> => {
  const response = await axiosInstance.delete(`/employee-documents/${id}`);
  return response.data;
};
