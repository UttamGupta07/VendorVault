import React from "react";
import { Link } from "react-router-dom";
import { Menu, Bell, UserCircle, ChevronDown } from "lucide-react";

const VendorNavbar = ({ setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-30 h-[72px] border-b border-slate-200 bg-white/90 shadow-[0_1px_10px_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={21} />
          </button>

          <div>
            <h2 className="text-[15px] font-bold tracking-tight text-slate-900 sm:text-lg">
              Vendor Portal
            </h2>
            <p className="hidden text-xs text-slate-400 sm:block">
              Manage your compliance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/vendor/notifications" aria-label="Notifications">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </span>
          </Link>

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-left transition hover:bg-slate-50">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
              <UserCircle size={20} />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">Vendor</p>
              <p className="text-[10px] text-slate-400">Vendor Account</p>
            </div>

            <ChevronDown size={15} className="text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default VendorNavbar;
