 import React, { useEffect, useRef, useState } from "react";

import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  X,
  FileText,
  UserPlus,
  AlertTriangle,
  ShieldCheck,
  MailWarning,
  Clock,
} from "lucide-react";

import axiosInstance from "../api/axiosInstance";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);

  // =========================================================
  // FETCH NOTIFICATIONS
  // =========================================================

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/api/user-notifications");

      if (response.data?.success) {
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH UNREAD COUNT
  // =========================================================

  const fetchUnreadCount = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/user-notifications/unread-count"
      );

      if (response.data?.success) {
        setUnreadCount(response.data.count || 0);
      }
    } catch (error) {
      console.error(
        "Failed to fetch unread notification count:",
        error.response?.data || error.message
      );
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  // =========================================================
  // FETCH NOTIFICATIONS WHEN DROPDOWN OPENS
  // =========================================================

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // =========================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================================================
  // MARK ONE AS READ
  // =========================================================

  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.patch(
        `/api/user-notifications/${notificationId}/read`
      );

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

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error.response?.data || error.message
      );
    }
  };

  // =========================================================
  // MARK ALL AS READ
  // =========================================================

  const markAllAsRead = async () => {
    try {
      await axiosInstance.patch("/api/user-notifications/read-all");

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error.response?.data || error.message
      );
    }
  };

  // =========================================================
  // DELETE NOTIFICATION
  // =========================================================

  const deleteNotification = async (notificationId) => {
    try {
      const notification = notifications.find(
        (item) => item._id === notificationId
      );

      await axiosInstance.delete(
        `/api/user-notifications/${notificationId}`
      );

      setNotifications((prev) =>
        prev.filter((item) => item._id !== notificationId)
      );

      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error(
        "Failed to delete notification:",
        error.response?.data || error.message
      );
    }
  };

  // =========================================================
  // GET NOTIFICATION ICON
  // =========================================================

  const getNotificationIcon = (type) => {
    switch (type) {
      case "VENDOR_CREATED":
      case "VENDOR_UPDATED":
      case "VENDOR_SUSPENDED":
      case "VENDOR_ACTIVATED":
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
            <UserPlus className="w-[18px] h-[18px] text-blue-600" />
          </div>
        );

      case "DOCUMENT_UPLOADED":
        return (
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
            <FileText className="w-[18px] h-[18px] text-indigo-600" />
          </div>
        );

      case "DOCUMENT_APPROVED":
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-[18px] h-[18px] text-emerald-600" />
          </div>
        );

      case "DOCUMENT_REJECTED":
        return (
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shadow-sm">
            <X className="w-[18px] h-[18px] text-red-600" />
          </div>
        );

      case "DOCUMENT_EXPIRED":
        return (
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shadow-sm">
            <AlertTriangle className="w-[18px] h-[18px] text-red-600" />
          </div>
        );

      case "DOCUMENT_EXPIRING_30_DAYS":
      case "DOCUMENT_EXPIRING_15_DAYS":
      case "DOCUMENT_EXPIRING_7_DAYS":
      case "DOCUMENT_EXPIRING_1_DAY":
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shadow-sm">
            <Clock className="w-[18px] h-[18px] text-amber-600" />
          </div>
        );

      case "EMAIL_DELIVERY_FAILED":
        return (
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shadow-sm">
            <MailWarning className="w-[18px] h-[18px] text-red-600" />
          </div>
        );

      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
            <Bell className="w-[18px] h-[18px] text-slate-500" />
          </div>
        );
    }
  };

  // =========================================================
  // RELATIVE TIME
  // =========================================================

  const getRelativeTime = (date) => {
    if (!date) return "";

    const now = new Date();
    const created = new Date(date);

    const difference = Math.floor((now - created) / 1000);

    if (difference < 60) {
      return "Just now";
    }

    const minutes = Math.floor(difference / 60);

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days}d ago`;
    }

    return created.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // HANDLE NOTIFICATION CLICK
  // =========================================================

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    // Navigation based on related type can be added here later.
    // We will wire this after the notification system events
    // are connected to VendorVault pages.
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      {/* =====================================================
          BELL BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
          isOpen
            ? "bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
        aria-label="Notifications"
      >
        <Bell
          className={`w-[19px] h-[19px] transition-transform duration-200 ${
            isOpen ? "scale-105" : ""
          }`}
        />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* =====================================================
          DROPDOWN
      ===================================================== */}

      {isOpen && (
        <div
          className="
            absolute right-0 top-[52px]
            w-[410px]
            max-w-[calc(100vw-1.5rem)]
            bg-white
            border border-slate-200
            rounded-2xl
            shadow-[0_20px_60px_rgba(15,23,42,0.16)]
            z-50
            overflow-hidden
            animate-[fadeIn_0.18s_ease-out]
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="px-5 py-4 bg-gradient-to-r from-slate-50 via-white to-blue-50/40 border-b border-slate-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200">
                  <Bell className="w-[18px] h-[18px] text-white" />
                </div>

                <div>
                  <h3 className="text-[15px] font-bold text-slate-900">
                    Notifications
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${
                          unreadCount > 1 ? "s" : ""
                        }`
                      : "You're all caught up"}
                  </p>
                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="
                    px-2.5 py-1.5
                    rounded-lg
                    text-[11px]
                    font-semibold
                    text-blue-600
                    bg-blue-50
                    hover:bg-blue-100
                    border border-blue-100
                    transition-all
                    flex items-center gap-1.5
                  "
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div className="max-h-[460px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {loading ? (
              <div className="px-4 py-14 text-center">
                <div className="relative w-9 h-9 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-100" />

                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 animate-spin" />
                </div>

                <p className="text-sm font-medium text-slate-600 mt-4">
                  Loading notifications...
                </p>

                <p className="text-[11px] text-slate-400 mt-1">
                  Please wait a moment
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto">
                  <Bell className="w-6 h-6 text-slate-300" />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-700">
                  No notifications
                </p>

                <p className="mt-1.5 text-xs text-slate-400">
                  New alerts will appear here.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`
                    relative
                    px-4 py-4
                    border-b border-slate-100
                    transition-all duration-200
                    ${
                      notification.isRead
                        ? "bg-white hover:bg-slate-50/80"
                        : "bg-blue-50/50 hover:bg-blue-50/80"
                    }
                  `}
                >
                  <div className="flex gap-3">
                    {/* ICON */}

                    <div className="flex-shrink-0 pt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* CONTENT */}

                    <button
                      type="button"
                      onClick={() =>
                        handleNotificationClick(notification)
                      }
                      className="flex-1 min-w-0 text-left pr-5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          <h4
                            className={`
                              text-[13px]
                              leading-5
                              truncate
                              ${
                                notification.isRead
                                  ? "font-medium text-slate-700"
                                  : "font-bold text-slate-900"
                              }
                            `}
                          >
                            {notification.title}
                          </h4>

                          {!notification.isRead && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5 shadow-sm shadow-blue-300" />
                          )}
                        </div>
                      </div>

                      <p className="text-[12px] text-slate-500 mt-1.5 leading-relaxed">
                        {notification.message}
                      </p>

                      <p className="text-[10px] font-medium text-slate-400 mt-2">
                        {getRelativeTime(notification.createdAt)}
                      </p>
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        deleteNotification(notification._id)
                      }
                      className="
                        absolute
                        top-3
                        right-3
                        w-7
                        h-7
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        text-slate-300
                        hover:text-red-500
                        hover:bg-red-50
                        transition-all
                      "
                      title="Delete notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* MARK READ */}

                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={() =>
                        markAsRead(notification._id)
                      }
                      className="
                        absolute
                        bottom-3
                        right-4
                        px-1.5
                        py-0.5
                        rounded-md
                        text-[10px]
                        font-semibold
                        text-blue-600
                        hover:text-blue-700
                        hover:bg-blue-100
                        flex
                        items-center
                        gap-1
                        transition-all
                      "
                    >
                      <Check className="w-3 h-3" />
                      Read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          {notifications.length > 0 && (
            <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200">
              <p className="text-[10px] font-medium text-center text-slate-400">
                Showing your latest {notifications.length}{" "}
                {notifications.length === 1
                  ? "notification"
                  : "notifications"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;