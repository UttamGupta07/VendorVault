import React from "react";
import {
  ShieldCheck,
  UserCog,
  Building2,
  Eye,
  Users,
  ChevronRight,
} from "lucide-react";

const roleConfig = {
  SUPER_ADMIN: {
    icon: ShieldCheck,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    badge: "bg-purple-50 text-purple-700",
  },

  COMPLIANCE_OFFICER: {
    icon: UserCog,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    badge: "bg-indigo-50 text-indigo-700",
  },

  VENDOR: {
    icon: Building2,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-700",
  },

  AUDITOR: {
    icon: Eye,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    badge: "bg-amber-50 text-amber-700",
  },
};

const RoleCard = ({ role, onManage }) => {
  const config =
    roleConfig[role.name] || roleConfig.AUDITOR;

  const Icon = config.icon;

  const permissionCount =
    role.permissions?.includes("*")
      ? "Full Access"
      : `${role.permissions?.length || 0} Permissions`;

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${config.iconBg}`}
        >
          <Icon
            size={22}
            className={config.iconColor}
          />
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${config.badge}`}
        >
          {role.isSystemRole
            ? "System Role"
            : "Custom Role"}
        </span>
      </div>

      {/* Role info */}
      <div className="mt-5">
        <h3 className="text-base font-bold text-slate-900">
          {role.displayName}
        </h3>

        <p className="mt-1 min-h-[40px] text-sm leading-5 text-slate-500">
          {role.description ||
            "Manage access and permissions for this role."}
        </p>
      </div>

      {/* Stats */}
      <div className="mt-5 flex items-center gap-4 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
            <ShieldCheck
              size={15}
              className="text-slate-500"
            />
          </div>

          <div>
            <p className="text-xs text-slate-400">
              Access
            </p>
            <p className="text-xs font-semibold text-slate-700">
              {permissionCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
            <Users
              size={15}
              className="text-slate-500"
            />
          </div>

          <div>
            <p className="text-xs text-slate-400">
              Users
            </p>
            <p className="text-xs font-semibold text-slate-700">
              —
            </p>
          </div>
        </div>
      </div>

      {/* Manage */}
      <button
        type="button"
        onClick={() => onManage(role)}
        disabled={role.name === "SUPER_ADMIN"}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
          role.name === "SUPER_ADMIN"
            ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400"
            : "border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
        }`}
      >
        {role.name === "SUPER_ADMIN"
          ? "Full Access"
          : "Manage Permissions"}

        {role.name !== "SUPER_ADMIN" && (
          <ChevronRight size={16} />
        )}
      </button>
    </div>
  );
};

export default RoleCard;