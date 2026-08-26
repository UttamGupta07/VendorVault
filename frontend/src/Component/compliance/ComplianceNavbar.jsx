import React from "react";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

const ComplianceNavbar = ({ setSidebarOpen }) => {
  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-[72px]
        items-center
        justify-between
        border-b
        border-slate-200
        bg-white/95
        px-4
        backdrop-blur
        sm:px-6
        lg:px-8
      "
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="
            rounded-xl
            p-2
            text-slate-600
            transition
            hover:bg-slate-100
            lg:hidden
          "
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Compliance Portal
          </h2>

          <p className="hidden text-xs text-slate-400 sm:block">
            Manage vendor compliance and documents
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <button
          className="
            hidden
            rounded-xl
            border
            border-slate-200
            p-2.5
            text-slate-500
            transition
            hover:bg-slate-50
            md:block
          "
        >
          <Search size={19} />
        </button>

        {/* Notification */}
        <button
          className="
            relative
            rounded-xl
            border
            border-slate-200
            p-2.5
            text-slate-500
            transition
            hover:bg-slate-50
          "
        >
          <Bell size={19} />

          <span
            className="
              absolute
              right-2
              top-2
              h-2
              w-2
              rounded-full
              bg-red-500
              ring-2
              ring-white
            "
          />
        </button>

        {/* User */}
        <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
            CO
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-800">
              Compliance Officer
            </p>

            <p className="text-[10px] text-slate-400">
              Compliance Team
            </p>
          </div>

          <ChevronDown
            size={16}
            className="text-slate-400"
          />
        </div>
      </div>
    </header>
  );
};

export default ComplianceNavbar;