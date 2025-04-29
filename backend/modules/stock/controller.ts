import { NextFunction, Request, Response } from "express";
import {
  getAllStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
} from "./service";

// Get all stocks
export const getAllStocksHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stocks = await getAllStocks();
    res.status(200).json(stocks);
  } catch (error) {
    next(error);
  }
};

// Get a stock by ID
export const getStockByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const stock = await getStockById(id);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res.status(200).json(stock);
  } catch (error) {
    next(error);
  }
};

// Create a new stock
export const createStockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stockData = req.body;
    const newStock = await createStock(stockData);
    res.status(201).json(newStock);
  } catch (error) {
    next(error);
  }
};

// Update a stock by ID
export const updateStockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const stockData = req.body;
    const updatedStock = await updateStock(id, stockData);
    res.status(200).json(updatedStock);
  } catch (error) {
    next(error);
  }
};

// Delete a stock by ID
export const deleteStockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deletedStock = await deleteStock(id);
    res.status(200).json(deletedStock);
  } catch (error) {
    next(error);
  }
};
