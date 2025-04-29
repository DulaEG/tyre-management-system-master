import { Request, Response, NextFunction } from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} from "./service";

// Create a new payment
export const createPaymentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const paymentData = req.body;
    const newPayment = await createPayment(paymentData);
    res.status(201).json(newPayment);
  } catch (error) {
    next(error);
  }
};

// Get all payments
export const getAllPaymentsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payments = await getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

// Get a payment by ID
export const getPaymentByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const payment = await getPaymentById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};

// Update a payment by ID
export const updatePaymentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const paymentData = req.body;
    const updatedPayment = await updatePayment(id, paymentData);
    res.status(200).json(updatedPayment);
  } catch (error) {
    next(error);
  }
};

// Delete a payment by ID
export const deletePaymentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedPayment = await deletePayment(id);
    res.status(200).json(deletedPayment);
  } catch (error) {
    next(error);
  }
};
