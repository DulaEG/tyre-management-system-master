import { Feedback } from "./feedback";
import { Order } from "./order";
import { Payment } from "./payment";

export interface Customer {
  id: string;
  customerId: string;
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  deleteStatus: boolean;
  payments: Payment[];
  orders: Order[];
  feedbacks: Feedback[];
  createdAt: string;
  updatedAt: string;
}
