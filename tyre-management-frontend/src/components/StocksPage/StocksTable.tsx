import { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Stock } from "@/types/stock";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Download } from "lucide-react";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { sendLowStockNotification } from "@/api/lowStockApi";

interface StockTableProps {
  stocks: Stock[];
  onEdit: (stock: Stock) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  isError: boolean;
}

const StockTable = ({
  stocks,
  onEdit,
  onDelete,
  isLoading,
  isError,
}: StockTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const columnHelper = createColumnHelper<Stock>();

  // Define columns for TanStack Table
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("inStock", {
        header: "In Stock",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: (info) => `$${info.getValue().toFixed(2)}`,
      }),
      columnHelper.accessor("type", {
        header: "Type",
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              style={{ color: "white" }}
              onClick={() => onEdit(info.row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(info.row.original.id)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit, onDelete, columnHelper]
  );

  // Initialize TanStack Table
  const table = useReactTable({
    data: stocks,
    columns,
    state: {
      globalFilter: searchQuery,
    },
    onGlobalFilterChange: setSearchQuery,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  // Handle PDF export
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Stock Report", 10, 10);
    autoTable(doc, {
      head: [["Name", "Description", "In Stock", "Price", "Type"]],
      body: table
        .getFilteredRowModel()
        .rows.map((row) => [
          row.original.name,
          row.original.description,
          row.original.inStock,
          `$${row.original.price.toFixed(2)}`,
          row.original.type,
        ]),
    });
    doc.save("stock_report.pdf");
  };

  useEffect(() => {
    if (stocks.filter((stock) => stock.inStock <= 10)) {
      sendLowStockNotification(
        stocks.filter((stock) => stock.inStock <= 10) ?? []
      );
    }
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading stocks.</div>;

  return (
    <div className="mt-4 bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-lg w-64"
        />
        <Button
          onClick={handleExportPDF}
          className="bg-green-600 hover:bg-green-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-2 text-left">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
