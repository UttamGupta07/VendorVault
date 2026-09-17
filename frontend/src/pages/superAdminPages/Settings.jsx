import { useEffect, useState } from "react";

import {
    User,
    Building2,
    Palette,
    Lock,
    Moon,
    Sun,
    ChevronRight,
    X,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

const Settings = () => {
    // =========================
    // THEME STATE
    // =========================

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(null);
    const [organization, setOrganization] = useState(null);

    // =========================
    // CHANGE PASSWORD STATES
    // =========================

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");



    // Profile edit states
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileName, setProfileName] = useState("");
    const [profileEmail, setProfileEmail] = useState("");
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState("");
    const [profileMessage, setProfileMessage] = useState("");

    // Organization edit states
    const [showOrganizationModal, setShowOrganizationModal] = useState(false);
    const [organizationLoading, setOrganizationLoading] = useState(false);
    const [organizationError, setOrganizationError] = useState("");
    const [organizationMessage, setOrganizationMessage] = useState("");

    const [organizationForm, setOrganizationForm] = useState({
        name: "",
        officialEmail: "",
        phone: "",
        industry: "",
        companySize: "",
        country: "",
        state: "",
        city: "",
        website: "",
    });

    // =========================
    // LOAD SETTINGS DATA
    // =========================

    useEffect(() => {
        fetchSettingsData();
    }, []);

    // =========================
    // APPLY THEME
    // =========================

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);

        localStorage.setItem(
            "theme",
            darkMode ? "dark" : "light"
        );
    }, [darkMode]);

    // =========================
    // FETCH USER + ORGANIZATION
    // =========================

    const fetchSettingsData = async () => {
        try {
            const response = await axiosInstance.get("/api/auth/me");

            if (response.data.success) {
                setUser(response.data.user);
                setOrganization(response.data.organization);
            }
        } catch (error) {
            console.error("Failed to load settings data:", error);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // TOGGLE DARK MODE
    // =========================


    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };


    // Open profile edit modal
    const openProfileModal = () => {
        setProfileName(user?.name || "");
        setProfileEmail(user?.email || "");
        setProfileError("");
        setProfileMessage("");
        setShowProfileModal(true);
    };

    // Close profile edit modal
    const closeProfileModal = () => {
        if (profileLoading) return;

        setShowProfileModal(false);
        setProfileError("");
        setProfileMessage("");
    };

    // Update profile
    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        setProfileError("");
        setProfileMessage("");

        if (!profileName.trim() || !profileEmail.trim()) {
            setProfileError("Name and email are required.");
            return;
        }

        try {
            setProfileLoading(true);

            const response = await axiosInstance.put("/api/auth/profile", {
                name: profileName,
                email: profileEmail,
            });

            if (response.data.success) {
                setUser(response.data.user);
                setProfileMessage("Profile updated successfully.");

                setTimeout(() => {
                    setShowProfileModal(false);
                    setProfileMessage("");
                }, 1000);
            }
        } catch (error) {
            setProfileError(
                error.response?.data?.message ||
                "Failed to update profile."
            );
        } finally {
            setProfileLoading(false);
        }
    };

    // Open organization edit modal
    const openOrganizationModal = () => {
        setOrganizationForm({
            name: organization?.name || "",
            officialEmail: organization?.officialEmail || "",
            phone: organization?.phone || "",
            industry: organization?.industry || "",
            companySize: organization?.companySize || "",
            country: organization?.country || "",
            state: organization?.state || "",
            city: organization?.city || "",
            website: organization?.website || "",
        });

        setOrganizationError("");
        setOrganizationMessage("");
        setShowOrganizationModal(true);
    };

    // Close organization edit modal
    const closeOrganizationModal = () => {
        if (organizationLoading) return;

        setShowOrganizationModal(false);
        setOrganizationError("");
        setOrganizationMessage("");
    };

    // Handle organization form changes
    const handleOrganizationChange = (e) => {
        const { name, value } = e.target;

        setOrganizationForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Update organization
    const handleOrganizationUpdate = async (e) => {
        e.preventDefault();

        setOrganizationError("");
        setOrganizationMessage("");

        try {
            setOrganizationLoading(true);

            const response = await axiosInstance.put(
                "/api/auth/organization",
                organizationForm
            );

            if (response.data.success) {
                setOrganization(response.data.organization);
                setOrganizationMessage(
                    "Organization updated successfully."
                );

                setTimeout(() => {
                    setShowOrganizationModal(false);
                    setOrganizationMessage("");
                }, 1000);
            }
        } catch (error) {
            setOrganizationError(
                error.response?.data?.message ||
                "Failed to update organization."
            );
        } finally {
            setOrganizationLoading(false);
        }
    };

    // =========================
    // OPEN CHANGE PASSWORD
    // =========================

    const openPasswordModal = () => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordMessage("");
        setPasswordError("");
        setShowPasswordModal(true);
    };

    // =========================
    // CLOSE CHANGE PASSWORD
    // =========================

    const closePasswordModal = () => {
        if (passwordLoading) return;

        setShowPasswordModal(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordMessage("");
        setPasswordError("");
    };

    // =========================
    // CHANGE PASSWORD API
    // =========================

    const handleChangePassword = async (e) => {
        e.preventDefault();

        setPasswordMessage("");
        setPasswordError("");

        if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordError("Please fill all password fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError(
                "New password and confirm password do not match."
            );
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError(
                "New password must be at least 6 characters."
            );
            return;
        }

        if (oldPassword === newPassword) {
            setPasswordError(
                "New password must be different from current password."
            );
            return;
        }

        try {
            setPasswordLoading(true);

            const response = await axiosInstance.put(
                "/api/auth/change-password",
                {
                    oldPassword,
                    newPassword,
                }
            );

            if (response.data.success) {
                setPasswordMessage(
                    "Password changed successfully."
                );

                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");

                setTimeout(() => {
                    setShowPasswordModal(false);
                    setPasswordMessage("");
                }, 1200);
            }
        } catch (error) {
            setPasswordError(
                error.response?.data?.message ||
                "Failed to change password."
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    // =========================
    // LOADING SCREEN
    // =========================

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-gray-950">
                <p className="text-sm text-slate-500 dark:text-gray-400">
                    Loading settings...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 transition-colors duration-200 dark:bg-gray-950">
            <div className="mx-auto max-w-5xl">

                {/* ================= PAGE HEADER ================= */}

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                        Settings
                    </h1>

                    <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                        Manage your account and application preferences
                    </p>
                </div>

                <div className="space-y-5">

                    {/* ================= PROFILE DETAILS ================= */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">

                        <div className="mb-5 flex items-center gap-3">

                            <div className="rounded-xl bg-indigo-50 p-3 dark:bg-indigo-950/50">
                                <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>

                            <div>
                                <h2 className="font-semibold text-slate-800 dark:text-white">
                                    Profile Details
                                </h2>

                                <p className="text-sm text-slate-500 dark:text-gray-400">
                                    Manage your personal information
                                </p>
                            </div>

                        </div>

                        <div className="grid gap-4 md:grid-cols-2">

                            {/* Name */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-gray-300">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    value={user?.name || ""}
                                    readOnly
                                    className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    text-slate-800
                    outline-none
                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-gray-100
                  "
                                />
                            </div>

                            {/* Email */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-gray-300">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    readOnly
                                    className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    text-slate-800
                    outline-none
                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-gray-100
                  "
                                />
                            </div>

                            {/* Role */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-gray-300">
                                    Role
                                </label>

                                <input
                                    type="text"
                                    value={
                                        user?.role?.replace(/_/g, " ") || ""
                                    }
                                    readOnly
                                    className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    text-slate-800
                    outline-none
                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-gray-100
                  "
                                />
                            </div>

                            {/* Status */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-gray-300">
                                    Status
                                </label>

                                <div className="flex h-[46px] items-center">

                                    <span
                                        className={`rounded-full px-3 py-1.5 text-sm font-medium ${user?.isActive
                                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                                            : "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                                            }`}
                                    >
                                        {user?.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </span>

                                </div>
                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={openProfileModal}
                            className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                        >
                            Edit Profile
                            <ChevronRight className="h-4 w-4" />
                        </button>

                    </div>

                    {/* ================= ORGANIZATION DETAILS ================= */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">

                        <div className="mb-5 flex items-center gap-3">

                            <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-950/50">
                                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>

                            <div>
                                <h2 className="font-semibold text-slate-800 dark:text-white">
                                    Organization Details
                                </h2>

                                <p className="text-sm text-slate-500 dark:text-gray-400">
                                    Manage your organization information
                                </p>
                            </div>

                        </div>

                        <div className="grid gap-4 md:grid-cols-2">

                            {/* Organization Name */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-gray-300">
                                    Organization Name
                                </label>

                                <input
                                    type="text"
                                    value={organization?.name || ""}
                                    readOnly
                                    className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    text-slate-800
                    outline-none
                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-gray-100
                  "
                                />
                            </div>

                            {/* Organization ID */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-gray-300">
                                    Organization ID
                                </label>

                                <input
                                    type="text"
                                    value={organization?.id || ""}
                                    readOnly
                                    className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    text-slate-800
                    outline-none
                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-gray-100
                  "
                                />
                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={openOrganizationModal}
                            className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Edit Organization
                            <ChevronRight className="h-4 w-4" />
                        </button>

                    </div>

                    {/* ================= APPEARANCE ================= */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">

                        <div className="flex items-center justify-between gap-4">

                            <div className="flex items-center gap-3">

                                <div className="rounded-xl bg-purple-50 p-3 dark:bg-purple-950/50">
                                    <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-slate-800 dark:text-white">
                                        Appearance
                                    </h2>

                                    <p className="text-sm text-slate-500 dark:text-gray-400">
                                        Choose your preferred theme
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={toggleDarkMode}
                                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-100
                  dark:border-gray-700
                  dark:text-gray-200
                  dark:hover:bg-gray-800
                "
                            >
                                {darkMode ? (
                                    <>
                                        <Sun className="h-4 w-4" />
                                        Light Mode
                                    </>
                                ) : (
                                    <>
                                        <Moon className="h-4 w-4" />
                                        Dark Mode
                                    </>
                                )}
                            </button>

                        </div>

                    </div>

                    {/* ================= SECURITY ================= */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">

                        <div className="flex items-center justify-between gap-4">

                            <div className="flex items-center gap-3">

                                <div className="rounded-xl bg-orange-50 p-3 dark:bg-orange-950/50">
                                    <Lock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-slate-800 dark:text-white">
                                        Security
                                    </h2>

                                    <p className="text-sm text-slate-500 dark:text-gray-400">
                                        Manage your account password
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={openPasswordModal}
                                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-50
                  dark:border-gray-700
                  dark:text-gray-200
                  dark:hover:bg-gray-800
                "
                            >
                                Change Password

                                <ChevronRight className="h-4 w-4" />
                            </button>

                        </div>

                    </div>

                </div>
            </div>


            {/* Edit Profile Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                    Edit Profile
                                </h2>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Update your personal information
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeProfileModal}
                                disabled={profileLoading}
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    value={profileName}
                                    onChange={(e) => setProfileName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={profileEmail}
                                    onChange={(e) => setProfileEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            {profileError && (
                                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                                    {profileError}
                                </p>
                            )}

                            {profileMessage && (
                                <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600">
                                    {profileMessage}
                                </p>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeProfileModal}
                                    disabled={profileLoading}
                                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={profileLoading}
                                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {profileLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Edit Organization Modal */}
            {showOrganizationModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                    Edit Organization
                                </h2>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Update your organization information
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeOrganizationModal}
                                disabled={organizationLoading}
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleOrganizationUpdate}
                            className="grid gap-4 md:grid-cols-2"
                        >
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Organization Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={organizationForm.name}
                                    onChange={handleOrganizationChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Official Email
                                </label>

                                <input
                                    type="email"
                                    name="officialEmail"
                                    value={organizationForm.officialEmail}
                                    onChange={handleOrganizationChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={organizationForm.phone}
                                    onChange={handleOrganizationChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Industry
                                </label>

                                <input
                                    type="text"
                                    name="industry"
                                    value={organizationForm.industry}
                                    onChange={handleOrganizationChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Company Size
                                </label>

                                <select
                                    name="companySize"
                                    value={organizationForm.companySize}
                                    onChange={handleOrganizationChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                >
                                    <option value="">Select company size</option>
                                    <option value="1-10">1-10</option>
                                    <option value="11-50">11-50</option>
                                    <option value="51-200">51-200</option>
                                    <option value="201-500">201-500</option>
                                    <option value="501-1000">501-1000</option>
                                    <option value="1000+">1000+</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Country
                                </label>

                                <input
                                    type="text"
                                    name="country"
                                    value={organizationForm.country}
                                    onChange={handleOrganizationChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                    State
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={organizationForm.state}
                                    onChange={handleOrganizationChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={organizationForm.city}
                                    onChange={handleOrganizationChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Website
                                </label>

                                <input
                                    type="text"
                                    name="website"
                                    value={organizationForm.website}
                                    onChange={handleOrganizationChange}
                                    placeholder="https://example.com"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div className="md:col-span-2">
                                {organizationError && (
                                    <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                                        {organizationError}
                                    </p>
                                )}

                                {organizationMessage && (
                                    <p className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600">
                                        {organizationMessage}
                                    </p>
                                )}

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeOrganizationModal}
                                        disabled={organizationLoading}
                                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={organizationLoading}
                                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {organizationLoading
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* ================= CHANGE PASSWORD MODAL ================= */}

            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl transition-colors duration-200 dark:border dark:border-gray-700 dark:bg-gray-900">

                        {/* Modal Header */}

                        <div className="mb-6 flex items-center justify-between">

                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                    Change Password
                                </h2>

                                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                                    Update your account password
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closePasswordModal}
                                className="
                  rounded-lg
                  p-2
                  text-slate-500
                  transition
                  hover:bg-slate-100
                  dark:text-gray-400
                  dark:hover:bg-gray-800
                "
                            >
                                <X className="h-5 w-5" />
                            </button>

                        </div>

                        <form
                            onSubmit={handleChangePassword}
                            className="space-y-4"
                        >

                            {/* Current Password */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-gray-300">
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) =>
                                        setOldPassword(e.target.value)
                                    }
                                    placeholder="Enter current password"
                                    className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-slate-800
                    outline-none
                    focus:border-indigo-500
                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-gray-100
                    dark:placeholder:text-gray-500
                  "
                                />
                            </div>

                            {/* New Password */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-gray-300">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    placeholder="Enter new password"
                                    className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-slate-800
                    outline-none
                    focus:border-indigo-500
                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-gray-100
                    dark:placeholder:text-gray-500
                  "
                                />
                            </div>

                            {/* Confirm Password */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-gray-300">
                                    Confirm New Password
                                </label>

                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    placeholder="Confirm new password"
                                    className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-slate-800
                    outline-none
                    focus:border-indigo-500
                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-gray-100
                    dark:placeholder:text-gray-500
                  "
                                />
                            </div>

                            {/* Error */}

                            {passwordError && (
                                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
                                    {passwordError}
                                </p>
                            )}

                            {/* Success */}

                            {passwordMessage && (
                                <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    {passwordMessage}
                                </p>
                            )}

                            {/* Buttons */}

                            <div className="flex justify-end gap-3 pt-2">

                                <button
                                    type="button"
                                    onClick={closePasswordModal}
                                    disabled={passwordLoading}
                                    className="
                    rounded-xl
                    border
                    border-slate-200
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-slate-700
                    transition
                    hover:bg-slate-50
                    disabled:opacity-50
                    dark:border-gray-700
                    dark:text-gray-200
                    dark:hover:bg-gray-800
                  "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={passwordLoading}
                                    className="
                    rounded-xl
                    bg-indigo-600
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-indigo-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                                >
                                    {passwordLoading
                                        ? "Changing..."
                                        : "Change Password"}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;