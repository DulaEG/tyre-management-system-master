import { Request, Response, NextFunction } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "./service";

// Create a new order
export const createOrderHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderData = req.body;
    const newOrder = await createOrder(orderData, orderData.orderItems);
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
};

// Get all orders
export const getAllOrdersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Get an order by ID
export const getOrderByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Update an order by ID
export const updateOrderHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const orderData = req.body;
    const updatedOrder = await updateOrder(id, orderData);
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// Delete an order by ID
export const deleteOrderHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedOrder = await deleteOrder(id);
    res.status(200).json(deletedOrder);
  } catch (error) {
    next(error);
  }
};
