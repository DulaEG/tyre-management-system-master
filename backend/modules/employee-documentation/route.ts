import express from "express";
import {
  createEmployeeDocumentHandler,
  getEmployeeDocumentByEmployeeIdHandler,
  updateEmployeeDocumentHandler,
  deleteEmployeeDocumentHandler,
} from "./controller";

const router = express.Router();

// Employee document routes
router.post("/", createEmployeeDocumentHandler);
router.get("/:employeeId", getEmployeeDocumentByEmployeeIdHandler);
router.put("/:id", updateEmployeeDocumentHandler);
router.delete("/:id", deleteEmployeeDocumentHandler);

export default router;
