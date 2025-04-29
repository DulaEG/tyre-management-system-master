import { PrismaClient, Order, OrderItems } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new order
export const createOrder = async (
  orderData: Omit<Order, "id" | "createdAt" | "updatedAt">,
  orderItems: OrderItems[]
): Promise<Order> => {
  return await prisma.order.create({
    data: {
      ...orderData,
      orderItems: {
        create: orderItems,
      },
    },
    include: {
      orderItems: true, // ✅ Include orderItems to fetch them in the response
    },
  });
};

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  return await prisma.order.findMany({
    where: {
      deleteStatys: false,
    },
    include: { orderItems: { include: { stock: true } }, customer: true },
  });
};

// Get an order by ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  return await prisma.order.findUnique({ where: { id } });
};

// Update an order by ID
export const updateOrder = async (
  id: string,
  orderData: Partial<Order>
): Promise<Order> => {
  return await prisma.order.update({ where: { id }, data: orderData });
};

// Delete an order by ID
export const deleteOrder = async (id: string): Promise<Order> => {
  return await prisma.order.update({
    where: { id },
    data: { deleteStatys: true },
  });
};
