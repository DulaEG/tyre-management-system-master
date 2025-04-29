import { getLastReminderDate, setLastReminderDate } from "@/lib/indexDB";
import { EmailOptions, sendEmailApi } from "./emailApi";
import { getAllOrders } from "./orderApi";

export const sendReminderApi = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    // Check if a reminder was already sent today
    const lastReminderDate = await getLastReminderDate(userId);
    const today = new Date();
    const todayDateString = today.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (
      lastReminderDate &&
      lastReminderDate.toISOString().split("T")[0] === todayDateString
    ) {
      console.log("Reminder already sent today.");
      return;
    }

    const orders = await getAllOrders();
    const userOrders = orders.filter((order) => order.customerId === userId);

    for (const order of userOrders) {
      const createdAt = new Date(order.createdAt); // Convert to Date object

      for (const orderItem of order.orderItems) {
        const lifespan = orderItem.stock?.lifespan; // Get lifespan (in days)
        if (lifespan) {
          const expiryDate = new Date(createdAt);
          expiryDate.setDate(createdAt.getDate() + lifespan); // Add lifespan days

          const daysLeft = Math.ceil(
            (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysLeft <= 7) {
            const options: EmailOptions = generateExpirationEmail(
              orderItem.stock?.name ?? "N/A",
              daysLeft,
              order.customer?.email ?? "darksparrow156+10@gmail.com"
            );
            await sendEmailApi(options);
          }
        }
      }
    }

    // Update the last reminder date in IndexedDB
    await setLastReminderDate(userId, today);
    console.log("Reminder sent successfully.");
  } catch (error) {
    console.error("Error checking item lifespan:", error);
  }
};
export const generateExpirationEmail = (
  productName: string,
  daysLeft: number,
  email: string
): EmailOptions => {
  return {
    to: email,
    subject: `Renewal Reminder: Your ${productName} is expiring soon!`,
    text: `Dear Customer,
  
  We hope you're enjoying your ${productName}. This is a friendly reminder that your product will expire in ${daysLeft} days.
  
  To avoid any interruptions, please consider renewing it before the expiration date.
  
  Click the link below to renew now:
  [Renew Now](#)
  
  If you have any questions, feel free to contact us.
  
  Best regards,  
  Your Company Name`,
    html: `
        <p>Dear Customer,</p>
        <p>We hope you're enjoying your <strong>${productName}</strong>. This is a friendly reminder that your product will expire in <strong>${daysLeft} days</strong>.</p>
        <p>To avoid any interruptions, please consider renewing it before the expiration date.</p>
        <p><a href="#" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Renew Now</a></p>
        <p>If you have any questions, feel free to contact us.</p>
        <p>Best regards,</p>
        <p><strong>TireZone</strong></p>
      `,
  };
};
