import { PrismaClient, Stock } from "@prisma/client";

const prisma = new PrismaClient();

// Get all stocks
export const getAllStocks = async (): Promise<Stock[]> => {
  return await prisma.stock.findMany({ where: { deleteStatus: false } });
};

// Get a stock by ID
export const getStockById = async (id: string): Promise<Stock | null> => {
  return await prisma.stock.findUnique({ where: { id } });
};

// Create a new stock
export const createStock = async (
  stockData: Omit<Stock, "id" | "createdAt" | "updatedAt">
): Promise<Stock> => {
  return await prisma.stock.create({ data: stockData });
};

// Update a stock by ID
export const updateStock = async (
  id: string,
  stockData: Partial<Stock>
): Promise<Stock> => {
  return await prisma.stock.update({ where: { id }, data: stockData });
};

// Delete a stock by ID (soft delete)
export const deleteStock = async (id: string): Promise<Stock> => {
  return await prisma.stock.update({
    where: { id },
    data: { deleteStatus: true },
  });
};
