import express from "express";
import cors from "cors";
import stockRoutes from "./modules/stock/route";
import customerRoutes from "./modules/customer/route";
import emailRoutes from "./modules/emails/routes";
import paymentRoutes from "./modules/payment/route";
import employeeRoutes from "./modules/employee/route";
import employeeDocumentRoutes from "./modules/employee-documentation/route";
import employeeLeaveRoutes from "./modules/employee-leaves/route";
import orderRoutes from "./modules/order/route";
import feedbackRoutes from "./modules/feedback/route";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/stocks", stockRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/employee-documents", employeeDocumentRoutes);
app.use("/api/employee-leaves", employeeLeaveRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/feedbacks", feedbackRoutes);

export default app;
