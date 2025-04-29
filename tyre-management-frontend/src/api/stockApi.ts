import { Stock } from "@/types/stock";
import axiosInstance from "./axiosConfig";

export const getAllStocks = async (): Promise<Stock[]> => {
  const response = await axiosInstance.get("/stocks");
  return response.data;
};

export const getStockById = async (id: string): Promise<Stock> => {
  const response = await axiosInstance.get(`/stocks/${id}`);
  return response.data;
};

export const createStock = async (
  stockData: Omit<Stock, "id" | "createdAt" | "updatedAt">
): Promise<Stock> => {
  const response = await axiosInstance.post("/stocks", stockData);
  return response.data;
};

export const updateStock = async (
  id: string,
  stockData: Partial<Stock>
): Promise<Stock> => {
  const response = await axiosInstance.put(`/stocks/${id}`, stockData);
  return response.data;
};

export const deleteStock = async (id: string): Promise<Stock> => {
  const response = await axiosInstance.delete(`/stocks/${id}`);
  return response.data;
};
