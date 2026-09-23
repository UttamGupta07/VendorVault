import React from "react";
import { Menu, Search, ChevronDown } from "lucide-react";
import NotificationBell from "../NotificationBell";

const ComplianceNavbar = ({ setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 shadow-[0_1px_10px_rgba(15,23,42,0.04)] backdrop-blur-xl sm:px-6 lg:px-8">
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
            Compliance Portal
          </h2>
          <p className="hidden text-xs text-slate-400 sm:block">
            Manage vendor compliance and documents
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 md:flex"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        <NotificationBell />

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        <button className="hidden items-center gap-2.5 rounded-xl px-2 py-1.5 text-left transition hover:bg-slate-50 sm:flex">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-sm">
            CO
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-800">Compliance Officer</p>
            <p className="text-[10px] text-slate-400">Compliance Team</p>
          </div>

          <ChevronDown size={15} className="text-slate-400" />
        </button>
      </div>
    </header>
  );
};

export default ComplianceNavbar;
