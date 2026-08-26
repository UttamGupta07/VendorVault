import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ComplianceSidebar from "../Component/compliance/ComplianceSidebar";
import ComplianceNavbar from "../Component/compliance/ComplianceNavbar";

const ComplianceOfficerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <ComplianceSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Navbar */}
        <ComplianceNavbar setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ComplianceOfficerLayout;