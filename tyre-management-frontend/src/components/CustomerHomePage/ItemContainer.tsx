import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { getAllStocks } from "@/api/stockApi";
import { Stock } from "@/types/stock";

const ItemContainer = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useNavigate();

  useEffect(() => {
    getAllStocks()
      .then((data) => {
        setStocks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stocks.map((stock) => (
          <motion.div
            key={stock.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className="cursor-pointer border border-gray-700 bg-gradient-to-br from-gray-900 to-black text-white rounded-lg overflow-hidden transition duration-300 hover:brightness-110"
              onClick={() => router(`/item-view/${stock.id}`)}
            >
              <img
                src={stock.imageUrl}
                alt={stock.name}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">{stock.name}</h3>
                <p className="text-gray-300 text-sm truncate">
                  {stock.description}
                </p>
                <p className="text-blue-400 font-bold">${stock.price}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ItemContainer;
