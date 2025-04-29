import { Payment } from "@/types/payment";
import axiosInstance from "./axiosConfig";

export const getAllPayments = async (): Promise<Payment[]> => {
  const response = await axiosInstance.get("/payments");
  return response.data;
};

export const getPaymentById = async (id: string): Promise<Payment> => {
  const response = await axiosInstance.get(`/payments/${id}`);
  return response.data;
};

export const createPayment = async (
  paymentData: Omit<Payment, "id" | "createdAt" | "updatedAt">
): Promise<Payment> => {
  const response = await axiosInstance.post("/payments", paymentData);
  return response.data;
};

export const updatePayment = async (
  id: string,
  paymentData: Partial<Payment>
): Promise<Payment> => {
  const response = await axiosInstance.put(`/payments/${id}`, paymentData);
  return response.data;
};

export const deletePayment = async (id: string): Promise<Payment> => {
  const response = await axiosInstance.delete(`/payments/${id}`);
  return response.data;
};
