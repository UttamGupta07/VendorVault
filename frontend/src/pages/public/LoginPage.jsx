 import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) {
      setError("");
    }
  };

  // ==========================================
  // QUICK ROLE LOGIN
  // ==========================================

  const handleQuickLogin = (roleEmail) => {
    setFormData({
      email: roleEmail,
      password: "Password@123",
      rememberMe: true,
    });

    setError("");
    setSuccessMsg("");
  };

  // ==========================================
  // REDIRECT USER BASED ON ROLE
  // ==========================================

  const redirectUser = (user) => {
    if (!user?.role) {
      navigate("/", { replace: true });
      return;
    }

    switch (user.role) {
      case "SUPER_ADMIN":
        navigate("/super-admin/dashboard", {
          replace: true,
        });
        break;

      case "AUDITOR":
        navigate("/auditor/dashboard", {
          replace: true,
        });
        break;

      case "COMPLIANCE_OFFICER":
        navigate("/compliance/dashboard", {
          replace: true,
        });
        break;

      case "VENDOR":
        navigate("/vendor/dashboard", {
          replace: true,
        });
        break;

      default:
        navigate("/", { replace: true });
    }
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMsg("");

    // Validation
    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // AuthContext handles the API request,
      // JWT cookie and user state.
      const data = await login(
        formData.email.trim().toLowerCase(),
        formData.password
      );

      console.log("Login response:", data);

      if (data?.success) {
        setSuccessMsg(
          "Login successful! Redirecting to dashboard..."
        );

        /*
         * login() returns the backend response and also
         * updates AuthContext's user state.
         *
         * We use the returned user here because React
         * state updates are asynchronous.
         */
        const loggedInUser = data.user;

        setTimeout(() => {
          redirectUser(loggedInUser);
        }, 700);
      } else {
        setError(
          data?.message ||
            "Unable to login. Please try again."
        );
      }
    } catch (err) {
      console.error("Login error:", err);

      const message =
        err.response?.data?.message ||
        "Invalid email or password. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 transition-colors">

      <div className="w-full max-w-md">

        {/* ==========================================
            BRAND HEADER
        ========================================== */}

        <div className="text-center mb-8">

          <Link
            to="/"
            className="inline-flex items-center gap-2.5 group"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">

              <ShieldCheck className="h-6 w-6" />

            </div>

            <div className="flex items-center gap-1.5">

              <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">

                Vendor
                <span className="text-indigo-600 dark:text-indigo-400">
                  Vault
                </span>

              </span>

              <span className="inline-flex items-center gap-0.5 rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/20 dark:bg-indigo-950/50 dark:text-indigo-300">

                <Sparkles className="h-2.5 w-2.5" />

                AI

              </span>

            </div>

          </Link>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Welcome Back
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your compliance portal
          </p>

        </div>

        {/* ==========================================
            LOGIN CARD
        ========================================== */}

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">

          {/* ========================================
              ERROR ALERT
          ======================================== */}

          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 animate-in fade-in duration-200">

              <AlertCircle className="h-4 w-4 flex-shrink-0" />

              <span>{error}</span>

            </div>
          )}

          {/* ========================================
              SUCCESS ALERT
          ======================================== */}

          {successMsg && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 animate-in fade-in duration-200">

              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />

              <span>{successMsg}</span>

            </div>
          )}

          {/* ========================================
              FORM
          ======================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* ======================================
                EMAIL
            ====================================== */}

            <div>

              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Work Email Address
              </label>

              <div className="relative">

                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">

                  <Mail className="h-4 w-4" />

                </div>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

              </div>

            </div>

            {/* ======================================
                PASSWORD
            ====================================== */}

            <div>

              <div className="flex items-center justify-between mb-1">

                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-[11px] font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  Forgot password?
                </Link>

              </div>

              <div className="relative">

                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">

                  <Lock className="h-4 w-4" />

                </div>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-10 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Toggle password visibility"
                >

                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}

                </button>

              </div>

            </div>

            {/* ======================================
                REMEMBER ME
            ====================================== */}

            <div className="flex items-center">

              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
              />

              <label
                htmlFor="rememberMe"
                className="ml-2 block text-xs text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                Remember me on this device
              </label>

            </div>

            {/* ======================================
                SUBMIT BUTTON
            ====================================== */}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-500 disabled:opacity-60 transition-all"
            >

              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}

            </button>

          </form>

          {/* ==========================================
              QUICK ROLE FILLERS
          ========================================== */}

          <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">

            <div className="flex items-center gap-1.5 mb-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">

              <UserCheck className="h-3.5 w-3.5 text-indigo-500" />

              <span>
                Quick Test Logins (Demo):
              </span>

            </div>

            <div className="grid grid-cols-2 gap-1.5">

              <button
                type="button"
                onClick={() =>
                  handleQuickLogin(
                    "admin@vendorvault.io"
                  )
                }
                className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-[10px] font-medium text-slate-700 hover:text-indigo-600 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors text-left truncate"
              >
                👑 Super Admin
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickLogin(
                    "compliance@vendorvault.io"
                  )
                }
                className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-[10px] font-medium text-slate-700 hover:text-indigo-600 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors text-left truncate"
              >
                🛡️ Compliance Officer
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickLogin(
                    "vendor@apexlogistics.com"
                  )
                }
                className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-[10px] font-medium text-slate-700 hover:text-indigo-600 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors text-left truncate"
              >
                🚚 Vendor Portal
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickLogin(
                    "auditor@deloitte.com"
                  )
                }
                className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-[10px] font-medium text-slate-700 hover:text-indigo-600 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors text-left truncate"
              >
                📋 Auditor (Read-Only)
              </button>

            </div>

          </div>

          {/* ==========================================
              REGISTRATION
          ========================================== */}

          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">

            Don't have an organization account yet?{" "}

            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Register Organization
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}