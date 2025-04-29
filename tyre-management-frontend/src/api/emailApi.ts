import axiosInstance from "./axiosConfig";

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendEmailApi = async (options: EmailOptions) => {
  try {
    axiosInstance.post("/email/send", options);
  } catch (error) {
    console.error(error);
  }
};
