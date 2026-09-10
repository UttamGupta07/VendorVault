import React, { useEffect, useState } from "react";
import {
  Bell,
  BellRing,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

const VendorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // FETCH NOTIFICATIONS
  // --------------------------------------------------

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/api/notifications");

      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error(
        "Fetch notifications error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // MARK NOTIFICATION AS READ
  // --------------------------------------------------

  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.patch(
        `/api/notifications/${notificationId}/read`
      );

      // Update UI immediately
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Mark as read error:",
        error.response?.data || error.message
      );
    }
  };

  // --------------------------------------------------
  // FETCH ON COMPONENT LOAD
  // --------------------------------------------------

  useEffect(() => {
    fetchNotifications();
  }, []);

  // --------------------------------------------------
  // REMINDER INFO
  // --------------------------------------------------

  const getReminderInfo = (reminderType) => {
    switch (reminderType) {
      case "15_DAY":
        return {
          label: "15 Days Left",
          className:
            "bg-blue-50 text-blue-600 border-blue-100",
        };

      case "7_DAY":
        return {
          label: "7 Days Left",
          className:
            "bg-orange-50 text-orange-600 border-orange-100",
        };

      case "1_DAY":
        return {
          label: "1 Day Left",
          className:
            "bg-red-50 text-red-600 border-red-100",
        };

      default:
        return {
          label: "Reminder",
          className:
            "bg-slate-50 text-slate-600 border-slate-100",
        };
    }
  };

  // --------------------------------------------------
  // NOTIFICATION ICON
  // --------------------------------------------------

  const getNotificationIcon = (reminderType) => {
    switch (reminderType) {
      case "15_DAY":
        return <Info size={20} />;

      case "7_DAY":
        return <AlertTriangle size={20} />;

      case "1_DAY":
        return <BellRing size={20} />;

      default:
        return <Bell size={20} />;
    }
  };

  // --------------------------------------------------
  // DATE FORMAT
  // --------------------------------------------------

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --------------------------------------------------
  // UNREAD COUNT
  // --------------------------------------------------

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // --------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2
            size={22}
            className="animate-spin"
          />

          <span>Loading notifications...</span>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Bell size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Notifications
              </h1>

              <p className="text-sm text-slate-500">
                Stay updated with your document expiry reminders.
              </p>
            </div>

          </div>
        </div>

        {/* UNREAD COUNT */}
        {unreadCount > 0 && (
          <div className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
            {unreadCount} Unread
          </div>
        )}

      </div>

      {/* EMPTY STATE */}
      {notifications.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">

          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Bell size={30} />
          </div>

          <h2 className="text-lg font-semibold text-slate-700">
            No notifications
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            You are all caught up.
          </p>

        </div>
      ) : (

        /* NOTIFICATION LIST */
        <div className="space-y-4">

          {notifications.map((notification) => {
            const reminderInfo = getReminderInfo(
              notification.reminderType
            );

            return (
              <div
                key={notification._id}
                className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                  notification.isRead
                    ? "border-slate-200"
                    : "border-indigo-200 bg-indigo-50/30"
                }`}
              >

                {/* TOP SECTION */}
                <div className="flex items-start gap-4">

                  {/* ICON */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      notification.isRead
                        ? "bg-slate-100 text-slate-400"
                        : "bg-indigo-100 text-indigo-600"
                    }`}
                  >
                    {getNotificationIcon(
                      notification.reminderType
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-start justify-between gap-3">

                      <div>
                        <h3
                          className={`text-base font-semibold ${
                            notification.isRead
                              ? "text-slate-600"
                              : "text-slate-800"
                          }`}
                        >
                          {notification.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {notification.message}
                        </p>
                      </div>

                      {/* REMINDER BADGE */}
                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${reminderInfo.className}`}
                      >
                        {reminderInfo.label}
                      </span>

                    </div>

                  </div>

                </div>

                {/* FOOTER */}
                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">

                  {/* DATE */}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={14} />

                    {formatDate(notification.createdAt)}
                  </div>

                  {/* MARK AS READ */}
                  {!notification.isRead ? (
                    <button
                      onClick={() =>
                        markAsRead(notification._id)
                      }
                      className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100"
                    >
                      Mark as read
                    </button>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                      <CheckCircle2 size={14} />
                      Read
                    </span>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default VendorNotifications;