import express from "express";
import { sendEmailHandler } from "./controller";

const router = express.Router();

// Send email route
router.post("/send", sendEmailHandler);

export default router;
