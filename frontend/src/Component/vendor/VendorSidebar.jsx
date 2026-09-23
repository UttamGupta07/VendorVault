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
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const VendorSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/vendor/dashboard", icon: LayoutDashboard },
    { name: "Documents", path: "/vendor/documents", icon: FileText },
    { name: "Requests", path: "/vendor/requests", icon: ClipboardList },
    { name: "Notifications", path: "/vendor/notifications", icon: Bell },
    { name: "Profile", path: "/vendor/profile", icon: User },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
              <ShieldCheck size={21} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-white">VendorVault</h1>
              <p className="text-[10px] font-medium text-slate-400">Vendor Portal</p>
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

        <nav className="flex-1 overflow-y-auto px-3 py-6 vv-dark-scrollbar">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Workspace
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
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 rounded-xl border border-white/10 bg-white/[0.05] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15">
                <ShieldCheck size={18} className="text-blue-300" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Vendor Account</p>
                <p className="text-[10px] text-slate-500">Compliance Portal</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
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

export default VendorSidebar;
