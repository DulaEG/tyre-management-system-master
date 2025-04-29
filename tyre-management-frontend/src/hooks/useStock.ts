import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllStocks,
  createStock,
  updateStock,
  deleteStock,
  getStockById,
} from "@/api/stockApi";
import { Stock } from "@/types/stock";
import { toast } from "sonner";

// Fetch all stocks
export const useStocks = () => {
  return useQuery<Stock[], Error>({
    queryKey: ["stocks"],
    queryFn: getAllStocks,
  });
};

// Fetch a single stock by ID
export const useStock = (id: string) => {
  return useQuery<Stock, Error>({
    queryKey: ["stock", id],
    queryFn: () => getStockById(id),
    enabled: !!id, // Only fetch if ID is provided
  });
};

// Create a new stock
export const useCreateStock = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Stock,
    Error,
    Omit<Stock, "id" | "createdAt" | "updatedAt">
  >({
    mutationFn: createStock,
    onSuccess: () => {
      toast.success("Stock created successfully!");
      queryClient.invalidateQueries({ queryKey: ["stocks"] }); // Refresh the stocks list
    },
    onError: (error) => {
      toast.error(`Failed to create stock: ${error.message}`);
    },
  });
};

// Update an existing stock
export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation<Stock, Error, { id: string; stockData: Partial<Stock> }>({
    mutationFn: ({ id, stockData }) => updateStock(id, stockData),
    onSuccess: () => {
      toast.success("Stock updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["stocks"] }); // Refresh the stocks list
    },
    onError: (error) => {
      toast.error(`Failed to update stock: ${error.message}`);
    },
  });
};

// Delete a stock
export const useDeleteStock = () => {
  const queryClient = useQueryClient();

  return useMutation<Stock, Error, string>({
    mutationFn: deleteStock,
    onSuccess: () => {
      toast.success("Stock deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["stocks"] }); // Refresh the stocks list
    },
    onError: (error) => {
      toast.error(`Failed to delete stock: ${error.message}`);
    },
  });
};
