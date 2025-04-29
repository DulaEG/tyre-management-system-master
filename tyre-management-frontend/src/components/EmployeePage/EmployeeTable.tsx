import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Employee } from "@/types/employee";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Download } from "lucide-react";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  isError: boolean;
}

const EmployeeTable = ({
  employees,
  onEdit,
  onDelete,
  isLoading,
  isError,
}: EmployeeTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const columnHelper = createColumnHelper<Employee>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("employeeId", {
        header: "Employee ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("role", {
        header: "Role",
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

  const table = useReactTable({
    data: employees,
    columns,
    state: {
      globalFilter: searchQuery,
    },
    onGlobalFilterChange: setSearchQuery,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee Report", 10, 10);
    autoTable(doc, {
      head: [["Name", "Role", "Contact Number"]],
      body: table
        .getFilteredRowModel()
        .rows.map((row) => [
          row.original.name,
          row.original.role,
          row.original.contactNumber,
        ]),
    });
    doc.save("employee_report.pdf");
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading employees.</div>;

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

export default EmployeeTable;
