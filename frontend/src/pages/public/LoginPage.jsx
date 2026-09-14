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

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await login(
        formData.email.trim().toLowerCase(),
        formData.password
      );

      console.log("Login response:", data);

      if (data?.success) {
        setSuccessMsg(
          "Login successful! Redirecting to dashboard..."
        );

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
    <div className="min-h-screen bg-[#06142d] text-white relative overflow-hidden">

      {/* ==========================================
          BACKGROUND EFFECTS
      ========================================== */}

      <div className="absolute inset-0 pointer-events-none">

        {/* Blue glow */}
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px]" />

        {/* Purple glow */}
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[120px]" />

        {/* Bottom glow */}
        <div className="absolute -bottom-60 left-1/3 h-[450px] w-[450px] rounded-full bg-indigo-600/10 blur-[120px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* ==========================================
          MAIN
      ========================================== */}

      <div className="relative min-h-screen flex items-center justify-center px-4 py-10 sm:px-6">

        <div className="w-full max-w-[1080px]">

         

          {/* ======================================
              LOGIN LAYOUT
          ====================================== */}

          <div className="grid lg:grid-cols-[1fr_440px] gap-8 lg:gap-14 items-center">

            {/* ====================================
                LEFT BRANDING
            ==================================== */}

            <div className="hidden lg:block">

              {/* Logo */}
              <Link
                to="/"
                className="inline-flex items-center gap-3 group mb-10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-violet-600 to-purple-600 shadow-lg shadow-violet-600/25 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold tracking-tight">
                    Vendor
                    <span className="text-blue-400">
                      Vault
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-md border border-violet-400/20 bg-violet-500/10 px-2 py-1 text-[10px] font-semibold text-violet-300">
                    <Sparkles className="h-3 w-3" />
                    AI
                  </span>
                </div>
              </Link>

              {/* Heading */}

              <div className="max-w-xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-[11px] font-semibold tracking-wider text-blue-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                  SECURE COMPLIANCE PORTAL
                </div>

                <h1 className="text-4xl xl:text-5xl font-bold leading-[1.08] tracking-tight">
                  Welcome back to{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                    VendorVault
                  </span>
                </h1>

                <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
                  Manage vendor documents, monitor compliance,
                  and stay ahead of every expiry — all from
                  one secure platform.
                </p>
              </div>

              {/* Benefits */}

              <div className="mt-9 space-y-4">

                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-400/10">
                    <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  </div>
                  AI-powered document extraction
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-400/10">
                    <CheckCircle2 className="h-4 w-4 text-violet-400" />
                  </div>
                  Automated expiry monitoring
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-400/10">
                    <CheckCircle2 className="h-4 w-4 text-purple-400" />
                  </div>
                  Complete compliance visibility
                </div>

              </div>

              {/* Security note */}

              <div className="mt-10 flex items-center gap-3 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Your session is protected with secure authentication
              </div>

            </div>

            {/* ====================================
                LOGIN CARD
            ==================================== */}

            <div>

              {/* Mobile Logo */}

              <div className="lg:hidden text-center mb-7">

                <Link
                  to="/"
                  className="inline-flex items-center gap-2.5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-violet-600 to-purple-600 shadow-lg shadow-violet-600/20">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xl">
                      Vendor
                      <span className="text-blue-400">
                        Vault
                      </span>
                    </span>

                    <span className="inline-flex items-center gap-0.5 rounded-md bg-violet-500/10 border border-violet-400/20 px-1.5 py-0.5 text-[9px] font-semibold text-violet-300">
                      <Sparkles className="h-2.5 w-2.5" />
                      AI
                    </span>
                  </div>
                </Link>

              </div>

              {/* Card */}

              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 sm:p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">

                {/* Header */}

                <div className="mb-7">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 shadow-lg shadow-blue-600/20 mb-4">
                    <Lock className="h-5 w-5 text-white" />
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight">
                    Sign in
                  </h2>

                  <p className="mt-1.5 text-sm text-slate-400">
                    Access your VendorVault account
                  </p>

                </div>

                {/* ==================================
                    ERROR
                ================================== */}

                {error && (
                  <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-300">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* ==================================
                    SUCCESS
                ================================== */}

                {successMsg && (
                  <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* ==================================
                    FORM
                ================================== */}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  {/* Email */}

                  <div>

                    <label className="block mb-2 text-xs font-medium text-slate-300">
                      Work Email Address
                    </label>

                    <div className="relative">

                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        required
                        className="w-full rounded-xl border border-white/10 bg-[#081a36]/80 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-blue-500/60 focus:bg-[#0a1d3b] focus:ring-2 focus:ring-blue-500/10"
                      />

                    </div>

                  </div>

                  {/* Password */}

                  <div>

                    <div className="flex items-center justify-between mb-2">

                      <label className="block text-xs font-medium text-slate-300">
                        Password
                      </label>

                      <Link
                        to="/forgot-password"
                        className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Forgot password?
                      </Link>

                    </div>

                    <div className="relative">

                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

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
                        className="w-full rounded-xl border border-white/10 bg-[#081a36]/80 py-3 pl-10 pr-11 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-blue-500/60 focus:bg-[#0a1d3b] focus:ring-2 focus:ring-blue-500/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
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

                  {/* Remember */}

                  <div className="flex items-center">

                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-white/20 bg-[#081a36] text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                    />

                    <label
                      htmlFor="rememberMe"
                      className="ml-2 cursor-pointer text-xs text-slate-400"
                    >
                      Remember me on this device
                    </label>

                  </div>

                  {/* Submit */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all hover:-translate-y-0.5 hover:shadow-violet-600/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    <span className="relative flex items-center justify-center gap-2">

                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}

                    </span>

                  </button>

                </form>

                {/* ==================================
                    QUICK LOGIN
                ================================== */}

                <div className="mt-7 border-t border-white/10 pt-6">

                  <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">

                    <UserCheck className="h-3.5 w-3.5 text-violet-400" />

                    <span>Demo Accounts</span>

                  </div>

                  <div className="grid grid-cols-2 gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        handleQuickLogin(
                          "admin@vendorvault.io"
                        )
                      }
                      className="rounded-lg border border-white/10 bg-white/[0.025] px-3 py-2 text-left text-[11px] font-medium text-slate-400 transition-all hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
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
                      className="rounded-lg border border-white/10 bg-white/[0.025] px-3 py-2 text-left text-[11px] font-medium text-slate-400 transition-all hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
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
                      className="rounded-lg border border-white/10 bg-white/[0.025] px-3 py-2 text-left text-[11px] font-medium text-slate-400 transition-all hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
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
                      className="rounded-lg border border-white/10 bg-white/[0.025] px-3 py-2 text-left text-[11px] font-medium text-slate-400 transition-all hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
                    >
                      📋 Auditor
                    </button>

                  </div>

                </div>

                {/* ==================================
                    REGISTER
                ================================== */}

                <div className="mt-6 border-t border-white/10 pt-5 text-center text-xs text-slate-500">

                  Don't have an organization account yet?{" "}

                  <Link
                    to="/register"
                    className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Register Organization
                  </Link>

                </div>

              </div>

              {/* Footer */}

              <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-600">

                <ShieldCheck className="h-3.5 w-3.5" />

                Secure vendor compliance management

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}