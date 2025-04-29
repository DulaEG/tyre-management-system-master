import { PrismaClient, EmployeeLeave } from "@prisma/client";

const prisma = new PrismaClient();

// Create employee leave
export const createEmployeeLeave = async (
  leaveData: Omit<EmployeeLeave, "id" | "createdAt" | "updatedAt">
): Promise<EmployeeLeave> => {
  return await prisma.employeeLeave.create({ data: leaveData });
};

export const getEmployeeLeavesAll = async (): Promise<EmployeeLeave[]> => {
  return prisma.employeeLeave.findMany({
    include: {
      employee: true,
    },
  });
};

// Get all leaves for an employee
export const getEmployeeLeavesByEmployeeId = async (
  employeeId: string
): Promise<EmployeeLeave[]> => {
  return await prisma.employeeLeave.findMany({ where: { employeeId } });
};

// Update employee leave by ID
export const updateEmployeeLeave = async (
  id: string,
  leaveData: Partial<EmployeeLeave>
): Promise<EmployeeLeave> => {
  return await prisma.employeeLeave.update({ where: { id }, data: leaveData });
};

// Delete employee leave by ID
export const deleteEmployeeLeave = async (
  id: string
): Promise<EmployeeLeave> => {
  return await prisma.employeeLeave.delete({ where: { id } });
};
