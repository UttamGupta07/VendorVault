import React from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  ShieldCheck,
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
      name: "Users",
      path: "/super-admin/users",
      icon: Users,
    },
    {
      name: "Compliance Team",
      path: "/super-admin/compliance-teams",
      icon: UsersRound,
    },
    {
      name: "Documents Overview",
      path: "/super-admin/documents",
      icon: FileText,
    },
    {
      name: "Services",
      path: "/super-admin/service",
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
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {open && (
        <div
          className="
            fixed
            inset-0
            z-40

            bg-slate-950/60
            backdrop-blur-[2px]

            lg:hidden
          "
          onClick={() => setOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

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

          overflow-hidden

          border-r
          border-slate-800/80

          bg-[#071426]

          text-white

          shadow-[8px_0_30px_rgba(2,8,23,0.12)]

          transition-transform
          duration-300
          ease-out

          lg:translate-x-0

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* =====================================================
            LOGO
        ===================================================== */}

        <div
          className="
            relative

            flex
            h-[78px]
            shrink-0
            items-center
            justify-between

            border-b
            border-white/[0.07]

            px-5
          "
        >
          {/* Subtle top glow */}

          <div
            className="
              pointer-events-none
              absolute
              left-0
              top-0

              h-px
              w-full

              bg-gradient-to-r
              from-transparent
              via-blue-500/50
              to-transparent
            "
          />

          <div className="flex items-center gap-3">
            {/* Logo Icon */}

            <div
              className="
                relative

                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center

                overflow-hidden
                rounded-xl

                bg-gradient-to-br
                from-blue-500
                via-blue-600
                to-indigo-700

                text-white

                shadow-lg
                shadow-blue-950/40

                ring-1
                ring-white/10
              "
            >
              <ShieldCheck
                size={22}
                strokeWidth={2.1}
              />

              {/* Small shine */}

              <span
                className="
                  pointer-events-none
                  absolute
                  -right-3
                  -top-3

                  h-7
                  w-7

                  rounded-full

                  bg-white/10

                  blur-md
                "
              />
            </div>

            {/* Brand */}

            <div>
              <span
                className="
                  block

                  text-[18px]
                  font-bold
                  leading-tight
                  tracking-tight

                  text-white
                "
              >
                VendorVault
              </span>

              <span
                className="
                  mt-0.5
                  block

                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]

                  text-slate-500
                "
              >
                Compliance Platform
              </span>
            </div>
          </div>

          {/* Mobile Close */}

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center

              rounded-lg

              text-slate-400

              transition-all
              duration-200

              hover:bg-white/[0.07]
              hover:text-white

              active:scale-95

              lg:hidden
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* =====================================================
            NAVIGATION AREA
        ===================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto

            px-3
            py-6

            scrollbar-thin
            scrollbar-track-transparent
            scrollbar-thumb-slate-700
          "
        >
          {/* Section Title */}

          <div className="mb-3 px-3">
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]

                text-slate-500
              "
            >
              Administration
            </p>
          </div>

          {/* Navigation */}

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `
                      group
                      relative

                      flex
                      w-full
                      items-center
                      gap-3

                      rounded-xl

                      px-3
                      py-2.5

                      text-sm
                      font-medium

                      transition-all
                      duration-200

                      ${
                        isActive
                          ? `
                            bg-gradient-to-r
                            from-blue-600
                            to-indigo-600

                            text-white

                            shadow-lg
                            shadow-blue-950/30

                            ring-1
                            ring-white/10
                          `
                          : `
                            text-slate-400

                            hover:bg-white/[0.055]
                            hover:text-slate-100
                          `
                      }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator */}

                      {isActive && (
                        <span
                          className="
                            absolute
                            left-0

                            h-6
                            w-[3px]

                            rounded-r-full

                            bg-blue-300
                          "
                        />
                      )}

                      {/* Icon Container */}

                      <span
                        className={`
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center

                          rounded-lg

                          transition-all
                          duration-200

                          ${
                            isActive
                              ? `
                                bg-white/10
                                text-white
                              `
                              : `
                                bg-white/[0.025]
                                text-slate-500

                                group-hover:bg-white/[0.06]
                                group-hover:text-blue-400
                              `
                          }
                        `}
                      >
                        <Icon
                          size={18}
                          strokeWidth={
                            isActive ? 2.1 : 1.9
                          }
                        />
                      </span>

                      {/* Label */}

                      <span className="truncate">
                        {item.name}
                      </span>

                      {/* Active dot */}

                      {isActive && (
                        <span
                          className="
                            ml-auto

                            h-1.5
                            w-1.5

                            shrink-0

                            rounded-full

                            bg-blue-200

                            shadow-[0_0_8px_rgba(147,197,253,0.8)]
                          "
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* =====================================================
            ADMIN PROFILE
        ===================================================== */}

        <div
          className="
            shrink-0

            border-t
            border-white/[0.07]

            p-3
          "
        >
          <div
            className="
              relative
              overflow-hidden

              rounded-xl

              border
              border-white/[0.06]

              bg-white/[0.035]

              p-3.5
            "
          >
            {/* Decorative glow */}

            <div
              className="
                pointer-events-none
                absolute
                -right-8
                -top-8

                h-20
                w-20

                rounded-full

                bg-blue-500/10

                blur-2xl
              "
            />

            <div className="relative flex items-center gap-3">
              {/* Avatar */}

              <div
                className="
                  relative

                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center

                  rounded-xl

                  bg-gradient-to-br
                  from-blue-500
                  to-indigo-700

                  text-white

                  shadow-md
                  shadow-blue-950/30
                "
              >
                <ShieldCheck
                  size={19}
                  strokeWidth={2}
                />

                {/* Online indicator */}

                <span
                  className="
                    absolute
                    -bottom-0.5
                    -right-0.5

                    h-3
                    w-3

                    rounded-full

                    border-2
                    border-[#071426]

                    bg-emerald-400

                    shadow-[0_0_7px_rgba(52,211,153,0.4)]
                  "
                />
              </div>

              {/* User Info */}

              <div className="min-w-0">
                <p
                  className="
                    truncate

                    text-sm
                    font-semibold

                    text-slate-100
                  "
                >
                  Super Admin
                </p>

                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className="
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-wider

                      text-slate-500
                    "
                  >
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
