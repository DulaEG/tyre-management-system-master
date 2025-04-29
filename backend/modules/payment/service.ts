import { PrismaClient, Payment } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new payment
export const createPayment = async (
  paymentData: Omit<Payment, "id" | "createdAt" | "updatedAt">
): Promise<Payment> => {
  return await prisma.payment.create({ data: paymentData });
};

// Get all payments
export const getAllPayments = async (): Promise<Payment[]> => {
  return await prisma.payment.findMany({ where: { deleteStatus: false } });
};

// Get a payment by ID
export const getPaymentById = async (id: string): Promise<Payment | null> => {
  return await prisma.payment.findUnique({ where: { id } });
};

// Update a payment by ID
export const updatePayment = async (
  id: string,
  paymentData: Partial<Payment>
): Promise<Payment> => {
  return await prisma.payment.update({ where: { id }, data: paymentData });
};

// Delete a payment by ID (soft delete)
export const deletePayment = async (id: string): Promise<Payment> => {
  return await prisma.payment.update({
    where: { id },
    data: { deleteStatus: true },
  });
};
