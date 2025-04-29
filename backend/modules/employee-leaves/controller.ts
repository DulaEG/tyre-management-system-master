import { Request, Response, NextFunction } from "express";
import {
  createEmployeeLeave,
  getEmployeeLeavesByEmployeeId,
  updateEmployeeLeave,
  deleteEmployeeLeave,
  getEmployeeLeavesAll,
} from "./service";

// Create employee leave
export const createEmployeeLeaveHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const leaveData = req.body;
    const newLeave = await createEmployeeLeave(leaveData);
    res.status(201).json(newLeave);
  } catch (error) {
    next(error);
  }
};

export const getEmployeeLeavesAllC = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const leaves = await getEmployeeLeavesAll();
    res.status(200).json(leaves);
  } catch (error) {
    next(error);
  }
};

// Get all leaves for an employee
export const getEmployeeLeavesByEmployeeIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { employeeId } = req.params;
    const leaves = await getEmployeeLeavesByEmployeeId(employeeId);
    res.status(200).json(leaves);
  } catch (error) {
    next(error);
  }
};

// Update employee leave by ID
export const updateEmployeeLeaveHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const leaveData = req.body;
    const updatedLeave = await updateEmployeeLeave(id, leaveData);
    res.status(200).json(updatedLeave);
  } catch (error) {
    next(error);
  }
};

// Delete employee leave by ID
export const deleteEmployeeLeaveHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedLeave = await deleteEmployeeLeave(id);
    res.status(200).json(deletedLeave);
  } catch (error) {
    next(error);
  }
};
