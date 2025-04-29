import { useEffect, useState } from "react";
import { getAllOrders } from "@/api/orderApi";
import NavBar from "@/components/common/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Order } from "@/types/order";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const customerId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await getAllOrders();
        const userOrders = allOrders.filter(
          (order: Order) => order.customerId === customerId
        );
        setOrders(userOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-screen h-screen  bg-gray-900 text-white"
    >
      <NavBar />

      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-400">No orders found.</p>
        ) : (
          <motion.div className="space-y-4 w-full h-full flex flex-col items-center">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="bg-gray-800 border-gray-700 shadow-lg w-[80vw]  cursor-pointer"
                  onClick={() => toggleExpand(order.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg flex justify-between items-center">
                      <span className="text-white">
                        Order ID:{" "}
                        <span className="text-blue-400">{order.id}</span>
                      </span>
                      {expandedOrder === order.id ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-300">
                      <strong>Address:</strong> {order.address}
                    </p>
                    <p className="text-sm text-gray-300">
                      <strong>Total Bill:</strong> ${order.totalBill.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-300">
                      <strong>Date:</strong>{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "default"
                          : order.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                      }
                      className="w-fit"
                    >
                      {order.status}
                    </Badge>

                    {expandedOrder === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 border-t border-gray-600 pt-3"
                      >
                        <h2 className="text-md font-semibold text-blue-400">
                          Ordered Items
                        </h2>
                        <ul className="text-sm text-gray-300 list-disc pl-5 mt-2">
                          {order.orderItems?.map((item, index) => (
                            <li key={index}>
                              {item?.stock?.name ?? "N/A"} - $
                              {item.price.toFixed(2)}
                              <p className="mr-10">Quantiy {item.quantity}</p>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MyOrdersPage;
