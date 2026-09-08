import React, { useEffect, useState } from "react";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  XCircle,
  AlertTriangle,
  Clock,
  CheckCircle,
} from "lucide-react";

import { getSuperAdminDashboard } from "../../api/adminDashboardApi";

const SuperAdminNavbar = ({ setOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // =========================
  // LOAD NOTIFICATIONS
  // =========================
  const loadNotifications = async () => {
    try {
      const response = await getSuperAdminDashboard();

      if (response?.success) {
        setNotifications(response?.data?.notifications || []);
      }
    } catch (error) {
      console.error(
        "Notification loading error:",
        error.message
      );
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // =========================
  // NOTIFICATION ICON
  // =========================
  const getIcon = (type) => {
    if (type === "1_DAY") return XCircle;
    if (type === "7_DAY") return AlertTriangle;
    return Clock;
  };

  const getIconStyle = (type) => {
    if (type === "1_DAY") {
      return "bg-red-100 text-red-500";
    }

    if (type === "7_DAY") {
      return "bg-orange-100 text-orange-500";
    }

    return "bg-blue-100 text-blue-500";
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

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setShowNotifications((prev) => !prev)
            }
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

            {unreadCount > 0 && (
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
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* ================= NOTIFICATION PANEL ================= */}

          {showNotifications && (
            <div
              className="
                absolute
                right-0
                top-14
                z-50
                w-[360px]
                max-w-[calc(100vw-30px)]
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-xl
              "
            >

              {/* Header */}

              <div className="flex items-center justify-between border-b border-slate-100 p-4">

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Notifications
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {unreadCount} unread notification
                    {unreadCount !== 1 ? "s" : ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowNotifications(false)
                  }
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                >
                  <XCircle size={18} />
                </button>

              </div>

              {/* Notification List */}

              <div className="max-h-[400px] overflow-y-auto">

                {notifications.length === 0 ? (
                  <div className="p-8 text-center">

                    <CheckCircle
                      size={30}
                      className="mx-auto text-green-500"
                    />

                    <p className="mt-2 text-sm font-medium text-slate-700">
                      No notifications
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      You're all caught up.
                    </p>

                  </div>
                ) : (
                  notifications.map((notification) => {
                    const Icon = getIcon(
                      notification.reminderType
                    );

                    return (
                      <div
                        key={notification._id}
                        className={`
                          flex
                          gap-3
                          border-b
                          border-slate-100
                          p-4
                          transition
                          hover:bg-slate-50
                          ${
                            !notification.isRead
                              ? "bg-indigo-50/40"
                              : ""
                          }
                        `}
                      >

                        {/* Icon */}

                        <div
                          className={`
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            ${getIconStyle(
                              notification.reminderType
                            )}
                          `}
                        >
                          <Icon size={18} />
                        </div>

                        {/* Content */}

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-2">

                            <p className="text-sm font-semibold text-slate-800">
                              {notification.title}
                            </p>

                            {!notification.isRead && (
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                            )}

                          </div>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {notification.message}
                          </p>

                          <div className="mt-2 flex items-center justify-between gap-2">

                            <span className="truncate text-xs font-medium text-slate-400">
                              {notification.vendorId
                                ?.companyName ||
                                notification.vendorId
                                  ?.name ||
                                "Vendor"}
                            </span>

                            <span className="whitespace-nowrap text-[11px] text-slate-400">
                              {formatTime(
                                notification.createdAt
                              )}
                            </span>

                          </div>

                        </div>
                      </div>
                    );
                  })
                )}

              </div>
            </div>
          )}

        </div>

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

          <span className="hidden text-sm font-semibold text-slate-800 sm:block">
            Super Admin
          </span>

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