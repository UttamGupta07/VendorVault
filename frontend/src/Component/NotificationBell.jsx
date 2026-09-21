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
        prev.filter(
          (item) => item._id !== notificationId
        )
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
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-blue-600" />
          </div>
        );

      case "DOCUMENT_UPLOADED":
        return (
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
        );

      case "DOCUMENT_APPROVED":
        return (
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-green-600" />
          </div>
        );

      case "DOCUMENT_REJECTED":
        return (
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
            <X className="w-4 h-4 text-red-600" />
          </div>
        );

      case "DOCUMENT_EXPIRED":
        return (
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
        );

      case "DOCUMENT_EXPIRING_30_DAYS":
      case "DOCUMENT_EXPIRING_15_DAYS":
      case "DOCUMENT_EXPIRING_7_DAYS":
      case "DOCUMENT_EXPIRING_1_DAY":
        return (
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
        );

      case "EMAIL_DELIVERY_FAILED":
        return (
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
            <MailWarning className="w-4 h-4 text-red-600" />
          </div>
        );

      default:
        return (
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <Bell className="w-4 h-4 text-gray-600" />
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

    const difference = Math.floor(
      (now - created) / 1000
    );

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
        className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-700" />

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* =====================================================
          DROPDOWN
      ===================================================== */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-[380px] max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          
          {/* HEADER */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                Notifications
              </h3>

              <p className="text-xs text-gray-500 mt-0.5">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount > 1 ? "s" : ""
                    }`
                  : "You're all caught up"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* NOTIFICATIONS */}
          <div className="max-h-[430px] overflow-y-auto">
            {loading ? (
              <div className="px-4 py-10 text-center">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto" />

                <p className="text-sm text-gray-500 mt-3">
                  Loading notifications...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Bell className="w-6 h-6 text-gray-400" />
                </div>

                <p className="mt-3 text-sm font-medium text-gray-700">
                  No notifications
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  New alerts will appear here.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`relative px-4 py-3 border-b border-gray-100 transition-colors ${
                    notification.isRead
                      ? "bg-white"
                      : "bg-blue-50/60"
                  }`}
                >
                  <div className="flex gap-3">
                    {/* ICON */}
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* CONTENT */}
                    <button
                      type="button"
                      onClick={() =>
                        handleNotificationClick(notification)
                      }
                      className="flex-1 min-w-0 text-left"
                    >
                      <div className="flex items-start justify-between gap-2 pr-6">
                        <h4
                          className={`text-sm ${
                            notification.isRead
                              ? "font-medium text-gray-800"
                              : "font-semibold text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </h4>

                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>

                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {notification.message}
                      </p>

                      <p className="text-[11px] text-gray-400 mt-2">
                        {getRelativeTime(
                          notification.createdAt
                        )}
                      </p>
                    </button>

                    {/* DELETE */}
                    <button
                      type="button"
                      onClick={() =>
                        deleteNotification(
                          notification._id
                        )
                      }
                      className="absolute top-3 right-3 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors"
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
                      className="absolute bottom-3 right-4 text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* FOOTER */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-[11px] text-center text-gray-500">
                Showing your latest {notifications.length} notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;