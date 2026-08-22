 import React from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  Truck,
  UserCheck,
  UsersRound,
  FileText,
  AlertTriangle,
  BarChart3,
  Activity,
  Settings,
  X,
} from "lucide-react";

const SuperAdminSidebar = ({ open, setOpen }) => {
  const navItems = [
    {
      name: "Dashboard",
      path: "/super-admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Organizations",
      path: "/super-admin/organizations",
      icon: Building2,
    },
    {
      name: "Users",
      path: "/super-admin/users",
      icon: Users,
    },
    {
      name: "Roles & Permissions",
      path: "/super-admin/roles",
      icon: ShieldCheck,
    },
    {
      name: "Vendors",
      path: "/super-admin/vendors",
      icon: Truck,
    },
    {
      name: "Auditors",
      path: "/super-admin/auditors",
      icon: UserCheck,
    },
    {
      name: "Compliance Teams",
      path: "/super-admin/compliance-teams",
      icon: UsersRound,
    },
    {
      name: "Documents Overview",
      path: "/super-admin/documents",
      icon: FileText,
    },
    {
      name: "System Alerts",
      path: "/super-admin/alerts",
      icon: AlertTriangle,
    },
    {
      name: "Reports & Analytics",
      path: "/super-admin/reports",
      icon: BarChart3,
    },
    {
      name: "Activity Logs",
      path: "/super-admin/activity-logs",
      icon: Activity,
    },
    {
      name: "Settings",
      path: "/super-admin/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* ================= MOBILE OVERLAY ================= */}

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-[250px]
          flex-col
          bg-[#0b1930]
          text-white
          shadow-xl
          transition-transform
          duration-300
          ease-in-out

          lg:translate-x-0

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* ================= LOGO ================= */}

        <div className="flex h-[84px] shrink-0 items-center justify-between border-b border-white/10 px-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600">
              <ShieldCheck size={25} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              VendorVault
            </span>

          </div>

          {/* Mobile Close Button */}

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={21} />
          </button>

        </div>

        {/* ================= NAVIGATION AREA ================= */}

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-6">

          {/* Section Title */}

          <p className="mb-4 px-3 text-xs font-medium uppercase tracking-wider text-slate-400">
            Super Admin
          </p>

          {/* Navigation */}

          <nav className="space-y-1.5">

            {navItems.map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    font-medium
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/20"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }
                    `
                  }
                >
                  <Icon
                    size={19}
                    strokeWidth={1.9}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {item.name}
                  </span>

                </NavLink>
              );
            })}

          </nav>

        </div>

        {/* ================= ADMIN PROFILE ================= */}

        <div className="shrink-0 border-t border-white/10 p-3">

          <div className="rounded-xl bg-white/5 p-3">

            <div className="flex items-center gap-3">

              {/* Avatar */}

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600">

                <ShieldCheck size={20} />

              </div>

              {/* User Info */}

              <div className="min-w-0">

                <p className="truncate text-sm font-semibold">
                  Super Admin
                </p>

                <div className="mt-1 flex items-center gap-1.5">

                  <span className="h-2 w-2 rounded-full bg-green-400" />

                  <span className="text-xs text-slate-400">
                    Full Access
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </aside>
    </>
  );
};

export default SuperAdminSidebar;