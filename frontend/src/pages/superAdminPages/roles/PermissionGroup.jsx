import React from "react";
import {
  Users,
  FileText,
  ShieldCheck,
  Clock3,
  Bell,
  BarChart3,
  ClipboardList,
  UserCog,
} from "lucide-react";

import PermissionToggle from "./PermissionToggle";

const categoryIcons = {
  "User Management": Users,
  "Vendor Management": UserCog,
  "Document Management": FileText,
  "Compliance Management": ShieldCheck,
  "Expiry Management": Clock3,
  "Alert Management": Bell,
  Reports: BarChart3,
  Audit: ClipboardList,
};

const PermissionGroup = ({
  category,
  permissions,
  selectedPermissions,
  onToggle,
}) => {
  const Icon =
    categoryIcons[category] || ShieldCheck;

  const selectedCount = permissions.filter(
    (permission) =>
      selectedPermissions.includes(permission.key)
  ).length;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Group header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
            <Icon
              size={18}
              className="text-indigo-600"
            />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800">
              {category}
            </h3>

            <p className="mt-0.5 text-xs text-slate-400">
              {selectedCount} of{" "}
              {permissions.length} enabled
            </p>
          </div>
        </div>

        <div className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">
          {permissions.length}
        </div>
      </div>

      {/* Permissions */}
      <div className="divide-y divide-slate-100 p-2">
        {permissions.map((permission) => (
          <PermissionToggle
            key={permission.key}
            permission={permission}
            checked={selectedPermissions.includes(
              permission.key
            )}
            onChange={onToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default PermissionGroup;