import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStockById } from "@/api/stockApi";
import { Stock } from "@/types/stock";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/common/Navbar";

const SingleItemPage = () => {
  const { id } = useParams();
  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getStockById(id)
        .then((data) => {
          setStock(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="flex justify-center items-center h-screen text-red-400">
        Item not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Navbar */}
      <NavBar />

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="flex justify-center">
            <img
              src={stock.imageUrl}
              alt={stock.name}
              className="w-full max-w-md rounded-lg shadow-md"
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-3xl font-bold">{stock.name}</h1>
            <p className="text-gray-300">{stock.description}</p>
            <p className="text-blue-400 text-2xl font-semibold">
              ${stock.price}
            </p>
            <p className="text-sm text-gray-400">Type: {stock.type}</p>
            <p className="text-sm text-gray-400">In Stock: {stock.inStock}</p>

            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              onClick={() => navigate(`/payment-view/${stock.id}`)}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleItemPage;
