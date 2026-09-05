import React from "react";
import {
  Menu,
  Bell,
  UserCircle,
  ChevronDown,
} from "lucide-react";

const VendorNavbar = ({ setSidebarOpen }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30">

      <div className="h-full px-6 flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-4">

          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={22} />
          </button>

          <div>
            <h2 className="font-semibold text-gray-800">
              Vendor Portal
            </h2>

            <p className="text-xs text-gray-500">
              Manage your compliance
            </p>
          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Notification */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100">

            <Bell size={20} />

            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />

          </button>

          <div className="h-8 w-px bg-gray-200" />

          {/* Profile */}
          <button className="flex items-center gap-2">

            <UserCircle
              size={32}
              className="text-gray-500"
            />

            <div className="hidden sm:block text-left">

              <p className="text-sm font-medium text-gray-800">
                Vendor
              </p>

              <p className="text-xs text-gray-500">
                Vendor Account
              </p>

            </div>

            <ChevronDown
              size={16}
              className="text-gray-400"
            />

          </button>

        </div>

      </div>

    </header>
  );
};

export default VendorNavbar;