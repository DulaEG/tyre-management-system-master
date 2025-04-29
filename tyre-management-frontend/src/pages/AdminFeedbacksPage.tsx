import { useState, useEffect } from "react";
import { getAllFeedbacks } from "@/api/feedbackApi";
import { Feedback } from "@/types/feedback";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminFeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    const data = await getAllFeedbacks();
    setFeedbacks(data);
  };

  const filteredFeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Customer Feedbacks Report", 14, 10);

    autoTable(doc, {
      head: [["ID", "Customer", "Type", "Stars", "Comment", "Created At"]],
      body: filteredFeedbacks.map((fb) => [
        fb.id,
        fb.customer?.name || "N/A",
        fb.type,
        fb.numOfStars,
        fb.comment || "-",
        new Date(fb.createdAt).toLocaleDateString(),
      ]),
    });

    doc.save("customer_feedbacks.pdf");
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <Input
          className="w-1/3"
          placeholder="Search feedbacks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={generatePDF}>Export PDF</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Stars</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFeedbacks.map((feedback) => (
            <TableRow key={feedback.id}>
              <TableCell>{feedback.customer?.name || "N/A"}</TableCell>
              <TableCell>{feedback.type}</TableCell>
              <TableCell>{feedback.numOfStars}</TableCell>
              <TableCell>{feedback.comment || "-"}</TableCell>
              <TableCell>
                {new Date(feedback.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminFeedbacksPage;
