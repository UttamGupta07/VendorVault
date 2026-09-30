 import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  MapPin,
  BriefcaseBusiness,
  CalendarDays,
  Clock,
  Globe,
  Edit3,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

const Profile = () => {
  // ============================================================
  // PROFILE STATE
  // ============================================================

  const [profile, setProfile] = useState(null);
  const [organization, setOrganization] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // EDIT PROFILE STATE
  // ============================================================

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // ============================================================
  // PASSWORD STATE
  // ============================================================

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // ============================================================
  // PROFILE FETCH
  // ============================================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axiosInstance.get(
        "/api/compliance/compliance-profile"
      );

      if (!data?.success) {
        throw new Error(
          data?.message || "Failed to fetch profile"
        );
      }

      setProfile(data.user || null);
      setOrganization(data.organization || null);

      setFormData({
        name: data.user?.name || "",
        email: data.user?.email || "",
        phone: data.user?.phone || "",
      });
    } catch (err) {
      console.error("Get compliance profile error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchProfile();
  }, []);

  // ============================================================
  // FORM HANDLERS
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // START EDITING
  // ============================================================

  const handleEdit = () => {
    setFormData({
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
    });

    setEditing(true);
  };

  // ============================================================
  // CANCEL EDITING
  // ============================================================

  const handleCancelEdit = () => {
    setFormData({
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
    });

    setEditing(false);
  };

  // ============================================================
  // UPDATE PROFILE
  // ============================================================

  const handleSaveProfile = async () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!name) {
      alert("Name is required.");
      return;
    }

    if (!email) {
      alert("Email is required.");
      return;
    }

    try {
      setSaving(true);

      const { data } = await axiosInstance.put("/api/compliance/compliance-profile", {
        name,
        email,
        phone,
      });

      if (!data?.success) {
        throw new Error(
          data?.message || "Failed to update profile"
        );
      }

      setProfile((prev) => ({
        ...prev,
        ...data.user,
      }));

      setFormData({
        name: data.user?.name || name,
        email: data.user?.email || email,
        phone: data.user?.phone || phone,
      });

      setEditing(false);

      alert(
        data.message || "Profile updated successfully."
      );
    } catch (err) {
      console.error("Update profile error:", err);

      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // CHANGE PASSWORD
  // ============================================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    const {
      oldPassword,
      newPassword,
      confirmPassword,
    } = passwordData;

    if (!oldPassword) {
      setPasswordError("Current password is required.");
      return;
    }

    if (!newPassword) {
      setPasswordError("New password is required.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirmation password do not match."
      );
      return;
    }

    if (oldPassword === newPassword) {
      setPasswordError(
        "New password must be different from the current password."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const { data } = await axiosInstance.put(
        "/api/compliance/change-password",
        {
          oldPassword,
          newPassword,
          confirmPassword,
        }
      );

      if (!data?.success) {
        throw new Error(
          data?.message || "Failed to change password"
        );
      }

      setPasswordMessage(
        data.message || "Password changed successfully."
      );

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err) {
      console.error("Change password error:", err);

      setPasswordError(
        err.response?.data?.message ||
          err.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // ============================================================
  // DATE FORMATTERS
  // ============================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-11 h-11 border-4 border-gray-200 border-t-[#1f6feb] rounded-full animate-spin" />

          <p className="text-sm text-gray-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR SCREEN
  // ============================================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle
              size={28}
              className="text-red-500"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            Unable to load profile
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <button
            onClick={fetchProfile}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1f6feb] text-white text-sm font-medium hover:bg-[#155dcc] transition"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN PROFILE PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-[#f7f9fc] px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">

        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

        <div className="mb-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                My Profile
              </h1>

              <p className="mt-1 text-gray-500">
                Manage your Compliance Officer account and
                security settings.
              </p>
            </div>

            {!editing ? (
              <button
                onClick={handleEdit}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1f6feb] text-white text-sm font-medium hover:bg-[#155dcc] transition shadow-sm"
              >
                <Edit3 size={17} />
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                >
                  <X size={17} />
                  Cancel
                </button>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1f6feb] text-white text-sm font-medium hover:bg-[#155dcc] transition disabled:opacity-60"
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================
            CONTENT
        ====================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ====================================================
              PROFILE SUMMARY
          ==================================================== */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">

            <div className="flex flex-col items-center text-center">

              {/* AVATAR */}

              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1f6feb] to-[#4f8df7] flex items-center justify-center text-white text-3xl font-bold shadow-md">
                {profile?.name
                  ? profile.name
                      .charAt(0)
                      .toUpperCase()
                  : "C"}
              </div>

              {/* NAME */}

              <h2 className="mt-5 text-xl font-bold text-gray-900">
                {profile?.name || "Compliance Officer"}
              </h2>

              {/* EMAIL */}

              <p className="mt-1 text-sm text-gray-500 break-all">
                {profile?.email || "No email available"}
              </p>

              {/* ROLE */}

              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-[#1f6feb] text-xs font-semibold">
                <ShieldCheck size={14} />
                Compliance Officer
              </div>

              <div className="w-full border-t border-gray-100 my-6" />

              {/* SUMMARY DETAILS */}

              <div className="w-full space-y-4 text-left">

                <SummaryItem
                  icon={<Mail size={17} />}
                  label="Email"
                  value={profile?.email}
                />

                <SummaryItem
                  icon={<Phone size={17} />}
                  label="Phone"
                  value={profile?.phone}
                />

                <SummaryItem
                  icon={<CalendarDays size={17} />}
                  label="Joined"
                  value={formatDate(profile?.createdAt)}
                />

                <SummaryItem
                  icon={<Clock size={17} />}
                  label="Last Login"
                  value={formatDateTime(
                    profile?.lastLoginAt
                  )}
                />

              </div>
            </div>
          </div>

          {/* ====================================================
              RIGHT CONTENT
          ==================================================== */}

          <div className="lg:col-span-2 space-y-6">

            {/* ==================================================
                PERSONAL INFORMATION
            ================================================== */}

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <SectionHeader
                icon={<User size={19} />}
                iconClass="bg-blue-50 text-[#1f6feb]"
                title="Personal Information"
                description="Your account information"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* NAME */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>

                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#1f6feb] focus:ring-2 focus:ring-blue-50 transition"
                    />
                  ) : (
                    <ReadOnlyValue
                      value={profile?.name}
                    />
                  )}
                </div>

                {/* EMAIL */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>

                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#1f6feb] focus:ring-2 focus:ring-blue-50 transition"
                    />
                  ) : (
                    <ReadOnlyValue
                      value={profile?.email}
                    />
                  )}
                </div>

                {/* PHONE */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>

                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#1f6feb] focus:ring-2 focus:ring-blue-50 transition"
                    />
                  ) : (
                    <ReadOnlyValue
                      value={profile?.phone}
                    />
                  )}
                </div>

                {/* ROLE */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>

                  <ReadOnlyValue value="Compliance Officer" />
                </div>
              </div>
            </section>

            {/* ==================================================
                ORGANIZATION INFORMATION
            ================================================== */}

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <SectionHeader
                icon={<Building2 size={19} />}
                iconClass="bg-indigo-50 text-indigo-600"
                title="Organization Information"
                description="Company and organization details"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <InfoField
                  icon={<Building2 size={16} />}
                  label="Organization"
                  value={organization?.name}
                />

                <InfoField
                  icon={<BriefcaseBusiness size={16} />}
                  label="Industry"
                  value={organization?.industry}
                />

                <InfoField
                  icon={<BriefcaseBusiness size={16} />}
                  label="Company Size"
                  value={organization?.companySize}
                />

                <InfoField
                  icon={<Globe size={16} />}
                  label="Website"
                  value={organization?.website}
                />

                <InfoField
                  icon={<MapPin size={16} />}
                  label="Location"
                  value={[
                    organization?.city,
                    organization?.state,
                    organization?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                />

                <InfoField
                  icon={<Mail size={16} />}
                  label="Official Email"
                  value={organization?.officialEmail}
                />

                <InfoField
                  icon={<Phone size={16} />}
                  label="Organization Phone"
                  value={organization?.phone}
                />
              </div>

              {/* ORGANIZATION ID */}

              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization ID
                </label>

                <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-600 font-mono break-all">
                  {organization?.id ||
                    profile?.organizationId ||
                    "Not available"}
                </div>
              </div>
            </section>

            {/* ==================================================
                ACCOUNT INFORMATION
            ================================================== */}

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <SectionHeader
                icon={<CheckCircle2 size={19} />}
                iconClass="bg-green-50 text-green-600"
                title="Account Information"
                description="Account status and activity"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <InfoField
                  icon={<CheckCircle2 size={16} />}
                  label="Account Status"
                  value={
                    profile?.isActive
                      ? "Active"
                      : "Inactive"
                  }
                  valueClass={
                    profile?.isActive
                      ? "text-green-600"
                      : "text-red-600"
                  }
                />

                <InfoField
                  icon={<Mail size={16} />}
                  label="Email Verification"
                  value={
                    profile?.isEmailVerified
                      ? "Verified"
                      : "Not Verified"
                  }
                  valueClass={
                    profile?.isEmailVerified
                      ? "text-green-600"
                      : "text-orange-600"
                  }
                />

                <InfoField
                  icon={<CalendarDays size={16} />}
                  label="Account Created"
                  value={formatDate(
                    profile?.createdAt
                  )}
                />

                <InfoField
                  icon={<Clock size={16} />}
                  label="Last Login"
                  value={formatDateTime(
                    profile?.lastLoginAt
                  )}
                />

              </div>
            </section>

            {/* ==================================================
                CHANGE PASSWORD
            ================================================== */}

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <SectionHeader
                icon={<Lock size={19} />}
                iconClass="bg-orange-50 text-orange-600"
                title="Change Password"
                description="Keep your account secure with a strong password"
              />

              <form
                onSubmit={handleChangePassword}
                className="space-y-5"
              >

                {/* CURRENT PASSWORD */}

                <PasswordInput
                  label="Current Password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  show={showOldPassword}
                  setShow={setShowOldPassword}
                />

                {/* NEW PASSWORD */}

                <PasswordInput
                  label="New Password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  show={showNewPassword}
                  setShow={setShowNewPassword}
                />

                {/* CONFIRM PASSWORD */}

                <PasswordInput
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  show={showConfirmPassword}
                  setShow={setShowConfirmPassword}
                />

                {/* ERROR */}

                {passwordError && (
                  <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                    <AlertCircle
                      size={18}
                      className="mt-0.5 shrink-0"
                    />

                    <span>{passwordError}</span>
                  </div>
                )}

                {/* SUCCESS */}

                {passwordMessage && (
                  <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-600">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0"
                    />

                    <span>{passwordMessage}</span>
                  </div>
                )}

                {/* PASSWORD BUTTON */}

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Lock size={16} />

                    {changingPassword
                      ? "Changing..."
                      : "Change Password"}
                  </button>
                </div>
              </form>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SECTION HEADER
// ============================================================

const SectionHeader = ({
  icon,
  iconClass,
  title,
  description,
}) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClass}`}
      >
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-gray-900">
          {title}
        </h3>

        <p className="text-xs text-gray-500 mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
};

// ============================================================
// SUMMARY ITEM
// ============================================================

const SummaryItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-400">
          {label}
        </p>

        <p className="text-sm text-gray-700 truncate">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
};

// ============================================================
// READ ONLY VALUE
// ============================================================

const ReadOnlyValue = ({ value }) => {
  return (
    <div className="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-700 min-h-[42px] flex items-center">
      {value || "Not provided"}
    </div>
  );
};

// ============================================================
// INFORMATION FIELD
// ============================================================

const InfoField = ({
  icon,
  label,
  value,
  valueClass = "text-gray-700",
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm min-h-[42px] ${valueClass}`}
      >
        <span className="text-gray-400 shrink-0">
          {icon}
        </span>

        <span className="truncate">
          {value || "Not provided"}
        </span>
      </div>
    </div>
  );
};

// ============================================================
// PASSWORD INPUT
// ============================================================

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  show,
  setShow,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          autoComplete="new-password"
          className="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#1f6feb] focus:ring-2 focus:ring-blue-50 transition"
        />

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          aria-label={
            show ? "Hide password" : "Show password"
          }
        >
          {show ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
    </div>
  );
};

export default Profile;