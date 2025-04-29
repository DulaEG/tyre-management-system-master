import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PageHeader from "@/components/common/PageHeader";
import CreateEditCustomerModal from "@/components/CustomerPage/CreateEditCustomerModal";
import CustomerTable from "@/components/CustomerPage/CustomerTable";
import MonthlyCustomerCountChart from "@/components/CustomerPage/MonthlyCustomerCountChart";
import { Customer } from "@/types/customer";
import { useCustomers, useDeleteCustomer } from "@/hooks/useCustomer";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { Button } from "@/components/ui/button";

const CustomerManagementPage = () => {
  const [state, setState] = useState({
    createEditButtonOpened: false,
    selectedCustomer: null as Customer | null,
  });

  // Fetch all customers
  const { data: customers, isLoading, isError } = useCustomers();

  // Delete customer mutation
  const deleteCustomerMutation = useDeleteCustomer();

  // Handle delete customer
  const handleDeleteCustomer = async (id: string) => {
    try {
      await deleteCustomerMutation.mutateAsync(id);
      toast.success("Customer deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete customer.");
    }
  };

  // Handle edit customer
  const handleEditCustomer = (customer: Customer) => {
    setState((prev) => ({
      ...prev,
      selectedCustomer: customer,
      createEditButtonOpened: true,
    }));
  };

  // Handle create/edit modal close
  const handleModalClose = () => {
    setState((prev) => ({
      ...prev,
      createEditButtonOpened: false,
      selectedCustomer: null,
    }));
  };

  // Generate PDF report for monthly customer count
  const generateMonthlyCustomerReport = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Monthly Customer Count Report", 10, 10);

    // Group customers by month
    const monthlyData = customers?.reduce((acc, customer) => {
      const month = new Date(customer.createdAt).toLocaleString("default", {
        month: "short",
      });
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month]++;
      return acc;
    }, {} as Record<string, number>);

    const tableData = Object.keys(monthlyData || {}).map((month) => [
      month,
      monthlyData?.[month],
    ]);

    // Add table
    autoTable(doc, {
      startY: 20,
      head: [["Month", "Customer Count"]],
      body: tableData,
    });

    // Save the PDF
    doc.save("monthly_customer_report.pdf");
  };

  return (
    <div className="w-full h-full p-4">
      <PageHeader title="Customer Management" onCreateButtonClick={null} />
      <Button className="mt-5" onClick={generateMonthlyCustomerReport}>
        Generate Monthly Report
      </Button>
      <Tabs defaultValue="customers">
        <TabsList>
          <TabsTrigger className="text-white mr-8" value="customers">
            Customers
          </TabsTrigger>
          <TabsTrigger className="text-white mr-8" value="reports">
            Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="customers">
          <CustomerTable
            customers={customers || []}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
            isLoading={isLoading}
            isError={isError}
          />
        </TabsContent>
        <TabsContent value="reports">
          <MonthlyCustomerCountChart customers={customers || []} />
        </TabsContent>
      </Tabs>

      <CreateEditCustomerModal
        isOpen={state.createEditButtonOpened}
        onClose={handleModalClose}
        customer={state.selectedCustomer}
      />
    </div>
  );
};

export default CustomerManagementPage;
