import { Stock } from "@/types/stock";
import { EmailOptions, sendEmailApi } from "./emailApi";

/**
 * Sends a notification email for items that are low in stock (10 or less)
 * @param stocks Array of stock items to check
 * @param recipientEmail Email address to send the notification to
 * @returns Promise that resolves when the email is sent
 */
export const sendLowStockNotification = async (
  stocks: Stock[],
  recipientEmail: string = "sasiniashani2002@gmail.com"
): Promise<void> => {
  try {
    // Filter stocks that have 10 or less items in stock
    const lowStockItems = stocks.filter((stock) => stock.inStock <= 10);

    // If no low stock items, no need to send an email
    if (lowStockItems.length === 0) {
      console.log("No low stock items to report");
      return;
    }

    // Create text version of the email
    const textContent = `
Low Stock Alert: ${lowStockItems.length} items need attention

The following items are running low (10 or fewer in stock):
${lowStockItems
  .map((item) => `- ${item.name}: ${item.inStock} remaining`)
  .join("\n")}

Please review the inventory and consider restocking these items.
    `.trim();

    // Create HTML version of the email for better formatting
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .low { color: orange; }
    .critical { color: red; font-weight: bold; }
  </style>
</head>
<body>
  <h2>Low Stock Alert: ${lowStockItems.length} items need attention</h2>
  <p>The following items are running low and may need to be restocked:</p>
  
  <table>
    <thead>
      <tr>
        <th>Item Name</th>
        <th>Description</th>
        <th>Current Stock</th>
        <th>Price</th>
        <th>Type</th>
      </tr>
    </thead>
    <tbody>
      ${lowStockItems
        .map(
          (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.description}</td>
          <td class="${item.inStock <= 5 ? "critical" : "low"}">${
            item.inStock
          }</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>${item.type}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
  
  <p>Please review the inventory and consider restocking these items.</p>
</body>
</html>
    `.trim();

    // Email options
    const emailOptions: EmailOptions = {
      to: recipientEmail,
      subject: `Low Stock Alert: ${lowStockItems.length} items need attention`,
      text: textContent,
      html: htmlContent,
    };

    // Send the email
    await sendEmailApi(emailOptions);
    console.log(`Low stock notification sent to ${recipientEmail}`);
  } catch (error) {
    console.error("Failed to send low stock notification:", error);
    throw error;
  }
};

/**
 * Function to check stock levels and send notification if needed
 * Can be used on a schedule or after inventory updates
 */
export const checkAndNotifyLowStock = async (
  recipientEmail: string = "sasiniashani2002@gmail.com",
  stocks: Stock[]
): Promise<void> => {
  try {
    // Send notification for low stock items
    await sendLowStockNotification(stocks, recipientEmail);
  } catch (error) {
    console.error("Error checking stock levels:", error);
    throw error;
  }
};
