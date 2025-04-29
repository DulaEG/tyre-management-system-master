import express from "express";
import {
  createPaymentHandler,
  getAllPaymentsHandler,
  getPaymentByIdHandler,
  updatePaymentHandler,
  deletePaymentHandler,
} from "./controller";

const router = express.Router();

// Payment routes
router.post("/", createPaymentHandler);
router.get("/", getAllPaymentsHandler);
router.get("/:id", getPaymentByIdHandler);
router.put("/:id", updatePaymentHandler);
router.delete("/:id", deletePaymentHandler);

export default router;
