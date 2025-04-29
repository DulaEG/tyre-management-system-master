import { PrismaClient, Customer } from "@prisma/client";

const prisma = new PrismaClient();

// Generate customer ID (e.g., c001, c002, etc.)
const generateCustomerId = async (): Promise<string> => {
  const lastCustomer = await prisma.customer.findFirst({
    orderBy: { customerId: "desc" },
  });
  if (!lastCustomer) {
    return "c001";
  }
  const lastId = parseInt(lastCustomer.customerId.slice(1), 10);
  return `c${(lastId + 1).toString().padStart(3, "0")}`;
};

// Create a new customer
export const createCustomer = async (
  customerData: Omit<Customer, "id" | "customerId" | "createdAt" | "updatedAt">
): Promise<Customer> => {
  const customerId = await generateCustomerId();
  return await prisma.customer.create({
    data: {
      customerId,
      ...customerData,
      deleteStatus: false,
      payments: { create: [] }, // Fix: Properly handle the payments field
      orders: { create: [] }, // Similarly, for orders if required
      feedbacks: { create: [] },
    },
  });
};

// Get all customers
export const getAllCustomers = async (): Promise<Customer[]> => {
  return await prisma.customer.findMany({
    where: { deleteStatus: false },
  });
};

// Get a customer by ID
export const getCustomerById = async (id: string): Promise<Customer | null> => {
  return await prisma.customer.findUnique({ where: { id } });
};

export const updateCustomerPassword = async (
  id: string,
  password: string
): Promise<Customer> => {
  return await prisma.customer.update({
    where: { id },
    data: { password: password },
  });
};

// Update a customer by ID
export const updateCustomer = async (
  id: string,
  customerData: Partial<Customer>
): Promise<Customer> => {
  const existingCustomer = await prisma.customer.findUnique({ where: { id } });
  if (customerData.password) {
    customerData.password = existingCustomer?.password;
  }
  return await prisma.customer.update({ where: { id }, data: customerData });
};

// Delete a customer by ID (soft delete)
export const deleteCustomer = async (id: string): Promise<Customer> => {
  return await prisma.customer.update({
    where: { id },
    data: { deleteStatus: true },
  });
};
