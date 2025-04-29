import { Request, Response, NextFunction } from "express";
import { sendEmail } from "./service";

// Send email controller
export const sendEmailHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { to, subject, text, html } = req.body;

    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await sendEmail({ to, subject, text, html });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    next(error);
  }
};
