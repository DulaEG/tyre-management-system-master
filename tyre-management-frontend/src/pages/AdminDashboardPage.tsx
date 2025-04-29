import { useState } from "react";
import Sidebar from "@/components/AdminDashboard/Sidebar";
import CustomerManagementPage from "./CustomerManagementPage";
import EmployeesPage from "./EmployeesManagementPage";
import EmployeeLeaveManagementPage from "./EmployeeLeaveManagementPage";
import EmployeeDocsManagementPage from "./EmployeeDocsManagementPage";
import StockManagementPage from "./StockManagementPage";
import OrderManagementPage from "./OrderManagementPage";
import AdminFeedbacksPage from "./AdminFeedbacksPage";
import AdminPaymentPage from "./AdminPaymentPage";

const AdminDashboardPage = () => {
  const [activeKey, setActiveKey] = useState("customer");

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <Sidebar onMenuItemClicked={setActiveKey} activeKey={activeKey} />

      {/* Main Content */}
      <div className="flex-1 p-6 w-full h-full bg-white">
        {activeKey === "customer" && <CustomerManagementPage />}
        {activeKey === "employee" && <EmployeesPage />}
        {activeKey === "leave" && <EmployeeLeaveManagementPage />}
        {activeKey === "documentation" && <EmployeeDocsManagementPage />}
        {activeKey === "stock" && <StockManagementPage />}
        {activeKey === "order" && <OrderManagementPage />}
        {activeKey === "feedback" && <AdminFeedbacksPage />}
        {activeKey === "payment" && <AdminPaymentPage />}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
