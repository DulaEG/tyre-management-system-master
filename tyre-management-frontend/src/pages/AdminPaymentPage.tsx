import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getAllPayments, updatePayment, deletePayment } from "@/api/paymentApi";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { Payment } from "@/types/payment";
import { toast } from "sonner";
import { Printer, TrashIcon, BarChart2 } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import PaymentCharts from "@/components/PaymentPage/PaymentsCharts";
import { EmailOptions, sendEmailApi } from "@/api/emailApi";

const AdminPaymentPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await getAllPayments();
      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = payments.filter((payment) =>
      payment.customerName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPayments(filtered);
  };

  const handleUpdateStatus = async (
    id: string,
    status: string,
    customerEmail: string,
    amount: number,
    paidDate: Date,
    paymentType: string
  ) => {
    try {
      await updatePayment(id, { status });
      if (status === "completed") {
        try {
          const options: EmailOptions = {
            to: customerEmail,
            subject: "Payment Successful",
            text: "Your payment was successful. Thank you for your purchase!",
            html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #4CAF50; text-align: center;">Payment Successful</h2>
                    <p>Dear Customer,</p>
                    <p>We are pleased to inform you that your payment has been successfully processed.</p>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                      <tr>
                        <td style="border: 1px solid #ddd; padding: 10px;"><strong>Amount Paid:</strong></td>
                        <td style="border: 1px solid #ddd; padding: 10px;">$${amount.toFixed(
                          2
                        )}</td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #ddd; padding: 10px;"><strong>Payment Date:</strong></td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${new Date(
                          paidDate
                        ).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #ddd; padding: 10px;"><strong>Payment Method:</strong></td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${paymentType}</td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #ddd; padding: 10px;"><strong>Transaction ID:</strong></td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${id}</td>
                      </tr>
                    </table>
                    <p>Thank you for your purchase!</p>
                    <p>Best regards,<br/><strong>Your Company Name</strong></p>
                  </div>
                `,
          };

          await sendEmailApi(options);
        } catch (error) {
          console.error(`Error sending email ${error}`);
        }
      }
      await fetchPayments();
      toast.success("Payment status updated to " + status);
    } catch (error) {
      console.error("Failed to update payment status:", error);
    }
  };

  const handleDeletePayment = async (id: string) => {
    try {
      await deletePayment(id);
      fetchPayments();
    } catch (error) {
      console.error("Failed to delete payment:", error);
    }
  };

  const generateInvoice = (payment: Payment) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Invoice", 10, 10);

    doc.setFontSize(12);
    doc.text(`Customer Name: ${payment.customerName}`, 10, 20);
    doc.text(`Customer Email: ${payment.customerEmail}`, 10, 30);
    doc.text(`Contact Number: ${payment.contactNumber}`, 10, 40);
    doc.text(`Paid Amount: $${payment.paidAmount}`, 10, 50);
    doc.text(`Payment Type: ${payment.paymentType}`, 10, 60);
    doc.text(
      `Paid Date: ${new Date(payment.paidDate).toLocaleDateString()}`,
      10,
      70
    );

    autoTable(doc, {
      startY: 80,
      head: [["ID", "Status", "Payment Type", "Paid Amount"]],
      body: [
        [
          payment.id,
          payment.status,
          payment.paymentType,
          `$${payment.paidAmount}`,
        ],
      ],
    });

    doc.save(`invoice_${payment.id}.pdf`);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <PageHeader title="Customer Payments" onCreateButtonClick={null} />

      <Tabs defaultValue="payments">
        <TabsList className="mb-6">
          <TabsTrigger className="text-white mr-5" value="payments">
            Table
          </TabsTrigger>
          <TabsTrigger className="text-white mr-5" value="reports">
            <BarChart2 className="mr-2" /> Financial Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <div className="mb-6 flex justify-between">
            <Input
              placeholder="Search by customer name"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full md:w-1/2"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact Number</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.customerName}</TableCell>
                  <TableCell>{payment.customerEmail}</TableCell>
                  <TableCell>{payment.contactNumber}</TableCell>
                  <TableCell>${payment.paidAmount}</TableCell>
                  <TableCell>
                    <Select
                      value={payment.status}
                      onValueChange={(value) =>
                        handleUpdateStatus(
                          payment.id,
                          value,
                          payment.customerEmail,
                          payment.paidAmount,
                          new Date(payment.createdAt),
                          payment.paymentType
                        )
                      }
                    >
                      <SelectTrigger style={{ background: "white" }}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{payment.paymentType}</TableCell>
                  <TableCell>
                    {new Date(payment.paidDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => generateInvoice(payment)}
                      className="mr-2"
                    >
                      <Printer />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeletePayment(payment.id)}
                    >
                      <TrashIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="reports">
          <PaymentCharts payments={payments} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPaymentPage;
