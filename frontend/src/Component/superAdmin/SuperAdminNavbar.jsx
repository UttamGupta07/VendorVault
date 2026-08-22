 import React from "react";

import {
  Menu,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

const SuperAdminNavbar = ({ setOpen }) => {
  return (
    <header
      className="
        fixed
        left-0
        right-0
        top-0
        z-30
        flex
        h-[84px]
        items-center
        justify-between
        border-b
        border-slate-200
        bg-white
        px-5
        shadow-sm
        lg:pl-[274px]
        lg:pr-8
      "
    >

      {/* ================= LEFT ================= */}

      <div className="flex items-center gap-4">

        {/* Mobile Menu */}

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            rounded-lg
            p-2
            text-slate-700
            transition
            hover:bg-slate-100
            lg:hidden
          "
        >
          <Menu size={23} />
        </button>

        {/* Page Title */}

        <h1 className="text-xl font-semibold text-slate-900">
          Dashboard
        </h1>

      </div>

      {/* ================= RIGHT ================= */}

      <div className="flex items-center gap-3 sm:gap-4">

        {/* ================= SEARCH ================= */}

        <div
          className="
            hidden
            h-11
            w-[230px]
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-3
            md:flex
            lg:w-[295px]
          "
        >

          <Search
            size={19}
            className="shrink-0 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search anything..."
            className="
              w-full
              bg-transparent
              text-sm
              text-slate-700
              outline-none
              placeholder:text-slate-400
            "
          />

        </div>

        {/* ================= NOTIFICATION ================= */}

        <button
          type="button"
          className="
            relative
            rounded-xl
            p-2.5
            text-slate-700
            transition
            hover:bg-slate-100
          "
        >

          <Bell size={21} />

          <span
            className="
              absolute
              -right-0.5
              -top-0.5
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-indigo-600
              px-1
              text-[10px]
              font-bold
              text-white
            "
          >
            12
          </span>

        </button>

        {/* Divider */}

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        {/* ================= PROFILE ================= */}

        <button
          type="button"
          className="
            flex
            items-center
            gap-2
            rounded-xl
            p-1.5
            transition
            hover:bg-slate-50
          "
        >

          {/* Avatar */}

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-slate-800
              text-sm
              font-semibold
              text-white
            "
          >
            SA
          </div>

          {/* Name */}

          <span className="hidden text-sm font-semibold text-slate-800 sm:block">
            Super Admin
          </span>

          {/* Arrow */}

          <ChevronDown
            size={17}
            className="hidden text-slate-500 sm:block"
          />

        </button>

      </div>

    </header>
  );
};

export default SuperAdminNavbar;