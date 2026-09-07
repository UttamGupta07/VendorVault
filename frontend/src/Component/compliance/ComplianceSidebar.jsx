import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldCheck,
  Clock3,
  Bell,
  BarChart3,
  ClipboardList,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const ComplianceSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const mainMenu = [
    {
      name: "Dashboard",
      path: "/compliance/dashboard",
      icon: LayoutDashboard,
    },
    {  
      name: "Vendors",
      path: "/compliance/vendors",
      icon: Users,
    },
    {
      name: "Documents",
      path: "/compliance/documents",
      icon: FileText,
    },
    {
      name: "Compliance",
      path: "/compliance",
      icon: ShieldCheck,
    },
    {
      name: "Expiry Tracker",
      path: "/compliance/expiry",
      icon: Clock3,
    },
    {
      name: "Alerts",
      path: "/compliance/alerts",
      icon: Bell,
      badge: 8,
    },
  ];

  const managementMenu = [
    {
      name: "Reports",
      path: "/compliance/reports",
      icon: BarChart3,
    },
    {
      name: "Audit Logs",
      path: "/compliance/audit-logs",
      icon: ClipboardList,
    },
    {
      name: "Settings",
      path: "/compliance/settings",
      icon: Settings,
    },
  ];
  const {logout}=useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-64
          flex-col
          border-r
          border-slate-200
          bg-white
          transition-transform
          duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Logo */}
        <div className="flex h-[72px] items-center justify-between border-b border-slate-100 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                VendorVault
              </h1>

              <p className="text-[10px] text-slate-400">
                Compliance Platform
              </p>
            </div>
          </div>

          {/* Mobile Close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {/* Main Menu */}
          <div>
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Main Menu
            </p>

            <nav className="space-y-1">
              {mainMenu.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === "/compliance"}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      px-3
                      py-3
                      text-sm
                      font-medium
                      transition
                      ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                      `
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon
                            size={19}
                            className={
                              isActive
                                ? "text-indigo-600"
                                : "text-slate-400"
                            }
                          />

                          <span>{item.name}</span>
                        </div>

                        {item.badge && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Management */}
          <div className="mt-8">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Management
            </p>

            <nav className="space-y-1">
              {managementMenu.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-3
                      text-sm
                      font-medium
                      transition
                      ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                      `
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={19}
                          className={
                            isActive
                              ? "text-indigo-600"
                              : "text-slate-400"
                          }
                        />

                        <span>{item.name}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Section */}
        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
              CO
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                Compliance Officer
              </p>

              <p className="truncate text-xs text-slate-400">
                Officer Account
              </p>
            </div>
          </div>

          <button
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-sm
              text-slate-500
              transition
              hover:bg-red-50
              hover:text-red-600
            "
            onClick={()=>{logout()}}
          >
            <LogOut size={18} />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default ComplianceSidebar;