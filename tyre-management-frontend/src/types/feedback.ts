import { Customer } from "./customer";

export interface Feedback {
  id: string;
  customerId: string; // Relation to Customer
  type: string;
  numOfStars: number;
  comment?: string; // Optional
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
}
