import React, { useEffect, useState } from "react";
import {
  Users,
  Truck,
  FileText,
  AlertTriangle,
  TrendingUp,
  XCircle,
  CheckCircle,
  Clock,
  MoreVertical,
  RefreshCw,
} from "lucide-react";

import { getSuperAdminDashboard } from "../../api/adminDashboardApi";

const SuperAdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD DASHBOARD DATA
  // =========================
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSuperAdminDashboard();

      if (!response?.success) {
        throw new Error("Failed to load dashboard data");
      }

      setDashboard(response.data);
    } catch (err) {
      console.error("Dashboard loading error:", err);

      setError(
        err?.response?.data?.message ||
        err.message ||
        "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw
            size={28}
            className="animate-spin text-indigo-600"
          />
          <p className="text-sm text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR STATE
  // =========================
  if (error) {
    return (
      <div className="w-full p-5 lg:p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3">
            <XCircle className="text-red-500" size={24} />

            <div>
              <h3 className="font-semibold text-red-700">
                Failed to load dashboard
              </h3>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>

          <button
            onClick={loadDashboard}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Users",
      value: dashboard?.stats?.users ?? 0,
      change: `${dashboard?.stats?.activeUsers ?? 0} active`,
      icon: Users,
      bg: "bg-blue-100",
      color: "text-blue-600",
      positive: true,
    },
    {
      title: "Vendors",
      value: dashboard?.stats?.vendors ?? 0,
      change: `${dashboard?.vendors?.active ?? 0} active`,
      icon: Truck,
      bg: "bg-green-100",
      color: "text-green-600",
      positive: true,
    },
    {
      title: "Documents",
      value: dashboard?.stats?.documents ?? 0,
      change: `${dashboard?.documents?.approved ?? 0} approved`,
      icon: FileText,
      bg: "bg-orange-100",
      color: "text-orange-600",
      positive: true,
    },
    {
      title: "Expiring Soon",
      value: dashboard?.stats?.expiringSoon ?? 0,
      change: "Next 30 days",
      icon: AlertTriangle,
      bg: "bg-red-100",
      color: "text-red-600",
      positive: false,
    },
    {
      title: "Expired",
      value: dashboard?.stats?.expired ?? 0,
      change: "Requires attention",
      icon: XCircle,
      bg: "bg-red-100",
      color: "text-red-500",
      positive: false,
    },
  ];

  // =========================
  // EXPIRY DATA
  // =========================
  const expiry = dashboard?.expiryOverview || {};

  const totalDocuments = expiry.total || 0;

  const expiryItems = [
    {
      label: "Expired",
      value: expiry.expired || 0,
      color: "bg-red-500",
    },
    {
      label: "Expiring in 30 days",
      value: expiry.expiring30Days || 0,
      color: "bg-orange-500",
    },
    {
      label: "Expiring in 60 days",
      value: expiry.expiring60Days || 0,
      color: "bg-blue-500",
    },
    {
      label: "Valid",
      value: expiry.valid || 0,
      color: "bg-green-500",
    },
  ];

  const getPercentage = (value) => {
    if (!totalDocuments) return "0.00%";

    return `${((value / totalDocuments) * 100).toFixed(2)}%`;
  };

  let donutGradient = "conic-gradient(#e2e8f0 0% 100%)";

  if (totalDocuments > 0) {
    let current = 0;

    const colors = [
      "#ef4444",
      "#f59e0b",
      "#3b82f6",
      "#22c55e",
    ];

    const parts = expiryItems.map((item, index) => {
      const start = current;

      current +=
        (item.value / totalDocuments) * 100;

      return `${colors[index]} ${start}% ${current}%`;
    });

    donutGradient = `conic-gradient(${parts.join(", ")})`;
  }

  // =========================
  // NOTIFICATIONS
  // =========================
  const notifications = dashboard?.notifications || [];

  const getNotificationIcon = (notification) => {
    if (notification.reminderType === "1_DAY") {
      return XCircle;
    }

    if (notification.reminderType === "7_DAY") {
      return AlertTriangle;
    }

    return Clock;
  };

  const getNotificationStyle = (notification) => {
    if (notification.reminderType === "1_DAY") {
      return {
        bg: "bg-red-100",
        color: "text-red-500",
      };
    }

    if (notification.reminderType === "7_DAY") {
      return {
        bg: "bg-orange-100",
        color: "text-orange-500",
      };
    }

    return {
      bg: "bg-blue-100",
      color: "text-blue-500",
    };
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden p-5 lg:p-8">

      {/* =====================================================
          WELCOME
      ===================================================== */}

      <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back, Super Admin! 👋
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening across the platform.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
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
                {stat.value.toLocaleString()}
              </h3>

              <div
                className={`
                  mt-3
                  flex
                  items-center
                  gap-1
                  text-xs
                  font-medium
                  ${stat.positive
                    ? "text-green-600"
                    : "text-red-500"
                  }
                `}
              >
                {stat.positive ? (
                  <TrendingUp size={14} />
                ) : (
                  <AlertTriangle size={14} />
                )}

                <span>{stat.change}</span>
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
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Document Expiry Overview
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Current document expiry status
              </p>
            </div>
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
                background: donutGradient,
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
                  {totalDocuments.toLocaleString()}
                </span>

                <span className="mt-1 text-xs text-slate-500">
                  Total Documents
                </span>
              </div>
            </div>

            {/* Legend */}

            <div className="w-full space-y-5">
              {expiryItems.map((item) => (
                <ExpiryItem
                  key={item.label}
                  color={item.color}
                  label={item.label}
                  value={item.value.toLocaleString()}
                  percentage={getPercentage(item.value)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* =================================================
            COMPLIANCE STATUS
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Compliance Status
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Current vendor compliance overview
              </p>
            </div>
          </div>

          {/* Compliance Score */}

          <div className="mt-8 flex items-center justify-center">
            <div className="relative flex h-52 w-52 items-center justify-center">

              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    #22c55e 0% ${dashboard?.compliance?.averageScore || 0}%,
                    #e2e8f0 ${dashboard?.compliance?.averageScore || 0}% 100%
                  )`,
                }}
              />

              <div className="relative flex h-40 w-40 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-4xl font-bold text-slate-900">
                  {dashboard?.compliance?.averageScore || 0}
                </span>

                <span className="mt-1 text-sm text-slate-500">
                  Average Score
                </span>
              </div>
            </div>
          </div>

          {/* Compliance stats */}

          <div className="mt-7 grid grid-cols-3 gap-3">

            <div className="rounded-xl bg-green-50 p-3 text-center">
              <CheckCircle
                size={18}
                className="mx-auto text-green-600"
              />

              <p className="mt-2 text-xl font-bold text-slate-900">
                {dashboard?.compliance?.compliant || 0}
              </p>

              <p className="text-xs text-slate-500">
                Compliant
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 p-3 text-center">
              <AlertTriangle
                size={18}
                className="mx-auto text-orange-500"
              />

              <p className="mt-2 text-xl font-bold text-slate-900">
                {dashboard?.compliance?.needingAttention || 0}
              </p>

              <p className="text-xs text-slate-500">
                At Risk
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 text-center">
              <Truck
                size={18}
                className="mx-auto text-slate-500"
              />

              <p className="mt-2 text-xl font-bold text-slate-900">
                {dashboard?.vendors?.total || 0}
              </p>

              <p className="text-xs text-slate-500">
                Total Vendors
              </p>
            </div>

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
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Recent System Alerts
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Latest document expiry notifications
              </p>
            </div>

            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              {notifications.length}
            </span>
          </div>

          <div className="mt-5 space-y-3">

            {notifications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                <CheckCircle
                  size={28}
                  className="mx-auto text-green-500"
                />

                <p className="mt-2 text-sm font-medium text-slate-700">
                  No recent alerts
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Everything looks good right now.
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon =
                  getNotificationIcon(notification);

                const style =
                  getNotificationStyle(notification);

                return (
                  <div
                    key={notification._id}
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
                        ${style.bg}
                      `}
                    >
                      <Icon
                        size={19}
                        className={style.color}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {notification.title}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {notification.message}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {notification.vendorId?.companyName ||
                          notification.vendorId?.name ||
                          "Vendor"}
                      </p>
                    </div>

                    <span className="whitespace-nowrap text-xs text-slate-400">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                );
              })
            )}

          </div>
        </div>

        {/* =================================================
            RECENT VENDORS
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Recent Vendors
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Recently registered vendors
              </p>
            </div>

            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
              {dashboard?.vendors?.total || 0} Total
            </span>
          </div>

          <div className="mt-5 w-full overflow-x-auto">

            <table className="w-full min-w-[650px] text-left">

              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-500">

                  <th className="pb-3 font-medium">
                    Vendor
                  </th>

                  <th className="pb-3 text-center font-medium">
                    Status
                  </th>

                  <th className="pb-3 text-center font-medium">
                    Compliance
                  </th>

                  <th className="w-10" />
                </tr>
              </thead>

              <tbody>

                {dashboard?.vendors?.recent?.length ? (
                  dashboard.vendors.recent.map((vendor) => (
                    <tr
                      key={vendor._id}
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
                              bg-green-100
                            "
                          >
                            <Truck
                              size={17}
                              className="text-green-600"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-800">
                              {vendor.companyName}
                            </p>

                            <p className="truncate text-xs text-slate-400">
                              {vendor.email}
                            </p>
                          </div>

                        </div>
                      </td>

                      <td className="py-4 text-center">
                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-2.5
                            py-1
                            text-xs
                            font-medium
                            ${vendor.status === "active"
                              ? "bg-green-50 text-green-600"
                              : vendor.status === "pending"
                                ? "bg-orange-50 text-orange-600"
                                : "bg-red-50 text-red-600"
                            }
                          `}
                        >
                          {vendor.status}
                        </span>
                      </td>

                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">

                          <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-green-500"
                              style={{
                                width: `${Math.min(
                                  vendor.complianceScore || 0,
                                  100
                                )}%`,
                              }}
                            />
                          </div>

                          <span className="text-xs font-semibold text-slate-700">
                            {vendor.complianceScore || 0}%
                          </span>

                        </div>
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
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-10 text-center text-sm text-slate-400"
                    >
                      No vendors found.
                    </td>
                  </tr>
                )}

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

export default SuperAdminDashboard;