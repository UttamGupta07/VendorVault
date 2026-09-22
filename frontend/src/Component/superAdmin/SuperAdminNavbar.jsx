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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const SuperAdminNavbar = ({ setOpen }) => {
  
  const navigate = useNavigate();

 
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
    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // =========================
  // LOAD USER NOTIFICATIONS
  // =========================

 

  

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
  // MARK NOTIFICATION AS READ
  // =========================

  const handleNotificationClick = async (notification) => {
    if (notification.isRead) {
      return;
    }

    try {
      await markUserNotificationAsRead(
        notification._id
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id
            ? {
              ...item,
              isRead: true,
            }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Mark notification as read error:",
        error.message
      );
    }
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

        
          <NotificationBell />

          
    

        {/* ================= THEME TOGGLE ================= */}

        {/* Theme toggle intentionally disabled */}

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
                ${showProfile
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