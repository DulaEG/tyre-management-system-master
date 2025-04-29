import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createOrder } from "@/api/orderApi";
import { getStockById } from "@/api/stockApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import CardDetailsForm from "@/components/PaymentPage/CardDetailsForm";
import { motion } from "framer-motion";
import NavBar from "@/components/common/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Stock } from "@/types/stock";

const PaymentPage = () => {
  const { id } = useParams<{ id: string }>();
  const stockId = id;
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [stoke, setStock] = useState<Stock>();

  useEffect(() => {
    getStockById(stockId!).then((val) => setStock(val));
  }, [stockId]);

  const handleCreateOrder = async () => {
    if (!stockId) {
      toast.error("Stock ID is missing.");
      return;
    }

    try {
      // Fetch stock details to get the price
      const stock = await getStockById(stockId);
      setStock(stock);
      // Prepare order data
      const orderData = {
        customerId: localStorage.getItem("userId"),
        address,
        status: "pending",
        totalBill: stock.price * quantity,
        orderItems: [
          {
            stockId: stock.id,
            quantity,
            price: stock.price,
          },
        ],
      };

      // Create the order
      const order = await createOrder(orderData);
      toast.success("Order created successfully!");
      console.log("Order created:", order);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create order.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 text-white  w-screen"
    >
      <NavBar />
      <div className="max-w-2xl mx-auto mt-10">
        <Card className="bg-gray-800 border border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">
              Checkout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="address" className="text-gray-300 mb-4">
                Shipping Address
              </Label>
              <Textarea
                id="address"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-gray-700 text-white border-gray-600 resize-none h-24"
              />
            </div>

            <div>
              <Label htmlFor="quantity" className="text-gray-300 mb-4">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="bg-gray-700 text-white border-gray-600"
                min="1"
              />
            </div>

            <CardDetailsForm
              customerId={localStorage.getItem("userId")!}
              paidAmount={(stoke?.price ?? 0) * quantity}
              createOrder={handleCreateOrder}
            />

            {/* <Button
              onClick={handleCreateOrder}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Place Order"
              )}
            </Button> */}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default PaymentPage;
