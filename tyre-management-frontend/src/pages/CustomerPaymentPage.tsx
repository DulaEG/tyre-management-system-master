import { useEffect, useState } from "react";
import { getAllPayments } from "@/api/paymentApi";
import NavBar from "@/components/common/Navbar";
import { Payment } from "@/types/payment";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

const CustomerPaymentPage = () => {
  const customerId = localStorage.getItem("userId");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [filters, setFilters] = useState({
    status: "",
    date: "",
    amount: "",
    paymentType: "",
  });

  // Fetch payments for the customer
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const allPayments = await getAllPayments();
        const customerPayments = allPayments.filter(
          (payment) => payment.customerId === customerId
        );
        setPayments(customerPayments);
        setFilteredPayments(customerPayments);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      }
    };
    fetchPayments();
  }, [customerId]);

  // Apply filters
  useEffect(() => {
    let filtered = payments;

    if (filters.status) {
      filtered = filtered.filter(
        (payment) => payment.status === filters.status
      );
    }
    if (filters.date) {
      filtered = filtered.filter((payment) =>
        payment.paidDate.includes(filters.date)
      );
    }
    if (filters.amount) {
      filtered = filtered.filter(
        (payment) => payment.paidAmount === parseFloat(filters.amount)
      );
    }
    if (filters.paymentType) {
      filtered = filtered.filter(
        (payment) => payment.paymentType === filters.paymentType
      );
    }

    setFilteredPayments(filtered);
  }, [filters, payments]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Generate invoice for a payment
  const generateInvoice = (payment: Payment) => {
    const doc = new jsPDF();

    // Add title
    doc.text("Invoice", 10, 10);

    // Add payment details
    autoTable(doc, {
      startY: 20,
      head: [["Field", "Value"]],
      body: [
        ["Customer Name", payment.customerName],
        ["Customer Email", payment.customerEmail],
        ["Contact Number", payment.contactNumber],
        ["Paid Amount", `$${payment.paidAmount.toFixed(2)}`],
        ["Payment Type", payment.paymentType],
        ["Status", payment.status],
        ["Paid Date", new Date(payment.paidDate).toLocaleDateString()],
      ],
    });

    // Save the PDF
    doc.save(`invoice_${payment.id}.pdf`);
  };

  return (
    <div className="w-screen h-screen bg-gray-100">
      <NavBar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Your Payments</h1>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <Select
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger style={{ background: "white" }} className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="invalid">Invalid</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            placeholder="Date"
            className="w-40"
            onChange={(e) => handleFilterChange("date", e.target.value)}
          />

          <Input
            type="number"
            placeholder="Amount"
            className="w-40"
            onChange={(e) => handleFilterChange("amount", e.target.value)}
          />

          <Select
            onValueChange={(value) => handleFilterChange("paymentType", value)}
          >
            <SelectTrigger style={{ background: "white" }} className="w-40">
              <SelectValue placeholder="Payment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cod">COD</SelectItem>
              <SelectItem value="card"> Card</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              setFilteredPayments(payments);
            }}
          >
            Reset
          </Button>
        </div>

        {/* Payments Table */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Customer Name</th>
                <th className="p-2 text-left">Paid Amount</th>
                <th className="p-2 text-left">Payment Type</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Paid Date</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b">
                  <td className="p-2">{payment.customerName}</td>
                  <td className="p-2">${payment.paidAmount.toFixed(2)}</td>
                  <td className="p-2">{payment.paymentType}</td>
                  <td className="p-2">{payment.status}</td>
                  <td className="p-2">
                    {new Date(payment.paidDate).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <Button
                      onClick={() => generateInvoice(payment)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Generate Invoice
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerPaymentPage;
