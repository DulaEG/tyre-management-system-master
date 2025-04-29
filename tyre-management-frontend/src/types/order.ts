import { Customer } from "./customer";
import { OrderItems } from "./orderItems";

export interface Order {
  id: string;
  customerId: string; // Relation to Customer
  address: string;
  status: string; // pending, completed, cancelled
  totalBill: number;
  orderItems: OrderItems[]; // Relation to OrderItems
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
}
