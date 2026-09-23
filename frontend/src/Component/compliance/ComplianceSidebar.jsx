import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldCheck,
  Clock3,
  Mail,
  BarChart3,
  ClipboardList,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const ComplianceSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const mainMenu = [
    { name: "Dashboard", path: "/compliance/dashboard", icon: LayoutDashboard },
    { name: "Vendors", path: "/compliance/vendors", icon: Users },
    { name: "Documents", path: "/compliance/documents", icon: FileText },
    { name: "Compliance", path: "/compliance", icon: ShieldCheck },
    { name: "Expiry Tracker", path: "/compliance/expiry", icon: Clock3 },
    { name: "Email Delivery & Monitoring", path: "/compliance/email-delivery", icon: Mail },
  ];

  const managementMenu = [
    { name: "Reports", path: "/compliance/reports", icon: BarChart3 },
    { name: "Audit Logs", path: "/compliance/audit-logs", icon: ClipboardList },
    { name: "Settings", path: "/compliance/settings", icon: Settings },
  ];

  const { logout } = useAuth();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
          border-r border-slate-800/80 bg-[#071426]
          shadow-[8px_0_30px_rgba(7,20,38,0.12)]
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-900/30">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">VendorVault</h1>
              <p className="text-[10px] font-medium text-slate-400">Compliance Platform</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-6 vv-dark-scrollbar">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
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
                    `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-950/25"
                        : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white/90" />
                      )}
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                          isActive
                            ? "bg-white/15"
                            : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                        }`}
                      >
                        <Icon
                          size={18}
                          className={isActive ? "text-white" : "text-slate-400 group-hover:text-blue-300"}
                        />
                      </span>
                      <span className="truncate">{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-8">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
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
                      `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-950/25"
                          : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white/90" />
                        )}
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${isActive ? "bg-white/15" : "bg-white/[0.04] group-hover:bg-white/[0.08]"}`}>
                          <Icon size={18} className={isActive ? "text-white" : "text-slate-400 group-hover:text-blue-300"} />
                        </span>
                        <span className="truncate">{item.name}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-bold text-white">
              CO
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">Compliance Officer</p>
              <p className="truncate text-[10px] text-slate-500">Compliance Team</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.12)]" />
          </div>

          <button
            onClick={async () => {
              try {
                await logout();
              } catch (error) {
                console.error("Logout failed:", error);
              }
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
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
