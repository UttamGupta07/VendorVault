import React, { useEffect, useRef, useState } from "react";
import { Menu, Search, ChevronDown, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import NotificationBell from "../NotificationBell";

const ComplianceNavbar = ({ setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
   const { logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Profile navigation
  const handleProfile = () => {
    setProfileOpen(false);
    window.location.href = "/compliance/profile";
  };

  // Logout
  const handleLogout = () => {
    setProfileOpen(false);

    // // Clear authentication data if stored
    // localStorage.removeItem("token");
    // sessionStorage.removeItem("token");

    // // Redirect to login
    // window.location.href = "/login";
    logout();
  };

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 shadow-[0_1px_10px_rgba(15,23,42,0.04)] backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={21} />
        </button>

        <div>
          <h2 className="text-[15px] font-bold tracking-tight text-slate-900 sm:text-lg">
            Compliance Portal
          </h2>

          <p className="hidden text-xs text-slate-400 sm:block">
            Manage vendor compliance and documents
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <button
          className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 md:flex"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        {/* Notifications */}
        <NotificationBell />

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        {/* Profile Button + Dropdown */}
        <div className="relative hidden sm:block" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className={`flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-left transition ${
              profileOpen
                ? "bg-slate-50"
                : "hover:bg-slate-50"
            }`}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
          >
            {/* Avatar */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-sm">
              CO

              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
            </div>

            {/* User Info */}
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-800">
                Compliance Officer
              </p>

              <p className="text-[10px] text-slate-400">
                Compliance Team
              </p>
            </div>

            <ChevronDown
              size={15}
              className={`text-slate-400 transition-transform duration-200 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-[calc(100%+10px)] w-56 origin-top-right animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50">
                {/* Dropdown Header */}
                <div className="mb-1 border-b border-slate-100 px-3 py-2.5">
                  <p className="text-sm font-semibold text-slate-800">
                    Compliance Officer
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Compliance Team
                  </p>
                </div>

                {/* Profile */}
                <button
                  onClick={handleProfile}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <User size={16} />
                  </span>

                  <span>Profile</span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
                    <LogOut size={16} />
                  </span>

                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ComplianceNavbar;

