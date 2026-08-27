import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ShieldCheck,
  Search,
  ArrowLeft,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

import RoleCard from "../../pages/superAdminPages/roles/RoleCard";
import PermissionGroup from "../../pages/superAdminPages/roles/PermissionGroup";

const RolesPermissions = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] =
    useState([]);

  const [selectedRole, setSelectedRole] =
    useState(null);

  const [selectedPermissions, setSelectedPermissions] =
    useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==================================================
  // FETCH ROLES + PERMISSIONS
  // ==================================================

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        rolesResponse,
        permissionsResponse,
      ] = await Promise.all([
        axiosInstance.get("/api/admin/roles"),
        axiosInstance.get(
          "/api/admin/roles/permissions/catalog"
        ),
      ]);

      setRoles(
        rolesResponse.data.roles || []
      );

      setPermissions(
        permissionsResponse.data.permissions || []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load roles and permissions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==================================================
  // GROUP PERMISSIONS
  // ==================================================

  const groupedPermissions = useMemo(() => {
    return permissions.reduce(
      (groups, permission) => {
        if (!groups[permission.category]) {
          groups[permission.category] = [];
        }

        groups[permission.category].push(
          permission
        );

        return groups;
      },
      {}
    );
  }, [permissions]);

  // ==================================================
  // SEARCH ROLES
  // ==================================================

  const filteredRoles = roles.filter((role) =>
    role.displayName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // ==================================================
  // SELECT ROLE
  // ==================================================

  const handleManageRole = (role) => {
    setSelectedRole(role);

    setSelectedPermissions(
      role.permissions?.includes("*")
        ? permissions.map(
            (permission) => permission.key
          )
        : role.permissions || []
    );

    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==================================================
  // BACK
  // ==================================================

  const handleBack = () => {
    setSelectedRole(null);
    setSelectedPermissions([]);
    setSuccess("");
    setError("");
  };

  // ==================================================
  // TOGGLE PERMISSION
  // ==================================================

  const handleTogglePermission = (
    permissionKey
  ) => {
    setSelectedPermissions((current) => {
      if (current.includes(permissionKey)) {
        return current.filter(
          (permission) =>
            permission !== permissionKey
        );
      }

      return [
        ...current,
        permissionKey,
      ];
    });

    setSuccess("");
  };

  // ==================================================
  // SELECT ALL
  // ==================================================

  const handleSelectAll = () => {
    setSelectedPermissions(
      permissions.map(
        (permission) => permission.key
      )
    );
  };

  // ==================================================
  // CLEAR ALL
  // ==================================================

  const handleClearAll = () => {
    setSelectedPermissions([]);
  };

  // ==================================================
  // SAVE
  // ==================================================

  const handleSave = async () => {
    if (!selectedRole) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response =
        await axiosInstance.patch(
          `/api/admin/roles/${selectedRole.name}/permissions`,
          {
            permissions:
              selectedPermissions,
          }
        );

      const updatedRole =
        response.data.role;

      // Update local role
      setRoles((currentRoles) =>
        currentRoles.map((role) =>
          role.name === updatedRole.name
            ? updatedRole
            : role
        )
      );

      setSelectedRole(updatedRole);

      setSuccess(
        "Permissions updated successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update permissions."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // RESET
  // ==================================================

  const handleReset = async () => {
    if (!selectedRole) return;

    const confirmed = window.confirm(
      `Reset ${selectedRole.displayName} permissions to default?`
    );

    if (!confirmed) return;

    try {
      setResetting(true);
      setError("");
      setSuccess("");

      const response =
        await axiosInstance.patch(
          `/api/admin/roles/${selectedRole.name}/reset`
        );

      const updatedRole =
        response.data.role;

      setRoles((currentRoles) =>
        currentRoles.map((role) =>
          role.name === updatedRole.name
            ? updatedRole
            : role
        )
      );

      setSelectedRole(updatedRole);

      setSelectedPermissions(
        updatedRole.permissions || []
      );

      setSuccess(
        "Permissions restored to default."
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to reset permissions."
      );
    } finally {
      setResetting(false);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />

          <p className="text-sm text-slate-500">
            Loading roles and permissions...
          </p>
        </div>
      </div>
    );
  }

  // ==================================================
  // ROLE LIST
  // ==================================================

  if (!selectedRole) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                <ShieldCheck
                  size={21}
                  className="text-indigo-600"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Roles & Permissions
                </h1>

                <p className="mt-0.5 text-sm text-slate-500">
                  Control access across your
                  organization.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle size={18} />

            {error}
          </div>
        )}

        {/* Toolbar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search roles..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Role cards */}
        {filteredRoles.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
            <ShieldCheck
              size={36}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-medium text-slate-600">
              No roles found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredRoles.map((role) => (
              <RoleCard
                key={role.name}
                role={role}
                onManage={handleManageRole}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==================================================
  // PERMISSION MANAGEMENT
  // ==================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {selectedRole.displayName}
              </h1>

              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600">
                {selectedRole.name}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Manage permissions for this role.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={resetting}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw
              size={16}
              className={
                resetting
                  ? "animate-spin"
                  : ""
              }
            />

            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>

      {/* System role warning */}
      {selectedRole.name ===
        "SUPER_ADMIN" && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <Lock
            size={19}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <div>
            <p className="text-sm font-semibold text-amber-800">
              Super Admin has full access
            </p>

            <p className="mt-1 text-xs text-amber-700">
              Super Admin permissions are
              protected and cannot be modified.
            </p>
          </div>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={18} />

          {success}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={18} />

          {error}
        </div>
      )}

      {/* Permission summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Permission Access
            </p>

            <div className="mt-1 flex items-end gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {selectedPermissions.length}
              </span>

              <span className="pb-1 text-sm text-slate-400">
                / {permissions.length}
                {" "}permissions enabled
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Select All
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{
              width: `${
                permissions.length
                  ? (selectedPermissions.length /
                      permissions.length) *
                    100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      {/* Permission groups */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {Object.entries(
          groupedPermissions
        ).map(
          ([category, categoryPermissions]) => (
            <PermissionGroup
              key={category}
              category={category}
              permissions={
                categoryPermissions
              }
              selectedPermissions={
                selectedPermissions
              }
              onToggle={
                handleTogglePermission
              }
            />
          )
        )}
      </div>

      {/* Bottom save */}
      <div className="sticky bottom-4 z-20 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Unsaved permission changes
            </p>

            <p className="text-xs text-slate-400">
              Save your changes to update this
              role's access.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            <Save size={16} />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RolesPermissions;