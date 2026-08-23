 import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import SuperAdminSidebar from "../Component/superAdmin/SuperAdminSidebar";
import SuperAdminNavbar from "../Component/superAdmin/SuperAdminNavbar";

const SuperAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50">

      {/* ================= SIDEBAR ================= */}
      <SuperAdminSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* ================= MAIN AREA ================= */}
      <div className="h-screen w-full lg:pl-[250px]">

        {/* ================= NAVBAR ================= */}
        <SuperAdminNavbar
          setOpen={setSidebarOpen}
        />

        {/* ================= PAGE CONTENT ================= */}
        <main className="h-screen overflow-y-auto pt-[84px]">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default SuperAdminLayout;