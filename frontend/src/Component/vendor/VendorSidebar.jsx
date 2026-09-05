import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Bell,
  User,
  X,
  ShieldCheck,
} from "lucide-react";

const VendorSidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {

  const menuItems = [
    {
      name: "Dashboard",
      path: "/vendor/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Documents",
      path: "/vendor/documents",
      icon: FileText,
    },
    {
      name: "Requests",
      path: "/vendor/requests",
      icon: ClipboardList,
    },
    {
      name: "Notifications",
      path: "/vendor/notifications",
      icon: Bell,
    },
    {
      name: "Profile",
      path: "/vendor/profile",
      icon: User,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0
          w-64 h-screen
          bg-white
          border-r border-gray-200
          z-50
          transition-transform duration-300

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">

              <ShieldCheck
                size={21}
                className="text-white"
              />

            </div>

            <div>

              <h1 className="font-bold text-gray-900">
                VendorVault
              </h1>

              <p className="text-xs text-gray-500">
                Vendor Portal
              </p>

            </div>

          </div>

          {/* Mobile close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X size={21} />
          </button>

        </div>

        {/* Menu */}
        <nav className="p-4">

          <p className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase">
            Menu
          </p>

          <div className="space-y-1">

            {menuItems.map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3
                    px-3 py-2.5
                    rounded-lg
                    text-sm font-medium
                    transition

                    ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                    `
                  }
                >

                  <Icon size={19} />

                  <span>
                    {item.name}
                  </span>

                </NavLink>
              );

            })}

          </div>

        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">

          <div className="bg-gray-50 rounded-lg p-3">

            <div className="flex items-center gap-2">

              <ShieldCheck
                size={18}
                className="text-gray-600"
              />

              <div>

                <p className="text-xs font-medium text-gray-700">
                  Vendor Account
                </p>

                <p className="text-xs text-gray-500">
                  Compliance Portal
                </p>

              </div>

            </div>

          </div>

        </div>

      </aside>
    </>
  );
};

export default VendorSidebar;