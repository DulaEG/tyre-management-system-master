import express from "express";
import {
  createEmployeeLeaveHandler,
  getEmployeeLeavesByEmployeeIdHandler,
  updateEmployeeLeaveHandler,
  deleteEmployeeLeaveHandler,
  getEmployeeLeavesAllC,
} from "./controller";

const router = express.Router();

// Employee leave routes
router.post("/", createEmployeeLeaveHandler);
router.get("/", getEmployeeLeavesAllC);
router.get("/:employeeId", getEmployeeLeavesByEmployeeIdHandler);
router.put("/:id", updateEmployeeLeaveHandler);
router.delete("/:id", deleteEmployeeLeaveHandler);

export default router;
