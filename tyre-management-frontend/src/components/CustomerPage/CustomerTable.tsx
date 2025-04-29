import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Customer } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Download } from "lucide-react";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  isError: boolean;
}

const CustomerTable = ({
  customers,
  onEdit,
  onDelete,
  isLoading,
  isError,
}: CustomerTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const columnHelper = createColumnHelper<Customer>();

  // Define columns for TanStack Table v8
  const columns = useMemo(
    () => [
      columnHelper.accessor("customerId", {
        header: "CustomerId",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("contactNumber", {
        header: "Contact Number",
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
    data: customers,
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
    doc.text("Customer Report", 10, 10);
    autoTable(doc, {
      head: [["Name", "Email", "Contact Number"]],
      body: table
        .getFilteredRowModel()
        .rows.map((row) => [
          row.original.name,
          row.original.email,
          row.original.contactNumber,
        ]),
    });
    doc.save("customer_report.pdf");
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading customers.</div>;

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

export default CustomerTable;
