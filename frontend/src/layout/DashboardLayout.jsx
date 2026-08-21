import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">

        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700"
          >
            ☰
          </button>
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;