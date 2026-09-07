 import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import VendorNavbar from "../Component/vendor/VendorNavbar";
import VendorSidebar from "../Component/vendor/VendorSidebar";

const VendorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      <VendorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="lg:ml-64">

        <VendorNavbar
          setSidebarOpen={setSidebarOpen}
        />

        <main className="p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default VendorLayout;