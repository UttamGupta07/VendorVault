import { useState } from "react";
import {
  User,
  Building2,
  Palette,
  Lock,
  Moon,
  Sun,
  ChevronRight,
} from "lucide-react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your account and application preferences
          </p>
        </div>

        <div className="space-y-5">
          {/* Profile Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-3">
                <User className="h-5 w-5 text-indigo-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-800">
                  Profile Details
                </h2>
                <p className="text-sm text-slate-500">
                  Manage your personal information
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Name
                </label>
                <input
                  type="text"
                  value="Super Admin"
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Email
                </label>
                <input
                  type="email"
                  value="admin@example.com"
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Role
                </label>
                <input
                  type="text"
                  value="Super Admin"
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Status
                </label>
                <div className="flex h-[46px] items-center">
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-600">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <button className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700">
              Edit Profile
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Organization Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-800">
                  Organization Details
                </h2>
                <p className="text-sm text-slate-500">
                  Manage your organization information
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Organization Name
                </label>
                <input
                  type="text"
                  value="Your Organization"
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Organization ID
                </label>
                <input
                  type="text"
                  value="ORG-001"
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <button className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
              Edit Organization
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Appearance */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-3">
                  <Palette className="h-5 w-5 text-purple-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-800">Appearance</h2>
                  <p className="text-sm text-slate-500">
                    Choose your preferred theme
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
              >
                {darkMode ? (
                  <>
                    <Moon className="h-4 w-4" />
                    Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4" />
                    Light Mode
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Security */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-orange-50 p-3">
                  <Lock className="h-5 w-5 text-orange-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-800">Security</h2>
                  <p className="text-sm text-slate-500">
                    Manage your account password
                  </p>
                </div>
              </div>

              <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Change Password
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;