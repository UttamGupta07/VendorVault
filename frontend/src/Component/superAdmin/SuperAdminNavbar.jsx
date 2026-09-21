import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import NotificationBell from "../NotificationBell";

import { useNavigate } from "react-router-dom";

import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  XCircle,
  AlertTriangle,
  Clock,
  CheckCircle,
  User,
  LogOut,
  // Moon,
  // Sun,
} from "lucide-react";

import { getSuperAdminDashboard } from "../../api/adminDashboardApi";
import { useAuth } from "../../context/AuthContext";

const SuperAdminNavbar = ({ setOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showProfile, setShowProfile] =
    useState(false);

  const profileRef = useRef(null);

  const { user, logout } = useAuth();

  // =========================
  // THEME
  // =========================

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // =========================
  // LOAD NOTIFICATIONS
  // =========================

  const loadNotifications = async () => {
    try {
      const response =
        await getSuperAdminDashboard();

      if (response?.success) {
        setNotifications(
          response?.data?.notifications || []
        );
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

  // =========================
  // CLOSE PROFILE DROPDOWN
  // =========================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================
  // UNREAD COUNT
  // =========================

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
      return "bg-[#DCD3E0] text-[#3A3550] dark:bg-gray-700 dark:text-gray-200";
    }

    if (type === "7_DAY") {
      return "bg-[#B7AFC9] text-[#585272] dark:bg-gray-700 dark:text-gray-200";
    }

    return "bg-[#DCD3E0] text-[#585272] dark:bg-gray-700 dark:text-gray-200";
  };

  // =========================
  // FORMAT TIME
  // =========================

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================
  // EXTRACT USER INITIALS
  // =========================

  const getInitials = (name) => {
    if (!name) return "SA";

    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    try {
      setShowProfile(false);
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
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
        border-[#DCD3E0]
        bg-[#FFF]
        px-5
        shadow-sm
        dark:border-gray-700
        dark:bg-gray-900
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
            transition
            hover:bg-[#abaaac]
            dark:hover:bg-gray-700
            lg:hidden
          "
        >
          <Menu size={23} />
        </button>
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
            border-[#DCD3E0]
            px-3
            dark:border-gray-700
            md:flex
            lg:w-[295px]
          "
        >
          <Search
            size={19}
            className="shrink-0"
          />

          <input
            type="text"
            placeholder="Search anything..."
            className="
              w-full
              bg-transparent
              text-sm
              outline-none
              placeholder:text-[#B7AFC9]
              dark:placeholder:text-gray-500
            "
          />
        </div>

        {/* ================= NOTIFICATION ================= */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setShowNotifications(
                (prev) => !prev
              )
            }
            className="
              relative
              rounded-xl
              p-2.5
              transition
              hover:bg-[#DCD3E0]
              dark:hover:bg-gray-700
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
                  bg-[#585272]
                  px-1
                  text-[10px]
                  font-bold
                  text-[#F4EFF3]
                "
              >
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>

          {/* ================= NOTIFICATION PANEL ================= */}
          <NotificationBell/>

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
                border-[#DCD3E0]
                bg-[#F4EFF3]
                shadow-xl
                dark:border-gray-700
                dark:bg-gray-800
              "
            >

              {/* Header */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-[#DCD3E0]
                  p-4
                  dark:border-gray-700
                "
              >
                <div>
                  <h3 className="text-sm font-semibold dark:text-gray-100">
                    Notifications
                  </h3>

                  <p className="mt-0.5 text-xs text-[#8A82A6] dark:text-gray-400">
                    {unreadCount} unread notification
                    {unreadCount !== 1
                      ? "s"
                      : ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowNotifications(false)
                  }
                  className="
                    rounded-lg
                    p-1.5
                    transition
                    hover:bg-[#DCD3E0]
                    hover:text-[#585272]
                    dark:hover:bg-gray-700
                  "
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
                      className="mx-auto text-[#585272] dark:text-gray-300"
                    />

                    <p className="mt-2 text-sm font-medium text-[#585272] dark:text-gray-200">
                      No notifications
                    </p>

                    <p className="mt-1 text-xs text-[#B7AFC9] dark:text-gray-400">
                      You're all caught up.
                    </p>

                  </div>
                ) : (
                  notifications.map(
                    (notification) => {
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
                            border-[#DCD3E0]
                            p-4
                            transition
                            hover:bg-[#DCD3E0]/50
                            dark:border-gray-700
                            dark:hover:bg-gray-700
                            ${
                              !notification.isRead
                                ? "bg-[#DCD3E0]/40 dark:bg-gray-700/60"
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

                              <p className="text-sm font-semibold text-[#3A3550] dark:text-gray-100">
                                {notification.title}
                              </p>

                              {!notification.isRead && (
                                <span
                                  className="
                                    mt-1
                                    h-2
                                    w-2
                                    shrink-0
                                    rounded-full
                                    bg-[#585272]
                                  "
                                />
                              )}

                            </div>

                            <p className="mt-1 text-xs leading-5 text-[#585272] dark:text-gray-300">
                              {notification.message}
                            </p>

                            <div className="mt-2 flex items-center justify-between gap-2">

                              <span className="truncate text-xs font-medium text-[#8A82A6] dark:text-gray-400">
                                {notification.vendorId
                                  ?.companyName ||
                                  notification
                                    .vendorId
                                    ?.name ||
                                  "Vendor"}
                              </span>

                              <span className="whitespace-nowrap text-[11px] text-[#B7AFC9] dark:text-gray-500">
                                {formatTime(
                                  notification.createdAt
                                )}
                              </span>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )
                )}

              </div>
            </div>
          )}
        </div>

        {/* ================= THEME TOGGLE =================

        <button
          type="button"
          onClick={toggleDarkMode}
          title={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          aria-label={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          className="
            rounded-xl
            p-2.5
            transition
            hover:bg-[#DCD3E0]
            dark:hover:bg-gray-700
          "
        >
          {darkMode ? (
            <Sun size={21} />
          ) : (
            <Moon size={21} />
          )}
        </button> */}

        {/* ================= DIVIDER ================= */}

        <div className="hidden h-8 w-px bg-[#d3d3e0] dark:bg-gray-700 sm:block" />

        {/* ================= PROFILE ================= */}

        <div
          ref={profileRef}
          className="relative"
        >

          {/* Profile Button */}

          <button
            type="button"
            onClick={() =>
              setShowProfile(
                (prev) => !prev
              )
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              p-1.5
              transition
              hover:bg-[#cfcfdf]
              dark:hover:bg-gray-700
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
                bg-[#3A3550]
                text-sm
                font-semibold
                text-[#F4EFF3]
              "
            >
              {getInitials(user?.name)}
            </div>

            {/* Name */}

            <span className="hidden text-sm font-semibold dark:text-gray-100 sm:block">
              Super Admin
            </span>

            {/* Arrow */}

            <ChevronDown
              size={17}
              className={`
                hidden
                text-[#8A82A6]
                transition-transform
                duration-200
                dark:text-gray-400
                sm:block
                ${
                  showProfile
                    ? "rotate-180"
                    : ""
                }
              `}
            />

          </button>

          {/* ================= PROFILE DROPDOWN ================= */}

          {showProfile && (
            <div
              className="
                absolute
                right-0
                top-14
                z-50
                w-60
                overflow-hidden
                rounded-2xl
                border
                border-[#DCD3E0]
                bg-[#F4EFF3]
                shadow-xl
                dark:border-gray-700
                dark:bg-gray-800
              "
            >

              {/* User Information */}

              <div
                className="
                  border-b
                  border-[#DCD3E0]
                  px-4
                  py-4
                  dark:border-gray-700
                "
              >
                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#3A3550]
                      text-sm
                      font-semibold
                      text-[#F4EFF3]
                    "
                  >
                    {getInitials(user?.name)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold dark:text-gray-100">
                      {user?.name ||
                        "Super Admin"}
                    </p>

                    <p className="truncate text-xs text-[#8A82A6] dark:text-gray-400">
                      {user?.email ||
                        "Admin Account"}
                    </p>
                  </div>

                </div>

                <span
                  className="
                    mt-3
                    inline-flex
                    rounded-full
                    bg-[#d3d4e0]
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    tracking-wide
                    dark:bg-gray-700
                    dark:text-gray-200
                  "
                >
                  SUPER ADMIN
                </span>
              </div>

              {/* Profile Button */}

              <button
                type="button"
                onClick={() => {
                  setShowProfile(false);
                  navigate("/super-admin/profile");
                }}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-medium
                  transition
                  hover:bg-[#DCD3E0]
                  dark:text-gray-100
                  dark:hover:bg-gray-700
                "
              >
                <User
                  size={18}
                  className="text-[#8A82A6] dark:text-gray-400"
                />

                <span>Profile</span>
              </button>

              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  border-t
                  border-[#DCD3E0]
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-semibold
                  transition
                  hover:bg-[#DCD3E0]
                  dark:border-gray-700
                  dark:text-gray-100
                  dark:hover:bg-gray-700
                "
              >
                <LogOut size={18} />

                <span>Logout</span>
              </button>

            </div>
          )}

        </div>

      </div>
    </header>
  );
};

export default SuperAdminNavbar;