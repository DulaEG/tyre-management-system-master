import { Request, Response, NextFunction } from "express";
import {
  createEmployeeDocument,
  getEmployeeDocumentByEmployeeId,
  updateEmployeeDocument,
  deleteEmployeeDocument,
} from "./service";

// Create employee document
export const createEmployeeDocumentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const documentData = req.body;
    const newDocument = await createEmployeeDocument(documentData);
    res.status(201).json(newDocument);
  } catch (error) {
    next(error);
  }
};

// Get employee document by employee ID
export const getEmployeeDocumentByEmployeeIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { employeeId } = req.params;
    const document = await getEmployeeDocumentByEmployeeId(employeeId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json(document);
  } catch (error) {
    next(error);
  }
};

// Update employee document by ID
export const updateEmployeeDocumentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const documentData = req.body;
    const updatedDocument = await updateEmployeeDocument(id, documentData);
    res.status(200).json(updatedDocument);
  } catch (error) {
    next(error);
  }
};

// Delete employee document by ID
export const deleteEmployeeDocumentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedDocument = await deleteEmployeeDocument(id);
    res.status(200).json(deletedDocument);
  } catch (error) {
    next(error);
  }
};
