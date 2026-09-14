 import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ShieldCheck,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Briefcase,
  Users,
} from "lucide-react";

const INDUSTRIES = [
  "Logistics & Supply Chain",
  "Manufacturing & Industrial",
  "Information Technology & SaaS",
  "Healthcare & Pharmaceuticals",
  "Construction & Real Estate",
  "Financial Services & Banking",
  "Retail & E-commerce",
  "Energy & Utilities",
  "Other",
];

// IMPORTANT:
// value = exact value expected by MongoDB enum
// label = value shown to the user
const COMPANY_SIZES = [
  {
    value: "1-10",
    label: "1-10 employees",
  },
  {
    value: "11-50",
    label: "11-50 employees",
  },
  {
    value: "51-200",
    label: "51-200 employees",
  },
  {
    value: "201-500",
    label: "201-500 employees",
  },
  {
    value: "501-1000",
    label: "501-1000 employees",
  },
  {
    value: "1000+",
    label: "1000+ employees",
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();

  // =====================================================
  // AUTH CONTEXT
  // =====================================================

  const { registerOrganization } = useAuth();

  // =====================================================
  // STEP
  // =====================================================

  const [step, setStep] = useState(1);

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    organizationName: "",
    officialEmail: "",
    phone: "",
    industry: "",
    companySize: "",
    country: "India",
    state: "",
    city: "",
    website: "",
    adminName: "",
    adminEmail: "",
    password: "",
    confirmPassword: "",
  });

  // =====================================================
  // UI STATES
  // =====================================================

  const [showPassword, setShowPassword] = useState(false);
  const [useOfficialForAdmin, setUseOfficialForAdmin] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (successMsg) {
      setSuccessMsg("");
    }
  };

  // =====================================================
  // USE OFFICIAL EMAIL FOR ADMIN
  // =====================================================

  const handleUseOfficialToggle = (e) => {
    const checked = e.target.checked;

    setUseOfficialForAdmin(checked);

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        adminEmail: prev.officialEmail,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        adminEmail: "",
      }));
    }
  };

  // =====================================================
  // STEP 1 VALIDATION
  // =====================================================

  const handleNextStep = (e) => {
    e.preventDefault();

    setError("");
    setSuccessMsg("");

    const {
      organizationName,
      officialEmail,
      phone,
      industry,
      companySize,
      country,
      state,
      city,
    } = formData;

    if (
      !organizationName.trim() ||
      !officialEmail.trim() ||
      !phone.trim() ||
      !industry ||
      !companySize ||
      !country.trim() ||
      !state.trim() ||
      !city.trim()
    ) {
      setError(
        "Please fill in all required organization fields before proceeding."
      );
      return;
    }

    // Basic email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(officialEmail.trim())) {
      setError("Please enter a valid official email.");
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

    if (!phoneRegex.test(phone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }

    setStep(2);
  };

  // =====================================================
  // BACK TO STEP 1
  // =====================================================

  const handleBack = () => {
    if (loading) return;

    setError("");
    setSuccessMsg("");
    setStep(1);
  };

  // =====================================================
  // FINAL REGISTRATION
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccessMsg("");

    const {
      adminName,
      adminEmail,
      password,
      confirmPassword,
    } = formData;

    // -----------------------------------------------------
    // VALIDATE ADMIN DETAILS
    // -----------------------------------------------------

    if (
      !adminName.trim() ||
      !adminEmail.trim() ||
      !password
    ) {
      setError(
        "Please fill in all super admin details."
      );
      return;
    }

    // -----------------------------------------------------
    // VALIDATE EMAIL
    // -----------------------------------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(adminEmail.trim())) {
      setError("Please enter a valid admin email.");
      return;
    }

    // -----------------------------------------------------
    // VALIDATE PASSWORD
    // -----------------------------------------------------

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    // -----------------------------------------------------
    // CONFIRM PASSWORD
    // -----------------------------------------------------

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // ===================================================
      // PAYLOAD
      // ===================================================

      const payload = {
        organizationName:
          formData.organizationName.trim(),

        officialEmail:
          formData.officialEmail
            .trim()
            .toLowerCase(),

        phone:
          formData.phone.trim(),

        industry:
          formData.industry,

        companySize:
          formData.companySize,

        country:
          formData.country.trim(),

        state:
          formData.state.trim(),

        city:
          formData.city.trim(),

        website:
          formData.website.trim(),

        adminName:
          formData.adminName.trim(),

        adminEmail:
          formData.adminEmail
            .trim()
            .toLowerCase(),

        password:
          formData.password,
      };

      console.log(
        "Registration payload:",
        payload
      );

      // ===================================================
      // REGISTER USING AUTH CONTEXT
      // ===================================================

      const response =
        await registerOrganization(payload);

      console.log(
        "Registration response:",
        response
      );

      // ===================================================
      // SUCCESS
      // ===================================================

      if (response?.success) {
        setSuccessMsg(
          "Organization registered successfully! Redirecting..."
        );

        setTimeout(() => {
          navigate(
            "/super-admin/dashboard",
            {
              replace: true,
            }
          );
        }, 1000);
      } else {
        setError(
          response?.message ||
            "Registration failed. Please try again."
        );
      }
    } catch (err) {
      console.error(
        "Registration failed:",
        err
      );

      // -----------------------------------------------
      // Extract backend error
      // -----------------------------------------------

      const backendData =
        err.response?.data;

      if (
        backendData?.errors &&
        Array.isArray(backendData.errors)
      ) {
        const validationMessages =
          backendData.errors
            .map((item) => {
              if (typeof item === "string") {
                return item;
              }

              return item.message;
            })
            .filter(Boolean);

        if (validationMessages.length > 0) {
          setError(
            validationMessages.join(" ")
          );
        } else {
          setError(
            backendData.message ||
              "Registration failed."
          );
        }
      } else {
        setError(
          backendData?.message ||
            "Registration failed. Please check your inputs and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#06142d] text-white relative overflow-hidden">

      {/* ==================================================
          BACKGROUND EFFECTS
      ================================================== */}

      <div className="absolute inset-0 pointer-events-none">

        {/* Blue glow */}
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px]" />

        {/* Violet glow */}
        <div className="absolute top-1/4 -right-40 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[120px]" />

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

      {/* ==================================================
          MAIN
      ================================================== */}

      <div className="relative min-h-screen flex items-center justify-center px-4 py-8 sm:px-6">

        <div className="w-full max-w-[1120px]">

         

          {/* ==================================================
              MAIN LAYOUT
          ================================================== */}

          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-12 items-start">

            {/* ==================================================
                LEFT BRAND / INFORMATION
            ================================================== */}

            <div className="hidden lg:block pt-4">

              {/* Logo */}

              <Link
                to="/"
                className="inline-flex items-center gap-3 group mb-9"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-violet-600 to-purple-600 shadow-lg shadow-violet-600/25 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="h-6 w-6" />
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

              <div className="max-w-md">

                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-[11px] font-semibold tracking-wider text-violet-300">
                  <Building2 className="h-3.5 w-3.5" />
                  GET STARTED WITH VENDORVAULT
                </div>

                <h1 className="text-4xl xl:text-5xl font-bold leading-[1.08] tracking-tight">

                  Build your{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                    compliance workspace.
                  </span>

                </h1>

                <p className="mt-5 text-base leading-7 text-slate-400">
                  Create your organization, configure your
                  administrator account, and start managing
                  vendor compliance from one secure platform.
                </p>

              </div>

              {/* Benefits */}

              <div className="mt-9 space-y-4">

                <div className="flex items-center gap-3 text-sm text-slate-300">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-400/10 bg-blue-500/10">
                    <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  </div>

                  Centralized vendor document management

                </div>

                <div className="flex items-center gap-3 text-sm text-slate-300">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-400/10 bg-violet-500/10">
                    <CheckCircle2 className="h-4 w-4 text-violet-400" />
                  </div>

                  AI-powered document extraction

                </div>

                <div className="flex items-center gap-3 text-sm text-slate-300">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-400/10 bg-purple-500/10">
                    <CheckCircle2 className="h-4 w-4 text-purple-400" />
                  </div>

                  Automated compliance monitoring

                </div>

              </div>

              {/* Steps preview */}

              <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.035] p-5">

                <p className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Simple setup
                </p>

                <div className="space-y-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-[11px] font-bold">
                      1
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        Organization details
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Company & location information
                      </p>
                    </div>

                  </div>

                  <div className="ml-3.5 h-4 border-l border-dashed border-white/10" />

                  <div className="flex items-center gap-3">

                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-slate-400">
                      2
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-300">
                        Super Admin account
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Configure your administrator
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* ==================================================
                RIGHT REGISTRATION AREA
            ================================================== */}

            <div>

              {/* Mobile Logo */}

              <div className="lg:hidden text-center mb-6">

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

              {/* Page heading */}

              <div className="mb-5 lg:hidden text-center">

                <h1 className="text-2xl font-bold">
                  Register Your Organization
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Set up your organization and Super Admin account
                </p>

              </div>

              {/* ==================================================
                  REGISTRATION CARD
              ================================================== */}

              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 sm:p-7 shadow-2xl shadow-black/30 backdrop-blur-xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-7 hidden lg:block">

                  <h2 className="text-2xl font-bold tracking-tight">
                    Create your organization
                  </h2>

                  <p className="mt-1.5 text-sm text-slate-400">
                    Complete the setup in two simple steps.
                  </p>

                </div>

                {/* ==================================================
                    STEP INDICATOR
                ================================================== */}

                <div className="mb-7">

                  <div className="flex items-center">

                    {/* STEP 1 */}

                    <div className="flex items-center gap-2">

                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                          step >= 1
                            ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-violet-600/20"
                            : "bg-white/10 text-slate-500"
                        }`}
                      >
                        {step > 1 ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          "1"
                        )}
                      </div>

                      <div className="hidden sm:block">

                        <p
                          className={`text-xs font-semibold ${
                            step === 1
                              ? "text-white"
                              : "text-slate-500"
                          }`}
                        >
                          Organization
                        </p>

                        <p className="text-[10px] text-slate-600">
                          Company details
                        </p>

                      </div>

                    </div>

                    {/* CONNECTOR */}

                    <div
                      className={`mx-3 sm:mx-5 h-px flex-1 transition-all ${
                        step === 2
                          ? "bg-gradient-to-r from-blue-600 to-violet-600"
                          : "bg-white/10"
                      }`}
                    />

                    {/* STEP 2 */}

                    <div className="flex items-center gap-2">

                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                          step === 2
                            ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/20"
                            : "bg-white/10 text-slate-500"
                        }`}
                      >
                        2
                      </div>

                      <div className="hidden sm:block">

                        <p
                          className={`text-xs font-semibold ${
                            step === 2
                              ? "text-white"
                              : "text-slate-500"
                          }`}
                        >
                          Super Admin
                        </p>

                        <p className="text-[10px] text-slate-600">
                          Account credentials
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* ==================================================
                    ALERTS
                ================================================== */}

                {error && (
                  <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-300">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* ==================================================
                    STEP 1
                ================================================== */}

                {step === 1 && (
                  <form
                    onSubmit={handleNextStep}
                    className="space-y-4"
                  >

                    {/* Section title */}

                    <div className="mb-5">

                      <div className="flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-400/10">
                          <Building2 className="h-4 w-4 text-blue-400" />
                        </div>

                        <div>

                          <h3 className="text-sm font-semibold text-white">
                            Company & Contact Information
                          </h3>

                          <p className="text-[10px] text-slate-500">
                            Tell us about your organization
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* Organization name */}

                    <div>

                      <label className="block mb-2 text-xs font-medium text-slate-300">
                        Organization Name{" "}
                        <span className="text-rose-400">*</span>
                      </label>

                      <div className="relative">

                        <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                        <input
                          type="text"
                          name="organizationName"
                          value={
                            formData.organizationName
                          }
                          onChange={handleChange}
                          placeholder="Acme Global Enterprises"
                          required
                          className="w-full rounded-xl border border-white/10 bg-[#081a36]/80 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-blue-500/60 focus:bg-[#0a1d3b] focus:ring-2 focus:ring-blue-500/10"
                        />

                      </div>

                    </div>

                    {/* Email + Phone */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* Official Email */}

                      <div>

                        <label className="block mb-2 text-xs font-medium text-slate-300">
                          Official Email{" "}
                          <span className="text-rose-400">*</span>
                        </label>

                        <div className="relative">

                          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                          <input
                            type="email"
                            name="officialEmail"
                            value={
                              formData.officialEmail
                            }
                            onChange={handleChange}
                            placeholder="compliance@acme.com"
                            required
                            className="w-full rounded-xl border border-white/10 bg-[#081a36]/80 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-blue-500/60 focus:bg-[#0a1d3b] focus:ring-2 focus:ring-blue-500/10"
                          />

                        </div>

                      </div>

                      {/* Phone */}

                      <div>

                        <label className="block mb-2 text-xs font-medium text-slate-300">
                          Official Phone{" "}
                          <span className="text-rose-400">*</span>
                        </label>

                        <div className="relative">

                          <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            required
                            className="w-full rounded-xl border border-white/10 bg-[#081a36]/80 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-blue-500/60 focus:bg-[#0a1d3b] focus:ring-2 focus:ring-blue-500/10"
                          />

                        </div>

                      </div>

                    </div>

                    {/* Industry + Company Size */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* Industry */}

                      <div>

                        <label className="block mb-2 text-xs font-medium text-slate-300">
                          Industry{" "}
                          <span className="text-rose-400">*</span>
                        </label>

                        <div className="relative">

                          <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                          <select
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            required
                            className="w-full appearance-none rounded-xl border border-white/10 bg-[#081a36]/80 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-blue-500/60 focus:bg-[#0a1d3b] focus:ring-2 focus:ring-blue-500/10"
                          >

                            <option
                              value=""
                              className="bg-[#081a36]"
                            >
                              Select Industry
                            </option>

                            {INDUSTRIES.map(
                              (industry) => (
                                <option
                                  key={industry}
                                  value={industry}
                                  className="bg-[#081a36]"
                                >
                                  {industry}
                                </option>
                              )
                            )}

                          </select>

                        </div>

                      </div>

                      {/* Company Size */}

                      <div>

                        <label className="block mb-2 text-xs font-medium text-slate-300">
                          Company Size{" "}
                          <span className="text-rose-400">*</span>
                        </label>

                        <div className="relative">

                          <Users className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                          <select
                            name="companySize"
                            value={
                              formData.companySize
                            }
                            onChange={handleChange}
                            required
                            className="w-full appearance-none rounded-xl border border-white/10 bg-[#081a36]/80 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-blue-500/60 focus:bg-[#0a1d3b] focus:ring-2 focus:ring-blue-500/10"
                          >

                            <option
                              value=""
                              className="bg-[#081a36]"
                            >
                              Select Size
                            </option>

                            {COMPANY_SIZES.map(
                              (size) => (
                                <option
                                  key={size.value}
                                  value={size.value}
                                  className="bg-[#081a36]"
                                >
                                  {size.label}
                                </option>
                              )
                            )}

                          </select>

                        </div>

                      </div>

                    </div>

                    {/* Country / State / City */}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                      {/* Country */}

                      <div>

                        <label className="block mb-2 text-xs font-medium text-slate-300">
                          Country{" "}
                          <span className="text-rose-400">*</span>
                        </label>

                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          placeholder="India"
                          required
                          className="w-full rounded-xl border border-white/10 bg-[#081a36]/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-blue-500/60 focus:bg-[#0a1d3b] focus:ring-2 focus:ring-blue-500/10"
                        />

                      </div>

                      {/* State */}

                      <div>

                        <label className="block mb-2 text-xs font-medium text-slate-300">
                          State{" "}
                          <span className="text-rose-400">*</span>
                        </label>

                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Uttar Pradesh"
                          required
                          className="w-full rounded-xl border border-white/10 bg-[#081a36]/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-blue-500/60 focus:bg-[#0a1d3b] focus:ring-2 focus:ring-blue-500/10"
                        />

                      </div>

                      {/* City */}

                      <div>

                        <label className="block mb-2 text-xs font-medium text-slate-300">
                          City{" "}
                          <span className="text-rose-400">*</span>
                        </label>

                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Lucknow"
                          required
                          className="w-full rounded-xl border border-white/10 bg-[#081a36]/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-blue-500/60 focus:bg-[#0a1d3b] focus:ring-2 focus:ring-blue-500/10"
                        />

                      </div>

                    </div>

                    {/* Website */}

                    <div>

                      <label className="block mb-2 text-xs font-medium text-slate-300">

                        Website{" "}

                        <span className="text-slate-600 font-normal">
                          (Optional)
                        </span>

                      </label>

                      <div className="relative">

                        <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="https://acme.com"
                          className="w-full rounded-xl border border-white/10 bg-[#081a36]/80 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-blue-500/60 focus:bg-[#0a1d3b] focus:ring-2 focus:ring-blue-500/10"
                        />

                      </div>

                    </div>

                    {/* Continue */}

                    <div className="pt-3">

                      <button
                        type="submit"
                        className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all hover:-translate-y-0.5 hover:shadow-violet-600/30"
                      >

                        <span>
                          Continue to Admin Setup
                        </span>

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />

                      </button>

                    </div>

                  </form>
                )}

                {/* ==================================================
                    STEP 2
                ================================================== */}

                {step === 2 && (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >

                    {/* Section title */}

                    <div className="mb-5">

                      <div className="flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-400/10">
                          <User className="h-4 w-4 text-violet-400" />
                        </div>

                        <div>

                          <h3 className="text-sm font-semibold text-white">
                            Super Admin Account
                          </h3>

                          <p className="text-[10px] text-slate-500">
                            Configure your primary administrator
                          </p>

                        </div>

                      </div>

                      <p className="mt-4 rounded-xl border border-white/5 bg-white/[0.025] p-3 text-xs leading-5 text-slate-400">
                        This account will have primary
                        administrative control over organization
                        policies, users, and vendor approvals.
                      </p>

                    </div>

                    {/* Admin name */}

                    <div>

                      <label className="block mb-2 text-xs font-medium text-slate-300">
                        Admin Full Name{" "}
                        <span className="text-rose-400">*</span>
                      </label>

                      <div className="relative">

                        <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                        <input
                          type="text"
                          name="adminName"
                          value={formData.adminName}
                          onChange={handleChange}
                          placeholder="Your full name"
                          required
                          className="w-full rounded-xl border border-white/10 bg-[#081a36]/80 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-violet-500/60 focus:bg-[#0a1d3b] focus:ring-2 focus:ring-violet-500/10"
                        />

                      </div>

                    </div>

                    {/* Admin email */}

                    <div>

                      <div className="flex items-center justify-between mb-2">

                        <label className="block text-xs font-medium text-slate-300">

                          Admin Work Email{" "}
                          <span className="text-rose-400">
                            *
                          </span>

                        </label>

                        <label className="flex items-center gap-1.5 text-[10px] text-violet-300 cursor-pointer">

                          <input
                            type="checkbox"
                            checked={
                              useOfficialForAdmin
                            }
                            onChange={
                              handleUseOfficialToggle
                            }
                            className="h-3.5 w-3.5 rounded border-white/20 bg-[#081a36] text-violet-600 focus:ring-violet-500 focus:ring-offset-0"
                          />

                          <span>
                            Same as official email
                          </span>

                        </label>

                      </div>

                      <div className="relative">

                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                        <input
                          type="email"
                          name="adminEmail"
                          value={
                            formData.adminEmail
                          }
                          onChange={handleChange}
                          placeholder="admin@acme.com"
                          required
                          className="w-full rounded-xl border border-white/10 bg-[#081a36]/80 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-violet-500/60 focus:bg-[#0a1d3b] focus:ring-2 focus:ring-violet-500/10"
                        />

                      </div>

                    </div>

                    {/* Passwords */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* Password */}

                      <div>

                        <label className="block mb-2 text-xs font-medium text-slate-300">

                          Password{" "}
                          <span className="text-rose-400">
                            *
                          </span>

                        </label>

                        <div className="relative">

                          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                          <input
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            name="password"
                            value={
                              formData.password
                            }
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            className="w-full rounded-xl border border-white/10 bg-[#081a36]/80 py-3 pl-10 pr-11 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-violet-500/60 focus:bg-[#0a1d3b] focus:ring-2 focus:ring-violet-500/10"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(
                                (prev) => !prev
                              )
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

                      {/* Confirm password */}

                      <div>

                        <label className="block mb-2 text-xs font-medium text-slate-300">

                          Confirm Password{" "}
                          <span className="text-rose-400">
                            *
                          </span>

                        </label>

                        <div className="relative">

                          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                          <input
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            name="confirmPassword"
                            value={
                              formData.confirmPassword
                            }
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            className="w-full rounded-xl border border-white/10 bg-[#081a36]/80 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-violet-500/60 focus:bg-[#0a1d3b] focus:ring-2 focus:ring-violet-500/10"
                          />

                        </div>

                      </div>

                    </div>

                    {/* Security info */}

                    <div className="flex items-start gap-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3.5">

                      <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />

                      <div>

                        <p className="text-xs font-medium text-emerald-300">
                          Secure account creation
                        </p>

                        <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
                          Your password is securely hashed
                          before being stored.
                        </p>

                      </div>

                    </div>

                    {/* Buttons */}

                    <div className="flex items-center gap-3 pt-2">

                      {/* Back */}

                      <button
                        type="button"
                        onClick={handleBack}
                        disabled={loading}
                        className="w-1/3 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.025] py-3 text-sm font-semibold text-slate-400 hover:bg-white/[0.05] hover:text-white disabled:opacity-50 transition-all"
                      >

                        <ArrowLeft className="h-4 w-4" />

                        <span>
                          Back
                        </span>

                      </button>

                      {/* Submit */}

                      <button
                        type="submit"
                        disabled={loading}
                        className="group w-2/3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all hover:-translate-y-0.5 hover:shadow-violet-600/30 disabled:opacity-60 disabled:hover:translate-y-0"
                      >

                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />

                            <span>
                              Creating Organization...
                            </span>
                          </>
                        ) : (
                          <>
                            <span>
                              Complete Registration
                            </span>

                            <CheckCircle2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                          </>
                        )}

                      </button>

                    </div>

                  </form>
                )}

                {/* ==================================================
                    LOGIN FOOTER
                ================================================== */}

                <div className="mt-7 border-t border-white/10 pt-5 text-center text-xs text-slate-500">

                  Already have an organization account?{" "}

                  <Link
                    to="/login"
                    className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Sign In
                  </Link>

                </div>

              </div>

              {/* Security footer */}

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-600">

                <ShieldCheck className="h-3.5 w-3.5" />

                Secure organization onboarding

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}