import express from "express";
import {
  getAllStocksHandler,
  getStockByIdHandler,
  createStockHandler,
  updateStockHandler,
  deleteStockHandler,
} from "./controller";

const router = express.Router();

// Stock routes
router.get("/", getAllStocksHandler);
router.get("/:id", getStockByIdHandler);
router.post("/", createStockHandler);
router.put("/:id", updateStockHandler);
router.delete("/:id", deleteStockHandler);

export default router;
