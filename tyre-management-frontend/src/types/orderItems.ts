import { Stock } from "./stock";

export interface OrderItems {
  id: string;
  orderId: string; // Relation to Order
  stockId: string; // Relation to Stock
  quantity: number;
  price: number; // Price at time of order
  createdAt: string;
  updatedAt: string;
  stock?: Stock;
}
