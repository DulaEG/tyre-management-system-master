import { Order } from "@/types/order";
import axiosInstance from "./axiosConfig";

export const getAllOrders = async (): Promise<Order[]> => {
  const response = await axiosInstance.get("/orders");
  return response.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const response = await axiosInstance.get(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (
  orderData: Omit<Order, "id" | "createdAt" | "updatedAt">
): Promise<Order> => {
  const response = await axiosInstance.post("/orders", orderData);
  return response.data;
};

export const updateOrder = async (
  id: string,
  orderData: Partial<Order>
): Promise<Order> => {
  const response = await axiosInstance.put(`/orders/${id}`, orderData);
  return response.data;
};

export const deleteOrder = async (id: string): Promise<Order> => {
  const response = await axiosInstance.delete(`/orders/${id}`);
  return response.data;
};
