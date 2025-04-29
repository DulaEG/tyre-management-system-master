import { Customer } from "@/types/customer";
import axiosInstance from "./axiosConfig";

export const getAllCustomers = async (): Promise<Customer[]> => {
  const response = await axiosInstance.get("/customers");
  return response.data;
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  const response = await axiosInstance.get(`/customers/${id}`);
  return response.data;
};

export const createCustomer = async (
  customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">
): Promise<Customer> => {
  const response = await axiosInstance.post("/customers", customerData);
  return response.data;
};

export const updateCustomer = async (
  id: string,
  customerData: Partial<Customer>
): Promise<Customer> => {
  const response = await axiosInstance.put(`/customers/${id}`, customerData);
  return response.data;
};
export const updateCustomerPassword = async (
  id: string,
  password: string
): Promise<Customer> => {
  const response = await axiosInstance.put(`/customers/update-password`, {
    id,
    password,
  });
  return response.data;
};

export const deleteCustomer = async (id: string): Promise<Customer> => {
  const response = await axiosInstance.delete(`/customers/${id}`);
  return response.data;
};

interface LoginResponse {
  customer: Customer;
  token: string;
}

export const loginCustomer = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post("/customers/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Login failed");
  }
};
