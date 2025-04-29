import PageHeader from "@/components/common/PageHeader";
import { useState } from "react";

const EmployeeDocsManagementPage = () => {
  const [state, setState] = useState({
    createEditButtonOpened: false as boolean,
  });
  return (
    <div className="w-full h-full  p-4">
      <PageHeader
        title="Employee Documents Management"
        onCreateButtonClick={() =>
          setState((prev) => ({ ...prev, createEditButtonOpened: true }))
        }
      />
    </div>
  );
};

export default EmployeeDocsManagementPage;
