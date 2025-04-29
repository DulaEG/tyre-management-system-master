import { useEffect, useState } from "react";
import { getAllOrders, updateOrder, deleteOrder } from "@/api/orderApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Trash2, Eye } from "lucide-react"; // Added X icon for close button
import { motion } from "framer-motion";
import { Order } from "@/types/order";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Added DialogFooter
import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component
import { toast } from "sonner";

const OrderManagementPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await getAllOrders();
        setOrders(allOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order status update to " + newStatus);
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleDelete = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  const handleViewOrderDetails = (orderId: string) => {
    const order = orders.find((order) => order.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setDialogOpen(true);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col bg-white text-black"
    >
      <div className="max-w-5xl mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Order Management
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders available.</p>
        ) : (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total Bill</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>{order.customer?.name ?? "N/A"}</TableCell>
                        <TableCell>${order.totalBill.toFixed(2)}</TableCell>
                        <TableCell className="bg-white">
                          <Select
                            onValueChange={(value) =>
                              handleStatusChange(order.id, value)
                            }
                            value={order.status}
                          >
                            <SelectTrigger
                              className="w-[150px] bg-white"
                              style={{ background: "white" }}
                            >
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">
                                Processing
                              </SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleViewOrderDetails(order.id)}
                            className="text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(order.id)}
                            className="text-white bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>Order Details #{selectedOrder.id}</span>
                <Badge className={getStatusBadgeColor(selectedOrder.status)}>
                  {selectedOrder.status.toUpperCase()}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">
                      {selectedOrder.customer?.name ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="font-medium">{selectedOrder.address}</p>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Order Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Items</p>
                    <p className="font-medium">
                      {selectedOrder.orderItems.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Bill</p>
                    <p className="font-medium text-green-600">
                      ${selectedOrder.totalBill.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-medium mb-3">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.orderItems.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-gray-500"
                        >
                          No items found for this order.
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedOrder.orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.stock?.name || "Unknown Item"}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell>
                            ${(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {/* Summary */}
                <div className="flex justify-end mt-4">
                  <div className="bg-gray-50 p-3 rounded-lg w-64">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>${selectedOrder.totalBill.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">
                        ${selectedOrder.totalBill.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="text-white bg-gray-600 hover:bg-gray-700"
              >
                Close
              </Button>
              <Button
                onClick={() =>
                  handleStatusChange(selectedOrder.id, "completed")
                }
                className="text-white bg-green-600 hover:bg-green-700"
                disabled={selectedOrder.status === "completed"}
              >
                Mark as Completed
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default OrderManagementPage;
