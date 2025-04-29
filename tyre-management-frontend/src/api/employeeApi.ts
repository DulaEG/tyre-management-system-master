import { Employee } from "@/types/employee";
import axiosInstance from "./axiosConfig";

export const getAllEmployees = async (): Promise<Employee[]> => {
  const response = await axiosInstance.get("/employees");
  return response.data;
};

export const getEmployeeById = async (id: string): Promise<Employee> => {
  const response = await axiosInstance.get(`/employees/${id}`);
  return response.data;
};

export const createEmployee = async (
  employeeData: Omit<Employee, "id" | "createdAt" | "updatedAt">
): Promise<Employee> => {
  const response = await axiosInstance.post("/employees", employeeData);
  return response.data;
};

export const updateEmployee = async (
  id: string,
  employeeData: Partial<Employee>
): Promise<Employee> => {
  const response = await axiosInstance.put(`/employees/${id}`, employeeData);
  return response.data;
};

export const deleteEmployee = async (id: string): Promise<Employee> => {
  const response = await axiosInstance.delete(`/employees/${id}`);
  return response.data;
};

interface LoginResponse {
  employee: Employee;
  token: string;
}

export const loginEmployee = async (
  nic: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post("/employees/login", {
      nic,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Login failed");
  }
};
