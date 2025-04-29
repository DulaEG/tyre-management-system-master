import { Request, Response, NextFunction } from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  updateCustomerPassword,
} from "./service";
import { PrismaClient } from "@prisma/client";

// Create a new customer
export const createCustomerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerData = req.body;
    const newCustomer = await createCustomer(customerData);
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(200).json(error);
  }
};

export const loginCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const prisma = new PrismaClient();

    const customer = await prisma.customer.findUnique({
      where: { email, deleteStatus: false },
    });

    if (!customer) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Verify password
    const isPasswordValid = password === customer.password;

    isPasswordValid
      ? res.status(200).json({ customer, token: "fuck" })
      : res.status(404).json({ message: "Error , invalid logi crendetials" });
  } catch (error) {
    res.status(200).json(error);
  }
};

// Get all customers
export const getAllCustomersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customers = await getAllCustomers();
    res.status(200).json(customers);
  } catch (error) {
    res.status(200).json(error);
  }
};

// Get a customer by ID
export const getCustomerByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const customer = await getCustomerById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(200).json(error);
  }
};

export const updateCustomerPasswod = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, password } = req.body;
    const updatedCustomer = await updateCustomerPassword(id, password);
    res.status(202).json(updatedCustomer);
  } catch (error) {
    res.status(200).json(error);
  }
};

// Update a customer by ID
export const updateCustomerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const customerData = req.body;
    const updatedCustomer = await updateCustomer(id, customerData);
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(200).json(error);
  }
};

// Delete a customer by ID
export const deleteCustomerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedCustomer = await deleteCustomer(id);
    res.status(200).json(deletedCustomer);
  } catch (error) {
    res.status(200).json(error);
  }
};
