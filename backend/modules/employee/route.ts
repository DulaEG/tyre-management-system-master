import express from "express";
import {
  createEmployeeHandler,
  getAllEmployeesHandler,
  getEmployeeByIdHandler,
  updateEmployeeHandler,
  deleteEmployeeHandler,
  loginEmployeeHandler,
} from "./controller";

const router = express.Router();

// Employee routes
router.post("/", createEmployeeHandler);
router.get("/", getAllEmployeesHandler);
router.get("/:id", getEmployeeByIdHandler);
router.put("/:id", updateEmployeeHandler);
router.delete("/:id", deleteEmployeeHandler);
router.post("/login", loginEmployeeHandler);

export default router;
