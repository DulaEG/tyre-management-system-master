import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { useStocks, useDeleteStock } from "@/hooks/useStock";
import { toast } from "sonner";
import { Stock } from "@/types/stock";
import StockTable from "@/components/StocksPage/StocksTable";
import CreateEditStockModal from "@/components/StocksPage/CreateEditStockModal";

const StockManagementPage = () => {
  const [state, setState] = useState({
    createEditButtonOpened: false,
    selectedStock: null as Stock | null,
  });

  // Fetch all stocks
  const { data: stocks, isLoading, isError } = useStocks();

  // Delete stock mutation
  const deleteStockMutation = useDeleteStock();

  // Handle delete stock
  const handleDeleteStock = async (id: string) => {
    try {
      await deleteStockMutation.mutateAsync(id);
      toast.success("Stock deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete stock.");
    }
  };

  // Handle edit stock
  const handleEditStock = (stock: Stock) => {
    setState((prev) => ({
      ...prev,
      selectedStock: stock,
      createEditButtonOpened: true,
    }));
  };

  // Handle modal close
  const handleModalClose = () => {
    setState((prev) => ({
      ...prev,
      createEditButtonOpened: false,
      selectedStock: null,
    }));
  };

  return (
    <div className="w-full h-full p-4">
      <PageHeader
        title="Stock Management"
        onCreateButtonClick={() =>
          setState((prev) => ({ ...prev, createEditButtonOpened: true }))
        }
      />
      <div className="overflow-auto max-h-[700px]">
        {" "}
        <StockTable
          stocks={stocks || []}
          onEdit={handleEditStock}
          onDelete={handleDeleteStock}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
      <CreateEditStockModal
        isOpen={state.createEditButtonOpened}
        onClose={handleModalClose}
        stock={state.selectedStock}
      />
    </div>
  );
};

export default StockManagementPage;
