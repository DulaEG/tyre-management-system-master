import express from "express";
import {
  createOrderHandler,
  getAllOrdersHandler,
  getOrderByIdHandler,
  updateOrderHandler,
  deleteOrderHandler,
} from "./controller";

const router = express.Router();

// Order routes
router.post("/", createOrderHandler);
router.get("/", getAllOrdersHandler);
router.get("/:id", getOrderByIdHandler);
router.put("/:id", updateOrderHandler);
router.delete("/:id", deleteOrderHandler);

export default router;
