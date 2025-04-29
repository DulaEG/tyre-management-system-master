import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { EmployeeLeave } from "@/types/employee-leaves";
import { Button } from "@/components/ui/button";
import { Trash2, Download } from "lucide-react";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { formatDate } from "@/lib/helpers";

interface EmployeeLeaveTableProps {
  employeeLeaves: EmployeeLeave[];
  onEdit: (employeeLeave: EmployeeLeave) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  isError: boolean;
}

const EmployeeLeaveTable = ({
  employeeLeaves,
  onEdit,
  onDelete,
  isLoading,
  isError,
}: EmployeeLeaveTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const columnHelper = createColumnHelper<EmployeeLeave>();

  // Define columns for TanStack Table
  const columns = useMemo(
    () => [
      columnHelper.accessor("employee.employeeId", {
        header: "Employee ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("startDate", {
        header: "Start Date",
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.accessor("endDate", {
        header: "End Date",
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const leave = info.row.original;
          return (
            <select
              value={leave.status}
              onChange={(e) => onEdit({ ...leave, status: e.target.value })}
              className="border p-1 rounded-md"
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          );
        },
      }),
      columnHelper.accessor("reason", {
        header: "Reason",
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
              onClick={() => onDelete(info.row.original.id)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        ),
      }),
    ],
    [onDelete, onEdit, columnHelper]
  );

  // Initialize TanStack Table
  const table = useReactTable({
    data: employeeLeaves,
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
    doc.text("Employee Leave Report", 10, 10);
    autoTable(doc, {
      head: [["Employee ID", "Start Date", "End Date", "Status", "Reason"]],
      body: table
        .getFilteredRowModel()
        .rows.map((row) => [
          row.original.employee.employeeId,
          formatDate(row.original.startDate),
          formatDate(row.original.endDate),
          row.original.status,
          row.original.reason,
        ]),
    });
    doc.save("employee_leave_report.pdf");
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading employee leaves.</div>;

  return (
    <div className="mt-4 bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by employee ID..."
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

export default EmployeeLeaveTable;
