import React from "react";
import { Check } from "lucide-react";

const PermissionToggle = ({
  permission,
  checked,
  onChange,
}) => {
  return (
    <button
      type="button"
      onClick={() => onChange(permission.key)}
      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition hover:bg-slate-50"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-700">
          {permission.name}
        </p>

        <p className="mt-0.5 text-xs text-slate-400">
          {permission.key}
        </p>
      </div>

      <div
        className={`relative ml-4 h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-indigo-600"
            : "bg-slate-200"
        }`}
      >
        <div
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        >
          {checked && (
            <Check
              size={11}
              className="m-auto mt-[1px] text-indigo-600"
            />
          )}
        </div>
      </div>
    </button>
  );
};

export default PermissionToggle;