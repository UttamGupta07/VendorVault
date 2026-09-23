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
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const SuperAdminNavbar = ({ setOpen }) => {
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);

  const profileRef = useRef(null);

  const { user, logout } = useAuth();

  // =====================================================
  // THEME
  // =====================================================

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

  // =====================================================
  // CLOSE PROFILE DROPDOWN WHEN CLICKING OUTSIDE
  // =====================================================

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

  // =====================================================
  // EXTRACT USER INITIALS
  // =====================================================

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

  // =====================================================
  // LOGOUT
  // =====================================================

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
        top-0
        left-0
        right-0
        z-40

        h-[78px]

        flex
        items-center
        justify-between

        border-b
        border-slate-200/80

        bg-white/95
        backdrop-blur-xl

        px-4
        sm:px-6
        lg:pl-[274px]
        lg:pr-8

        shadow-[0_1px_12px_rgba(15,23,42,0.04)]

        dark:border-slate-800
        dark:bg-slate-950/95
        dark:shadow-[0_1px_14px_rgba(0,0,0,0.2)]
      "
    >
      {/* =================================================
          LEFT SECTION
      ================================================= */}

      <div className="flex items-center gap-3">
        {/* Mobile Menu */}

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          className="
            group

            flex
            h-10
            w-10
            items-center
            justify-center

            rounded-xl

            border
            border-slate-200
            bg-slate-50

            text-slate-600

            transition-all
            duration-200

            hover:border-blue-200
            hover:bg-blue-50
            hover:text-blue-600

            active:scale-95

            dark:border-slate-700
            dark:bg-slate-900
            dark:text-slate-300

            dark:hover:border-blue-800
            dark:hover:bg-blue-950/50
            dark:hover:text-blue-400

            lg:hidden
          "
        >
          <Menu
            size={21}
            strokeWidth={2.2}
            className="transition-transform duration-200 group-hover:scale-105"
          />
        </button>

        {/* Desktop Context Label */}

        <div className="hidden lg:flex lg:flex-col">
          <span
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-slate-400

              dark:text-slate-500
            "
          >
            Administration
          </span>

          <span
            className="
              mt-0.5
              text-sm
              font-semibold
              text-slate-700

              dark:text-slate-200
            "
          >
            Super Admin
          </span>
        </div>
      </div>

      {/* =================================================
          RIGHT SECTION
      ================================================= */}

      <div className="flex items-center gap-2 sm:gap-3">
        {/* =================================================
            SEARCH
        ================================================= */}

        <div
          className="
            hidden
            h-11
            w-[230px]
            items-center
            gap-2.5

            rounded-xl

            border
            border-slate-200

            bg-slate-50/80

            px-3.5

            transition-all
            duration-200

            focus-within:border-blue-400
            focus-within:bg-white
            focus-within:ring-4
            focus-within:ring-blue-500/10

            dark:border-slate-700
            dark:bg-slate-900/70

            dark:focus-within:border-blue-700
            dark:focus-within:bg-slate-900

            md:flex
            lg:w-[295px]
          "
        >
          <Search
            size={18}
            strokeWidth={2}
            className="
              shrink-0
              text-slate-400
              dark:text-slate-500
            "
          />

          <input
            type="text"
            placeholder="Search anything..."
            className="
              w-full

              bg-transparent

              text-sm
              font-medium
              text-slate-700

              outline-none

              placeholder:text-slate-400

              dark:text-slate-200
              dark:placeholder:text-slate-500
            "
          />
        </div>

        {/* =================================================
            NOTIFICATION
        ================================================= */}

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center

            rounded-xl

            border
            border-slate-200

            bg-white

            transition-all
            duration-200

            hover:border-blue-200
            hover:bg-blue-50

            dark:border-slate-700
            dark:bg-slate-900

            dark:hover:border-blue-800
            dark:hover:bg-blue-950/40
          "
        >
          <NotificationBell />
        </div>

        {/* =================================================
            DIVIDER
        ================================================= */}

        <div
          className="
            hidden
            h-8
            w-px
            bg-slate-200

            dark:bg-slate-700

            sm:block
          "
        />

        {/* =================================================
            PROFILE
        ================================================= */}

        <div
          ref={profileRef}
          className="relative"
        >
          {/* Profile Button */}

          <button
            type="button"
            onClick={() =>
              setShowProfile((prev) => !prev)
            }
            aria-expanded={showProfile}
            className="
              group

              flex
              items-center
              gap-2.5

              rounded-xl

              p-1.5

              transition-all
              duration-200

              hover:bg-slate-100

              dark:hover:bg-slate-800
            "
          >
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

                overflow-hidden
                rounded-xl

                bg-gradient-to-br
                from-blue-600
                via-blue-700
                to-indigo-700

                text-sm
                font-bold
                text-white

                shadow-sm
                shadow-blue-600/20

                ring-2
                ring-blue-50

                transition-all
                duration-200

                group-hover:shadow-md
                group-hover:shadow-blue-600/25
                group-hover:ring-blue-100

                dark:ring-blue-950
                dark:group-hover:ring-blue-900
              "
            >
              {getInitials(user?.name)}

              {/* Online Indicator */}

              <span
                className="
                  absolute
                  right-0.5
                  bottom-0.5

                  h-2.5
                  w-2.5

                  rounded-full

                  border-2
                  border-white

                  bg-emerald-500

                  dark:border-slate-950
                "
              />
            </div>

            {/* Name */}

            <div className="hidden text-left sm:block">
              <p
                className="
                  max-w-[120px]
                  truncate

                  text-sm
                  font-semibold

                  text-slate-800

                  dark:text-slate-100
                "
              >
                {user?.name || "Super Admin"}
              </p>

              <p
                className="
                  mt-0.5

                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]

                  text-slate-400

                  dark:text-slate-500
                "
              >
                Super Admin
              </p>
            </div>

            {/* Arrow */}

            <ChevronDown
              size={16}
              strokeWidth={2.2}
              className={`
                hidden

                text-slate-400

                transition-transform
                duration-200

                dark:text-slate-500

                sm:block

                ${
                  showProfile
                    ? "rotate-180"
                    : ""
                }
              `}
            />
          </button>

          {/* =================================================
              PROFILE DROPDOWN
          ================================================= */}

          {showProfile && (
            <div
              className="
                absolute
                right-0
                top-[calc(100%+10px)]

                z-50

                w-[280px]

                overflow-hidden

                rounded-2xl

                border
                border-slate-200

                bg-white

                shadow-[0_20px_50px_rgba(15,23,42,0.15)]

                animate-in
                fade-in
                slide-in-from-top-2
                duration-200

                dark:border-slate-700
                dark:bg-slate-900

                dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)]
              "
            >
              {/* =================================================
                  USER INFORMATION
              ================================================= */}

              <div
                className="
                  border-b
                  border-slate-100

                  bg-gradient-to-br
                  from-slate-50
                  to-white

                  px-4
                  py-4

                  dark:border-slate-800
                  dark:from-slate-900
                  dark:to-slate-950
                "
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center

                      rounded-xl

                      bg-gradient-to-br
                      from-blue-600
                      to-indigo-700

                      text-sm
                      font-bold
                      text-white

                      shadow-sm
                    "
                  >
                    {getInitials(user?.name)}
                  </div>

                  {/* User Details */}

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        truncate

                        text-sm
                        font-semibold

                        text-slate-800

                        dark:text-slate-100
                      "
                    >
                      {user?.name || "Super Admin"}
                    </p>

                    <p
                      className="
                        mt-1
                        truncate

                        text-xs

                        text-slate-500

                        dark:text-slate-400
                      "
                    >
                      {user?.email || "Admin Account"}
                    </p>
                  </div>
                </div>

                {/* Role Badge */}

                <div
                  className="
                    mt-4
                    inline-flex
                    items-center
                    gap-1.5

                    rounded-full

                    border
                    border-blue-100

                    bg-blue-50

                    px-2.5
                    py-1

                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]

                    text-blue-700

                    dark:border-blue-900
                    dark:bg-blue-950/50
                    dark:text-blue-400
                  "
                >
                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-blue-500
                    "
                  />

                  Super Admin
                </div>
              </div>

              {/* =================================================
                  PROFILE BUTTON
              ================================================= */}

              <button
                type="button"
                onClick={() => {
                  setShowProfile(false);
                  navigate("/super-admin/profile");
                }}
                className="
                  group

                  flex
                  w-full
                  items-center
                  gap-3

                  px-4
                  py-3.5

                  text-left
                  text-sm
                  font-medium

                  text-slate-700

                  transition-all
                  duration-200

                  hover:bg-blue-50
                  hover:text-blue-700

                  dark:text-slate-200

                  dark:hover:bg-blue-950/40
                  dark:hover:text-blue-400
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center

                    rounded-lg

                    bg-slate-100

                    text-slate-500

                    transition-colors
                    duration-200

                    group-hover:bg-blue-100
                    group-hover:text-blue-600

                    dark:bg-slate-800
                    dark:text-slate-400

                    dark:group-hover:bg-blue-950
                    dark:group-hover:text-blue-400
                  "
                >
                  <User size={17} />
                </span>

                <span>Profile</span>
              </button>

              {/* =================================================
                  LOGOUT
              ================================================= */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  group

                  flex
                  w-full
                  items-center
                  gap-3

                  border-t
                  border-slate-100

                  px-4
                  py-3.5

                  text-left
                  text-sm
                  font-semibold

                  text-slate-600

                  transition-all
                  duration-200

                  hover:bg-red-50
                  hover:text-red-600

                  dark:border-slate-800
                  dark:text-slate-300

                  dark:hover:bg-red-950/30
                  dark:hover:text-red-400
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center

                    rounded-lg

                    bg-slate-100

                    text-slate-500

                    transition-colors
                    duration-200

                    group-hover:bg-red-100
                    group-hover:text-red-600

                    dark:bg-slate-800
                    dark:text-slate-400

                    dark:group-hover:bg-red-950
                    dark:group-hover:text-red-400
                  "
                >
                  <LogOut size={17} />
                </span>

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