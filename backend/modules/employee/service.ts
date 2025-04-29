import { PrismaClient, Employee } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Generate employee ID (e.g., e001, e002, etc.)
const generateEmployeeId = async (): Promise<string> => {
  const lastEmployee = await prisma.employee.findFirst({
    orderBy: { employeeId: "desc" },
  });
  if (!lastEmployee) {
    return "e001";
  }
  const lastId = parseInt(lastEmployee.employeeId.slice(1), 10);
  return `e${(lastId + 1).toString().padStart(3, "0")}`;
};

// Create a new employee
export const createEmployee = async (
  employeeData: Omit<Employee, "id" | "employeeId" | "createdAt" | "updatedAt">
): Promise<Employee> => {
  const employeeId = await generateEmployeeId();
  const hashedPassword = await bcrypt.hash(employeeData.password, 10);
  return await prisma.employee.create({
    data: { ...employeeData, employeeId, password: hashedPassword },
  });
};

// Get all employees
export const getAllEmployees = async (): Promise<Employee[]> => {
  return await prisma.employee.findMany({ where: { deleteStatus: false } });
};

// Get an employee by ID
export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  return await prisma.employee.findUnique({ where: { id } });
};

// Update an employee by ID
export const updateEmployee = async (
  id: string,
  employeeData: Partial<Employee>
): Promise<Employee> => {
  const existinEmployee = await prisma.employee.findUnique({ where: { id } });
  if (employeeData.password) {
    employeeData.password = existinEmployee?.password;
  }
  return await prisma.employee.update({ where: { id }, data: employeeData });
};

// Delete an employee by ID (soft delete)
export const deleteEmployee = async (id: string): Promise<Employee> => {
  return await prisma.employee.update({
    where: { id },
    data: { deleteStatus: true },
  });
};

// Employee login
export const loginEmployee = async (
  nic: string,
  password: string
): Promise<{ employee: Employee; token: string } | null> => {
  const employee = await prisma.employee.findUnique({ where: { nic } });
  if (!employee) {
    throw new Error("Employee not found");
  }
  const isPasswordValid = await bcrypt.compare(password, employee.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign(
    { id: employee.id, role: employee.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
  return { employee, token };
};
