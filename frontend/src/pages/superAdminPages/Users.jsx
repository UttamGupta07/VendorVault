 import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

import {
  Search,
  Plus,
  Users as UsersIcon,
  ShieldCheck,
  Store,
  UserCheck,
  UserX,
  MoreVertical,
  Pencil,
  Trash2,
  Power,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_URL = "/api/admin/users";

// ======================================================
// ROLE CONFIG
// ======================================================

const roleLabels = {
  SUPER_ADMIN: "Super Admin",
  COMPLIANCE_OFFICER: "Compliance Officer",
  AUDITOR: "Auditor",
  VENDOR: "Vendor",
};

const roleStyles = {
  SUPER_ADMIN: "bg-[#1C2B3A] text-[#F5F3EB]",
  COMPLIANCE_OFFICER: "bg-[#E8E0CE] text-[#8B631F]",
  AUDITOR: "bg-[#DCE8E1] text-[#33604F]",
  VENDOR: "bg-[#F0DDD7] text-[#A6402B]",
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const Users = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [menuId, setMenuId] = useState(null);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // ====================================================
  // FETCH USERS
  // ====================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: 10,
      };

      // Don't send "All" to backend
      if (search.trim()) {
        params.search = search.trim();
      }

      if (role !== "All") {
        params.role = role;
      }

      if (status !== "All") {
        params.status = status;
      }

      const response = await axiosInstance.get(API_URL, {
        params,
      });

      if (response.data.success) {
        setUsers(response.data.users || []);

        setPagination(
          response.data.pagination || {
            currentPage: page,
            totalPages: 1,
            totalUsers: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          }
        );
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to load users.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // INITIAL + FILTER/PAGE FETCH
  // ====================================================

  useEffect(() => {
    fetchUsers();
  }, [page, role, status]);

  // ====================================================
  // SEARCH WITH DEBOUNCE
  // ====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // ====================================================
  // CLEAR MESSAGE
  // ====================================================

  useEffect(() => {
    if (!message.text) return;

    const timer = setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 3500);

    return () => clearTimeout(timer);
  }, [message]);

  // ====================================================
  // CREATE USER
  // ====================================================

  const handleCreateUser = async (form) => {
    try {
      setSaving(true);

      const response = await axiosInstance.post(
        API_URL,
        form
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text:
            response.data.message ||
            "User created successfully.",
        });

        setShowModal(false);
        setEditingUser(null);

        await fetchUsers();
      }
    } catch (error) {
      console.error("Create user error:", error);

      throw new Error(
        error.response?.data?.message ||
          "Failed to create user."
      );
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // UPDATE USER
  // ====================================================

  const handleUpdateUser = async (id, form) => {
    try {
      setSaving(true);

      const response = await axiosInstance.put(
        `${API_URL}/${id}`,
        form
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text:
            response.data.message ||
            "User updated successfully.",
        });

        setShowModal(false);
        setEditingUser(null);

        await fetchUsers();
      }
    } catch (error) {
      console.error("Update user error:", error);

      throw new Error(
        error.response?.data?.message ||
          "Failed to update user."
      );
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // TOGGLE USER STATUS
  // ====================================================

  const handleToggleStatus = async (user) => {
    try {
      setMenuId(null);

      const response = await axiosInstance.patch(
        `${API_URL}/${user._id}/status`
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text:
            response.data.message ||
            "User status updated.",
        });

        await fetchUsers();
      }
    } catch (error) {
      console.error(
        "Toggle status error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to update user status.",
      });
    }
  };

  // ====================================================
  // DELETE USER
  // ====================================================

  const handleDeleteUser = async (user) => {
    setMenuId(null);

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) return;

    try {
      const response = await axiosInstance.delete(
        `${API_URL}/${user._id}`
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text:
            response.data.message ||
            "User deleted successfully.",
        });

        // If deleting last user on current page
        if (users.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        } else {
          await fetchUsers();
        }
      }
    } catch (error) {
      console.error(
        "Delete user error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to delete user.",
      });
    }
  };

  // ====================================================
  // MODAL
  // ====================================================

  const openCreateModal = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setMenuId(null);
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingUser(null);
  };

  // ====================================================
  // STATS
  // ====================================================

  const totalUsers = pagination.totalUsers || 0;

  const activeUsers = users.filter(
    (user) => user.isActive
  ).length;

  const complianceOfficers = users.filter(
    (user) => user.role === "COMPLIANCE_OFFICER"
  ).length;

  const vendors = users.filter(
    (user) => user.role === "VENDOR"
  ).length;

  return (
    <div
      className="min-h-screen bg-[#EDEAE0] text-[#1C2B3A]"
      onClick={() => setMenuId(null)}
    >
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-[#A8792C]">
            Organization
          </p>

          <h1 className="text-3xl font-semibold tracking-tight">
            User Management
          </h1>

          <p className="mt-2 max-w-xl text-sm text-[#54636F]">
            Manage administrators, compliance officers,
            auditors and vendors in your organization.
          </p>
        </div>

        <button
          onClick={(event) => {
            event.stopPropagation();
            openCreateModal();
          }}
          className="flex items-center justify-center gap-2 bg-[#1C2B3A] px-5 py-3 text-sm font-semibold text-[#F5F3EB] transition hover:bg-[#A8792C]"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* ==================================================
          MESSAGE
      ================================================== */}

      {message.text && (
        <div
          className={`mb-6 flex items-center gap-3 border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-[#33604F] bg-[#DCE8E1] text-[#33604F]"
              : "border-[#A6402B] bg-[#F0DDD7] text-[#A6402B]"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}

          <span>{message.text}</span>
        </div>
      )}

      {/* ==================================================
          STATS
      ================================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={UsersIcon}
        />

        <StatCard
          title="Active on Page"
          value={activeUsers}
          icon={UserCheck}
        />

        <StatCard
          title="Compliance Officers"
          value={complianceOfficers}
          icon={ShieldCheck}
        />

        <StatCard
          title="Vendors"
          value={vendors}
          icon={Store}
        />
      </div>

      {/* ==================================================
          TABLE CARD
      ================================================== */}

      <div className="border border-[#C9C2AE] bg-[#F5F3EB]">
        {/* FILTERS */}

        <div className="flex flex-col gap-4 border-b border-[#C9C2AE] p-5 lg:flex-row">
          {/* SEARCH */}

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#54636F]"
            />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border border-[#C9C2AE] bg-[#EDEAE0] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#A8792C]"
            />
          </div>

          {/* ROLE */}

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="border border-[#C9C2AE] bg-[#EDEAE0] px-4 py-3 text-sm outline-none focus:border-[#A8792C]"
          >
            <option value="All">All Roles</option>
            <option value="SUPER_ADMIN">
              Super Admin
            </option>
            <option value="COMPLIANCE_OFFICER">
              Compliance Officer
            </option>
            <option value="AUDITOR">
              Auditor
            </option>
            <option value="VENDOR">
              Vendor
            </option>
          </select>

          {/* STATUS */}

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="border border-[#C9C2AE] bg-[#EDEAE0] px-4 py-3 text-sm outline-none focus:border-[#A8792C]"
          >
            <option value="All">All Status</option>
            <option value="Active">
              Active
            </option>
            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>

        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#C9C2AE] text-left text-xs uppercase tracking-wider text-[#54636F]">
                <th className="px-6 py-4">
                  User
                </th>

                <th className="px-6 py-4">
                  Role
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Verification
                </th>

                <th className="px-6 py-4">
                  Last Login
                </th>

                <th className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <LoadingState />
              ) : users.length === 0 ? (
                <EmptyState />
              ) : (
                users.map((user) => (
                  <UserRow
                    key={user._id}
                    user={user}
                    menuId={menuId}
                    setMenuId={setMenuId}
                    onEdit={openEditModal}
                    onDelete={handleDeleteUser}
                    onToggle={handleToggleStatus}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ==================================================
            PAGINATION
        ================================================== */}

        <div className="flex items-center justify-between border-t border-[#C9C2AE] px-5 py-4">
          <p className="text-sm text-[#54636F]">
            Page{" "}
            {pagination.currentPage || page}{" "}
            of {pagination.totalPages || 1}
          </p>

          <div className="flex gap-2">
            <button
              disabled={
                !pagination.hasPreviousPage
              }
              onClick={() =>
                setPage((prev) => prev - 1)
              }
              className="border border-[#C9C2AE] p-2 transition hover:bg-[#EDEAE0] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              disabled={
                !pagination.hasNextPage
              }
              onClick={() =>
                setPage((prev) => prev + 1)
              }
              className="border border-[#C9C2AE] p-2 transition hover:bg-[#EDEAE0] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          MODAL
      ================================================== */}

      {showModal && (
        <UserModal
          user={editingUser}
          saving={saving}
          onClose={closeModal}
          onCreate={handleCreateUser}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
};

// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({
  title,
  value,
  icon: Icon,
}) => {
  return (
    <div className="border border-[#C9C2AE] bg-[#F5F3EB] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#54636F]">
            {title}
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {value}
          </p>
        </div>

        <div className="bg-[#EDEAE0] p-3 text-[#A8792C]">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

// ======================================================
// USER ROW
// ======================================================

const UserRow = ({
  user,
  menuId,
  setMenuId,
  onEdit,
  onDelete,
  onToggle,
}) => {
  const isMenuOpen = menuId === user._id;

  return (
    <tr className="border-b border-[#C9C2AE] last:border-0 hover:bg-[#EDEAE0]/50">
      {/* USER */}

      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#1C2B3A] text-sm font-semibold text-[#F5F3EB]">
            {user.name
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </div>

          <div>
            <p className="font-medium">
              {user.name}
            </p>

            <p className="mt-1 text-xs text-[#54636F]">
              {user.email}
            </p>
          </div>
        </div>
      </td>

      {/* ROLE */}

      <td className="px-6 py-5">
        <span
          className={`inline-flex px-3 py-1 text-xs font-semibold ${
            roleStyles[user.role] ||
            "bg-[#EDEAE0] text-[#1C2B3A]"
          }`}
        >
          {roleLabels[user.role] ||
            user.role}
        </span>
      </td>

      {/* STATUS */}

      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              user.isActive
                ? "bg-[#33604F]"
                : "bg-[#A6402B]"
            }`}
          />

          <span className="text-sm">
            {user.isActive
              ? "Active"
              : "Inactive"}
          </span>
        </div>
      </td>

      {/* VERIFICATION */}

      <td className="px-6 py-5">
        <span
          className={`text-xs font-medium ${
            user.isEmailVerified
              ? "text-[#33604F]"
              : "text-[#A6402B]"
          }`}
        >
          {user.isEmailVerified
            ? "Verified"
            : "Not verified"}
        </span>
      </td>

      {/* LAST LOGIN */}

      <td className="px-6 py-5 text-sm text-[#54636F]">
        {user.lastLoginAt
          ? new Date(
              user.lastLoginAt
            ).toLocaleDateString()
          : "Never"}
      </td>

      {/* ACTIONS */}

      <td className="relative px-6 py-5 text-right">
        <button
          onClick={(event) => {
            event.stopPropagation();

            setMenuId(
              isMenuOpen ? null : user._id
            );
          }}
          className="p-2 transition hover:bg-[#EDEAE0]"
        >
          <MoreVertical size={18} />
        </button>

        {isMenuOpen && (
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="absolute right-6 top-14 z-30 w-48 border border-[#C9C2AE] bg-[#F5F3EB] py-1 text-left shadow-lg"
          >
            {/* EDIT */}

            <button
              onClick={() => onEdit(user)}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-[#EDEAE0]"
            >
              <Pencil size={16} />
              Edit User
            </button>

            {/* STATUS */}

            <button
              onClick={() =>
                onToggle(user)
              }
              className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-[#EDEAE0]"
            >
              {user.isActive ? (
                <>
                  <UserX size={16} />
                  Deactivate
                </>
              ) : (
                <>
                  <Power size={16} />
                  Activate
                </>
              )}
            </button>

            {/* DELETE */}

            <button
              onClick={() =>
                onDelete(user)
              }
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#A6402B] hover:bg-[#F0DDD7]"
            >
              <Trash2 size={16} />
              Delete User
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

// ======================================================
// LOADING STATE
// ======================================================

const LoadingState = () => {
  return (
    <tr>
      <td
        colSpan="6"
        className="py-16 text-center"
      >
        <Loader2
          className="mx-auto animate-spin text-[#A8792C]"
          size={28}
        />

        <p className="mt-3 text-sm text-[#54636F]">
          Loading users...
        </p>
      </td>
    </tr>
  );
};

// ======================================================
// EMPTY STATE
// ======================================================

const EmptyState = () => {
  return (
    <tr>
      <td
        colSpan="6"
        className="py-16 text-center"
      >
        <UsersIcon
          className="mx-auto text-[#C9C2AE]"
          size={40}
        />

        <p className="mt-3 font-medium">
          No users found
        </p>

        <p className="mt-1 text-sm text-[#54636F]">
          Try changing your search or filters.
        </p>
      </td>
    </tr>
  );
};

// ======================================================
// USER MODAL
// ======================================================

const UserModal = ({
  user,
  saving,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const isEditing = Boolean(user);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "VENDOR",
  });

  const [error, setError] = useState("");

  // ====================================================
  // INPUT CHANGE
  // ====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Basic validation

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    // Password required only while creating

    if (!isEditing && !form.password) {
      setError("Password is required.");
      return;
    }

    if (
      !isEditing &&
      form.password.length < 6
    ) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      if (isEditing) {
        // Don't send empty password during update

        const updateData = {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
        };

        if (form.password.trim()) {
          updateData.password =
            form.password;
        }

        await onUpdate(
          user._id,
          updateData
        );
      } else {
        const createData = {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        };

        await onCreate(createData);
      }
    } catch (error) {
      setError(
        error.message ||
          "Something went wrong."
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C2B3A]/60 p-4"
      onClick={onClose}
    >
      <div
        onClick={(event) =>
          event.stopPropagation()
        }
        className="w-full max-w-lg border border-[#C9C2AE] bg-[#F5F3EB]"
      >
        {/* MODAL HEADER */}

        <div className="flex items-center justify-between border-b border-[#C9C2AE] px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold">
              {isEditing
                ? "Edit User"
                : "Add New User"}
            </h2>

            <p className="mt-1 text-sm text-[#54636F]">
              {isEditing
                ? "Update user information and role."
                : "Create a user for your organization."}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={saving}
            className="p-2 hover:bg-[#EDEAE0] disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {/* ERROR */}

          {error && (
            <div className="flex items-start gap-2 border border-[#A6402B] bg-[#F0DDD7] px-4 py-3 text-sm text-[#A6402B]">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>
          )}

          {/* NAME */}

          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter full name"
          />

          {/* EMAIL */}

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@company.com"
          />

          {/* PASSWORD */}

          <Input
            label={
              isEditing
                ? "New Password"
                : "Password"
            }
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder={
              isEditing
                ? "Leave empty to keep current password"
                : "Minimum 6 characters"
            }
            required={!isEditing}
          />

          {/* ROLE */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Role
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-[#C9C2AE] bg-[#EDEAE0] px-4 py-3 text-sm outline-none focus:border-[#A8792C]"
            >
              <option value="SUPER_ADMIN">
                Super Admin
              </option>

              <option value="COMPLIANCE_OFFICER">
                Compliance Officer
              </option>

              <option value="AUDITOR">
                Auditor
              </option>

              <option value="VENDOR">
                Vendor
              </option>
            </select>
          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3 border-t border-[#C9C2AE] pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="border border-[#C9C2AE] px-5 py-3 text-sm font-medium hover:bg-[#EDEAE0] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#1C2B3A] px-5 py-3 text-sm font-semibold text-[#F5F3EB] hover:bg-[#A8792C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              {isEditing
                ? "Save Changes"
                : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ======================================================
// INPUT COMPONENT
// ======================================================

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <input
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-[#C9C2AE] bg-[#EDEAE0] px-4 py-3 text-sm outline-none transition focus:border-[#A8792C]"
      />
    </div>
  );
};

export default Users;