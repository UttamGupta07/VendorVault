import React from "react";
import {
  User,
  Mail,
  ShieldCheck,
  Building2,
  Phone,
  MapPin,
  Globe,
  BriefcaseBusiness,
  Users,
  Edit3,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const AdminProfile = () => {
  const { user, organization } = useAuth();

  const formatRole = (role) => {
    if (!role) return "Administrator";

    return role
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getInitials = (name) => {
    if (!name) return "SA";

    return name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-[calc(100vh-84px)] bg-slate-50 p-5 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* PAGE HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View your account and organization details.
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* TOP SECTION */}
          <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 px-6 py-7 sm:px-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              {/* AVATAR */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white text-2xl font-bold text-indigo-600 shadow-md">
                {getInitials(user?.name)}
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-white">
                  {user?.name || "Super Admin"}
                </h2>

                <p className="mt-1 text-sm text-indigo-100">
                  {user?.email || "No email available"}
                </p>

                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                  <ShieldCheck size={14} />
                  {formatRole(user?.role)}
                </div>
              </div>
            </div>
          </div>

          {/* PERSONAL INFORMATION */}
          <div className="p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Personal Information
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Your account details
                </p>
              </div>

              <button
                type="button"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600"
              >
                <Edit3 size={17} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InfoItem
                icon={User}
                label="Full Name"
                value={user?.name || "Not available"}
              />

              <InfoItem
                icon={Mail}
                label="Email Address"
                value={user?.email || "Not available"}
              />

              <InfoItem
                icon={ShieldCheck}
                label="Role"
                value={formatRole(user?.role)}
              />

              <InfoItem
                icon={ShieldCheck}
                label="Account Status"
                value={
                  user?.isActive !== false
                    ? "Active"
                    : "Inactive"
                }
                valueClass={
                  user?.isActive !== false
                    ? "text-emerald-600"
                    : "text-red-600"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================
   INFO ITEM
========================= */

const InfoItem = ({
  icon: Icon,
  label,
  value,
  valueClass = "text-slate-800",
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">
          {label}
        </p>

        <p
          className={`mt-1 break-words text-sm font-semibold ${valueClass}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default AdminProfile;