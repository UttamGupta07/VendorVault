import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Upload,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

const VendorDashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Fetch Dashboard
  // --------------------------------------------------

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get(
          "/api/vendor/auth/dashboard"
        );

        setDashboard(response.data.data);
      } catch (error) {
        console.error(
          "Failed to fetch vendor dashboard:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // --------------------------------------------------
  // Loading State
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">

        {/* Header */}
        <div>
          <div className="h-7 w-56 bg-gray-200 rounded" />
          <div className="h-4 w-80 bg-gray-200 rounded mt-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 bg-white border border-gray-200 rounded-xl"
            />
          ))}

        </div>

        {/* Main */}
        <div className="h-80 bg-white border border-gray-200 rounded-xl" />

        {/* Table */}
        <div className="h-64 bg-white border border-gray-200 rounded-xl" />

      </div>
    );
  }

  // --------------------------------------------------
  // Error State
  // --------------------------------------------------

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 mx-auto rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle
              size={24}
              className="text-red-500"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Unable to load dashboard
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  // --------------------------------------------------
  // API Data
  // --------------------------------------------------

  const {
    vendor = {},
    complianceScore = 0,
    totalDocuments = 0,
    uploadedDocuments = 0,
    approvedDocuments = 0,
    underReview = 0,
    rejectedDocuments = 0,
    expiringSoon = 0,
    expiredDocuments = 0,
    missingDocuments = 0,
    actionRequired = 0,
    actionDocuments = [],
  } = dashboard;

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const stats = [
    {
      title: "Compliance Score",
      value: `${complianceScore}%`,
      icon: ShieldCheck,
      description: "Overall compliance",
    },
    {
      title: "Required Documents",
      value: totalDocuments,
      icon: FileText,
      description: "Documents required",
    },
    {
      title: "Approved",
      value: approvedDocuments,
      icon: CheckCircle,
      description: "Approved documents",
    },
    {
      title: "Action Required",
      value: actionRequired,
      icon: AlertTriangle,
      description: "Need your attention",
    },
  ];

  // --------------------------------------------------
  // Document Status
  // --------------------------------------------------

  const documentStatus = [
    {
      title: "Approved",
      count: approvedDocuments,
      icon: CheckCircle,
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      title: "Under Review",
      count: underReview,
      icon: Clock,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Expiring Soon",
      count: expiringSoon,
      icon: AlertTriangle,
      bg: "bg-yellow-50",
      text: "text-yellow-600",
    },
    {
      title: "Missing",
      count: missingDocuments,
      icon: XCircle,
      bg: "bg-red-50",
      text: "text-red-600",
    },
  ];

  // --------------------------------------------------
  // Compliance Message
  // --------------------------------------------------

  const getComplianceMessage = () => {
    if (complianceScore >= 90) {
      return "Excellent Compliance";
    }

    if (complianceScore >= 75) {
      return "Good Compliance";
    }

    if (complianceScore >= 50) {
      return "Needs Improvement";
    }

    return "Action Required";
  };

  // --------------------------------------------------
  // Progress Circle
  // --------------------------------------------------

  const circumference = 264;

  const strokeOffset =
    circumference -
    (complianceScore / 100) * circumference;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back
          {vendor.name ? `, ${vendor.name}` : ""} 👋
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your vendor compliance status.
        </p>
      </div>


      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {stat.value}
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    {stat.description}
                  </p>

                </div>

                <div className="p-3 bg-gray-100 rounded-lg">

                  <Icon
                    size={21}
                    className="text-gray-700"
                  />

                </div>

              </div>

            </div>
          );
        })}

      </div>


      {/* =================================================
          COMPLIANCE + QUICK ACTIONS
      ================================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">


        {/* =================================================
            COMPLIANCE OVERVIEW
        ================================================= */}

        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-lg font-semibold text-gray-900">
                Compliance Overview
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Current status of your documents.
              </p>

            </div>

            <ShieldCheck
              size={24}
              className="text-gray-500"
            />

          </div>


          {/* Score */}

          <div className="flex items-center gap-6 mb-8">

            <div className="relative w-28 h-28">

              <svg
                className="w-28 h-28 -rotate-90"
                viewBox="0 0 100 100"
              >

                {/* Background */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="text-gray-100"
                />

                {/* Progress */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  className="text-green-500"
                />

              </svg>

              <div className="absolute inset-0 flex items-center justify-center">

                <span className="text-2xl font-bold text-gray-900">
                  {complianceScore}%
                </span>

              </div>

            </div>


            <div>

              <p className="font-semibold text-gray-900">
                {getComplianceMessage()}
              </p>

              <p className="text-sm text-gray-500 mt-1">

                {actionRequired > 0
                  ? `You have ${actionRequired} document${
                      actionRequired > 1
                        ? "s"
                        : ""
                    } requiring attention.`
                  : "All your compliance documents are up to date."
                }

              </p>

            </div>

          </div>


          {/* Document Status */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

            {documentStatus.map((item) => {

              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="border border-gray-200 rounded-lg p-4"
                >

                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.bg}`}
                  >

                    <Icon
                      size={18}
                      className={item.text}
                    />

                  </div>

                  <p className="mt-3 text-xl font-bold text-gray-900">
                    {item.count}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {item.title}
                  </p>

                </div>
              );

            })}

          </div>

        </div>


        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div className="bg-white border border-gray-200 rounded-xl p-6">

          <h2 className="text-lg font-semibold text-gray-900">
            Quick Actions
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-6">
            Manage your compliance documents.
          </p>


          <div className="space-y-3">

            {/* Upload */}

            <button
              onClick={() =>
                navigate("/vendor/documents")
              }
              className="w-full flex items-center justify-between
              px-4 py-3.5 rounded-lg
              bg-gray-900 text-white
              hover:bg-gray-800 transition"
            >

              <div className="flex items-center gap-3">

                <Upload size={18} />

                <span className="text-sm font-medium">
                  Upload Document
                </span>

              </div>

              <ArrowRight size={17} />

            </button>


            {/* View Documents */}

            <button
              onClick={() =>
                navigate("/vendor/documents")
              }
              className="w-full flex items-center justify-between
              px-4 py-3.5 rounded-lg
              border border-gray-200
              text-gray-700
              hover:bg-gray-50 transition"
            >

              <div className="flex items-center gap-3">

                <FileText size={18} />

                <span className="text-sm font-medium">
                  View Documents
                </span>

              </div>

              <ArrowRight size={17} />

            </button>

          </div>


          {/* Reminder */}

          {actionRequired > 0 && (

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">

              <div className="flex gap-3">

                <AlertTriangle
                  size={19}
                  className="text-yellow-600 shrink-0"
                />

                <div>

                  <p className="text-sm font-medium text-yellow-800">
                    Action required
                  </p>

                  <p className="text-xs text-yellow-700 mt-1">
                    You have {actionRequired} document
                    {actionRequired > 1 ? "s" : ""} that
                    need your attention.
                  </p>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>


      {/* =================================================
          DOCUMENTS REQUIRING ACTION
      ================================================= */}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        {/* Header */}

        <div className="px-6 py-5 border-b border-gray-200">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-semibold text-gray-900">
                Documents Requiring Action
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Documents that need your attention.
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/vendor/documents")
              }
              className="hidden sm:flex items-center gap-1
              text-sm font-medium text-gray-700
              hover:text-gray-900"
            >

              View All

              <ArrowRight size={15} />

            </button>

          </div>

        </div>


        {/* Documents */}

        <div className="divide-y divide-gray-100">

          {actionDocuments.length === 0 ? (

            <div className="px-6 py-10 text-center">

              <CheckCircle
                size={32}
                className="mx-auto text-green-500"
              />

              <p className="mt-3 text-sm font-medium text-gray-900">
                No action required
              </p>

              <p className="mt-1 text-xs text-gray-500">
                All your documents are currently up to date.
              </p>

            </div>

          ) : (

            actionDocuments.map((document) => (

              <div
                key={document.id || document.documentTypeId}
                className="px-6 py-4
                flex flex-col sm:flex-row
                sm:items-center sm:justify-between
                gap-4"
              >

                {/* Document */}

                <div className="flex items-center gap-4">

                  <div className="p-3 bg-gray-100 rounded-lg">

                    <FileText
                      size={20}
                      className="text-gray-600"
                    />

                  </div>

                  <div>

                    <h3 className="text-sm font-medium text-gray-900">
                      {document.name}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      {document.type}
                    </p>

                  </div>

                </div>


                {/* Status + Action */}

                <div className="flex items-center gap-3">

                  <span
                    className={`
                      px-3 py-1 rounded-full
                      text-xs font-medium

                      ${
                        document.status === "Missing"
                          ? "bg-red-100 text-red-700"
                          : document.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    `}
                  >
                    {document.status}
                  </span>


                  <button
                    onClick={() => {

                      if (document.id) {
                        navigate(
                          `/vendor/documents/${document.id}`
                        );
                      } else {
                        navigate(
                          "/vendor/documents"
                        );
                      }

                    }}
                    className="flex items-center gap-2
                    px-3 py-2
                    text-sm font-medium
                    border border-gray-200
                    rounded-lg
                    hover:bg-gray-50"
                  >

                    {document.action || "View"}

                    <ArrowRight size={15} />

                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
};

export default VendorDashboard;

