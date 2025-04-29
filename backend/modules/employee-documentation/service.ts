import { PrismaClient, EmployeeDocument } from "@prisma/client";

const prisma = new PrismaClient();

// Create employee document
export const createEmployeeDocument = async (
  documentData: Omit<EmployeeDocument, "id" | "createdAt" | "updatedAt">
): Promise<EmployeeDocument> => {
  return await prisma.employeeDocument.create({ data: documentData });
};

// Get employee document by employee ID
export const getEmployeeDocumentByEmployeeId = async (
  employeeId: string
): Promise<EmployeeDocument | null> => {
  return await prisma.employeeDocument.findUnique({ where: { employeeId } });
};

// Update employee document by ID
export const updateEmployeeDocument = async (
  id: string,
  documentData: Partial<EmployeeDocument>
): Promise<EmployeeDocument> => {
  return await prisma.employeeDocument.update({
    where: { id },
    data: documentData,
  });
};

// Delete employee document by ID
export const deleteEmployeeDocument = async (
  id: string
): Promise<EmployeeDocument> => {
  return await prisma.employeeDocument.delete({ where: { id } });
};
