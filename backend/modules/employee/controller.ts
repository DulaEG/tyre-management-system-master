import { Request, Response, NextFunction } from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  loginEmployee,
} from "./service";

// Create a new employee
export const createEmployeeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employeeData = req.body;
    const newEmployee = await createEmployee(employeeData);
    res.status(201).json(newEmployee);
  } catch (error) {
    next(error);
  }
};

// Get all employees
export const getAllEmployeesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employees = await getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

// Get an employee by ID
export const getEmployeeByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const employee = await getEmployeeById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    next(error);
  }
};

// Update an employee by ID
export const updateEmployeeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const employeeData = req.body;
    const updatedEmployee = await updateEmployee(id, employeeData);
    res.status(200).json(updatedEmployee);
  } catch (error) {
    next(error);
  }
};

// Delete an employee by ID
export const deleteEmployeeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedEmployee = await deleteEmployee(id);
    res.status(200).json(deletedEmployee);
  } catch (error) {
    next(error);
  }
};

// Employee login
export const loginEmployeeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nic, password } = req.body;
    const result = await loginEmployee(nic, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
