import express from "express";
import {
  createCustomerHandler,
  loginCustomer,
  getAllCustomersHandler,
  getCustomerByIdHandler,
  updateCustomerHandler,
  updateCustomerPasswod,
  deleteCustomerHandler,
} from "./controller";

const router = express.Router();

// Public routes
router.post("/login", loginCustomer);
router.post("/", createCustomerHandler);

// Fetch customer data
router.get("/", getAllCustomersHandler);
router.get("/:id", getCustomerByIdHandler);

// Update customer data
router.put("/update-password", updateCustomerPasswod);
router.put("/:id", updateCustomerHandler);

// Delete customer
router.delete("/:id", deleteCustomerHandler);

export default router;
