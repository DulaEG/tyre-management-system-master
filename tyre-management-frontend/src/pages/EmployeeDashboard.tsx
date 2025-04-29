import { useState } from "react";

import StockManagementPage from "./StockManagementPage";
import OrderManagementPage from "./OrderManagementPage";
import EmployeeSidebar from "@/components/EmployeeDashboard/EmployeeSidebar";
import EmployeeLeacesRequestPage from "./EmployeeLeacesRequestPage";

const EmployeeDashboard = () => {
  const [activeKey, setActiveKey] = useState("leave");

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <EmployeeSidebar onMenuItemClicked={setActiveKey} activeKey={activeKey} />

      {/* Main Content */}
      <div className="flex-1 p-6 w-full h-full bg-white">
        {activeKey === "leave" && <EmployeeLeacesRequestPage />}
        {activeKey === "stock" && <StockManagementPage />}
        {activeKey === "order" && <OrderManagementPage />}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
