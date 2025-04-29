export interface Payment {
  id: string;
  customerName: string;
  customerEmail: string;
  contactNumber: string;
  paidAmount: number;
  status: string; // pending, completed, invalid
  deleteStatus: boolean;
  paymentType: string; // cash, debit card, credit card
  paidDate: string;
  customerId: string; // Relation to Customer
  createdAt: string;
  updatedAt: string;
}
