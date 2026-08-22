 import React from "react";

import {
  Building2,
  Users,
  Truck,
  FileText,
  AlertTriangle,
  TrendingUp,
  XCircle,
  MoreVertical,
} from "lucide-react";

const SuperAdminDashboard = () => {
  const stats = [
    {
      title: "Organizations",
      value: "24",
      change: "4 this month",
      icon: Building2,
      bg: "bg-purple-100",
      color: "text-purple-600",
      positive: true,
    },
    {
      title: "Users",
      value: "358",
      change: "18 this month",
      icon: Users,
      bg: "bg-blue-100",
      color: "text-blue-600",
      positive: true,
    },
    {
      title: "Vendors",
      value: "1,248",
      change: "96 this month",
      icon: Truck,
      bg: "bg-green-100",
      color: "text-green-600",
      positive: true,
    },
    {
      title: "Documents",
      value: "8,742",
      change: "312 this month",
      icon: FileText,
      bg: "bg-orange-100",
      color: "text-orange-600",
      positive: true,
    },
    {
      title: "Expiring Soon",
      value: "217",
      change: "32 this week",
      icon: AlertTriangle,
      bg: "bg-red-100",
      color: "text-red-600",
      positive: false,
    },
  ];

  const alerts = [
    {
      title: "17 documents expired",
      description: "Across 5 organizations",
      time: "10 min ago",
      icon: XCircle,
      bg: "bg-red-100",
      color: "text-red-500",
    },
    {
      title: "32 documents expiring in 7 days",
      description: "Across 8 organizations",
      time: "1 hour ago",
      icon: AlertTriangle,
      bg: "bg-orange-100",
      color: "text-orange-500",
    },
    {
      title: "New organization registered",
      description: "TechBuild Solutions Pvt. Ltd.",
      time: "3 hours ago",
      icon: Building2,
      bg: "bg-blue-100",
      color: "text-blue-500",
    },
  ];

  const organizations = [
    {
      name: "TechBuild Solutions Pvt. Ltd.",
      users: 28,
      vendors: 142,
      documents: "1,156",
      joined: "May 29, 2025",
    },
    {
      name: "Infra Developers",
      users: 16,
      vendors: 98,
      documents: "734",
      joined: "May 28, 2025",
    },
    {
      name: "GreenField Construction",
      users: 22,
      vendors: 156,
      documents: "1,284",
      joined: "May 26, 2025",
    },
    {
      name: "UrbanSpaces Ltd.",
      users: 18,
      vendors: 112,
      documents: "923",
      joined: "May 24, 2025",
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden p-5 lg:p-8">

      {/* =====================================================
          WELCOME
      ===================================================== */}

      <section className="mb-7">

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome back, Super Admin! 👋
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Here's what's happening across the platform.
        </p>

      </section>

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >

              <div
                className={`
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  ${stat.bg}
                `}
              >
                <Icon
                  size={22}
                  className={stat.color}
                />
              </div>

              <p className="mt-4 text-sm font-medium text-slate-500">
                {stat.title}
              </p>

              <h3 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                {stat.value}
              </h3>

              <div
                className={`
                  mt-3
                  flex
                  items-center
                  gap-1
                  text-xs
                  font-medium
                  ${
                    stat.positive
                      ? "text-green-600"
                      : "text-red-500"
                  }
                `}
              >
                <TrendingUp size={14} />

                <span>
                  {stat.change}
                </span>
              </div>

            </div>
          );
        })}

      </section>

      {/* =====================================================
          CHART SECTION
      ===================================================== */}

      <section className="mt-6 grid grid-cols-1 gap-6 2xl:grid-cols-2">

        {/* =================================================
            DOCUMENT EXPIRY
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between gap-3">

            <h3 className="text-lg font-semibold text-slate-900">
              Document Expiry Overview
            </h3>

            <select
              className="
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                py-2
                text-sm
                text-slate-700
                outline-none
              "
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>

          </div>

          <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row">

            {/* Donut */}

            <div
              className="
                relative
                flex
                h-48
                w-48
                shrink-0
                items-center
                justify-center
                rounded-full
              "
              style={{
                background:
                  "conic-gradient(#22c55e 0% 83.39%, #3b82f6 83.39% 92.81%, #f59e0b 92.81% 97.52%, #ef4444 97.52% 100%)",
              }}
            >

              <div
                className="
                  flex
                  h-32
                  w-32
                  flex-col
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                "
              >

                <span className="text-2xl font-bold text-slate-900">
                  8,742
                </span>

                <span className="mt-1 text-xs text-slate-500">
                  Total Documents
                </span>

              </div>

            </div>

            {/* Legend */}

            <div className="w-full space-y-5">

              <ExpiryItem
                color="bg-red-500"
                label="Expired"
                value="217"
                percentage="2.48%"
              />

              <ExpiryItem
                color="bg-orange-500"
                label="Expiring in 30 days"
                value="412"
                percentage="4.71%"
              />

              <ExpiryItem
                color="bg-blue-500"
                label="Expiring in 60 days"
                value="823"
                percentage="9.42%"
              />

              <ExpiryItem
                color="bg-green-500"
                label="Valid"
                value="7,290"
                percentage="83.39%"
              />

            </div>

          </div>

        </div>

        {/* =================================================
            COMPLIANCE STATUS
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between gap-3">

            <h3 className="text-lg font-semibold text-slate-900">
              Compliance Status
            </h3>

            <select
              className="
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                py-2
                text-sm
                text-slate-700
                outline-none
              "
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>

          </div>

          {/* Legend */}

          <div className="mt-5 flex flex-wrap justify-end gap-5 text-xs">

            <Legend
              color="bg-green-500"
              label="Compliant"
            />

            <Legend
              color="bg-orange-400"
              label="At Risk"
            />

            <Legend
              color="bg-red-500"
              label="Non-Compliant"
            />

          </div>

          {/* Chart */}

          <div className="mt-5 h-[230px] w-full">

            <svg
              viewBox="0 0 600 220"
              className="h-full w-full"
              preserveAspectRatio="none"
            >

              {/* Green */}

              <polyline
                fill="none"
                stroke="#22c55e"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="
                  0,65
                  55,70
                  110,52
                  165,60
                  220,57
                  275,60
                  330,45
                  385,62
                  440,55
                  495,50
                  550,48
                  600,45
                "
              />

              {/* Orange */}

              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="
                  0,135
                  55,128
                  110,135
                  165,120
                  220,127
                  275,115
                  330,120
                  385,110
                  440,115
                  495,98
                  550,92
                  600,85
                "
              />

              {/* Red */}

              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="
                  0,180
                  55,173
                  110,178
                  165,163
                  220,170
                  275,162
                  330,168
                  385,155
                  440,158
                  495,148
                  550,140
                  600,148
                "
              />

            </svg>

          </div>

          {/* Dates */}

          <div className="flex justify-between text-xs text-slate-400">

            <span>May 1</span>
            <span>May 8</span>
            <span>May 15</span>
            <span>May 22</span>
            <span>May 29</span>

          </div>

        </div>

      </section>

      {/* =====================================================
          BOTTOM SECTION
      ===================================================== */}

      <section className="mt-6 grid grid-cols-1 gap-6 2xl:grid-cols-[0.9fr_1.1fr]">

        {/* =================================================
            RECENT ALERTS
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <h3 className="text-lg font-semibold text-slate-900">
              Recent System Alerts
            </h3>

            <button
              type="button"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View All
            </button>

          </div>

          <div className="mt-5 space-y-3">

            {alerts.map((alert) => {

              const Icon = alert.icon;

              return (
                <div
                  key={alert.title}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-slate-100
                    p-3
                  "
                >

                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      ${alert.bg}
                    `}
                  >

                    <Icon
                      size={19}
                      className={alert.color}
                    />

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-semibold text-slate-800">
                      {alert.title}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {alert.description}
                    </p>

                  </div>

                  <span className="whitespace-nowrap text-xs text-slate-400">
                    {alert.time}
                  </span>

                </div>
              );
            })}

          </div>

        </div>

        {/* =================================================
            RECENT ORGANIZATIONS
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <h3 className="text-lg font-semibold text-slate-900">
              Recent Organizations
            </h3>

            <button
              type="button"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View All
            </button>

          </div>

          {/* Table */}

          <div className="mt-5 w-full overflow-x-auto">

            <table className="w-full min-w-[700px] text-left">

              <thead>

                <tr className="border-b border-slate-100 text-xs text-slate-500">

                  <th className="pb-3 font-medium">
                    Organization
                  </th>

                  <th className="pb-3 text-center font-medium">
                    Users
                  </th>

                  <th className="pb-3 text-center font-medium">
                    Vendors
                  </th>

                  <th className="pb-3 text-center font-medium">
                    Documents
                  </th>

                  <th className="pb-3 text-center font-medium">
                    Joined On
                  </th>

                  <th className="w-10" />

                </tr>

              </thead>

              <tbody>

                {organizations.map((organization) => (

                  <tr
                    key={organization.name}
                    className="border-b border-slate-100 last:border-0"
                  >

                    <td className="py-4">

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-purple-100
                          "
                        >

                          <Building2
                            size={17}
                            className="text-purple-600"
                          />

                        </div>

                        <span className="whitespace-nowrap text-sm font-medium text-slate-800">
                          {organization.name}
                        </span>

                      </div>

                    </td>

                    <td className="py-4 text-center text-sm text-slate-700">
                      {organization.users}
                    </td>

                    <td className="py-4 text-center text-sm text-slate-700">
                      {organization.vendors}
                    </td>

                    <td className="py-4 text-center text-sm text-slate-700">
                      {organization.documents}
                    </td>

                    <td className="whitespace-nowrap py-4 text-center text-sm text-slate-500">
                      {organization.joined}
                    </td>

                    <td className="py-4">

                      <button
                        type="button"
                        className="rounded-lg p-1.5 hover:bg-slate-100"
                      >

                        <MoreVertical
                          size={18}
                          className="text-slate-500"
                        />

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </section>

    </div>
  );
};

/* =========================================================
   EXPIRY ITEM
========================================================= */

const ExpiryItem = ({
  color,
  label,
  value,
  percentage,
}) => {
  return (
    <div className="flex items-center justify-between gap-3">

      <div className="flex min-w-0 items-center gap-2">

        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${color}`}
        />

        <span className="truncate text-sm text-slate-600">
          {label}
        </span>

      </div>

      <div className="whitespace-nowrap text-sm">

        <span className="font-semibold text-slate-800">
          {value}
        </span>

        <span className="ml-1 text-slate-400">
          ({percentage})
        </span>

      </div>

    </div>
  );
};

/* =========================================================
   LEGEND
========================================================= */

const Legend = ({ color, label }) => {
  return (
    <div className="flex items-center gap-2">

      <span
        className={`h-2.5 w-2.5 rounded-full ${color}`}
      />

      <span className="text-slate-600">
        {label}
      </span>

    </div>
  );
};

export default SuperAdminDashboard;