
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Clock,
  Users,
  X,
  FileWarning,
} from "lucide-react";

const Compliance = () => {
  const [vendors, setVendors] = useState([]);
  const [summary, setSummary] = useState({
    totalVendors: 0,
    compliant: 0,
    atRisk: 0,
    nonCompliant: 0,
    pendingReview: 0,
    averageScore: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Issues modal
  const [showIssues, setShowIssues] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    fetchCompliance();
  }, []);

  const fetchCompliance = async () => {
    try {
      setLoading(true);
      setError("");
 const response = await axiosInstance.get("/api/compliance");

      if (response.data.success) {
        setSummary(
          response.data.summary || {
            totalVendors: 0,
            compliant: 0,
            atRisk: 0,
            nonCompliant: 0,
            pendingReview: 0,
            averageScore: 0,
          }
        );

        setVendors(response.data.vendors || []);
      }
    } catch (err) {
      console.error("Compliance fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load compliance data."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Issue summary
  // ==========================================

  const getIssueSummary = (vendor) => {
    const count = vendor.issues?.length || 0;

    if (count === 0) {
      return "No issues";
    }

    return `${count} issue${count > 1 ? "s" : ""}`;
  };

  // ==========================================
  // Open issues modal
  // ==========================================

  const openIssues = (vendor) => {
    setSelectedVendor(vendor);
    setSelectedIssues(vendor.issues || []);
    setShowIssues(true);
  };

  // ==========================================
  // Close issues modal
  // ==========================================

  const closeIssues = () => {
    setShowIssues(false);
    setSelectedIssues([]);
    setSelectedVendor(null);
  };

  // ==========================================
  // Status badge
  // ==========================================

  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLIANT":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            <ShieldCheck size={14} />
            Compliant
          </span>
        );

      case "AT_RISK":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            <AlertTriangle size={14} />
            At Risk
          </span>
        );

      case "NON_COMPLIANT":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            <XCircle size={14} />
            Non-Compliant
          </span>
        );

      case "PENDING_REVIEW":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            <Clock size={14} />
            Pending Review
          </span>
        );

      default:
        return (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
            Unknown
          </span>
        );
    }
  };

  // ==========================================
  // Score styling
  // ==========================================

  const getScoreColor = (score) => {
    if (score >= 80) {
      return "text-green-600";
    }

    if (score >= 50) {
      return "text-yellow-600";
    }

    return "text-red-600";
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-sm text-gray-500">
          Loading compliance data...
        </div>
      </div>
    );
  }

  // ==========================================
  // Main page
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* ======================================
            PAGE HEADER
        ====================================== */}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Compliance
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor vendor compliance and document status.
          </p>
        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ======================================
            SUMMARY CARDS
        ====================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

          {/* Total Vendors */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Vendors
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {summary.totalVendors}
                </h2>
              </div>

              <div className="rounded-lg bg-gray-100 p-3">
                <Users
                  size={20}
                  className="text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Compliant */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Compliant
                </p>

                <h2 className="mt-2 text-2xl font-bold text-green-600">
                  {summary.compliant}
                </h2>
              </div>

              <div className="rounded-lg bg-green-50 p-3">
                <ShieldCheck
                  size={20}
                  className="text-green-600"
                />
              </div>
            </div>
          </div>

          {/* At Risk */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  At Risk
                </p>

                <h2 className="mt-2 text-2xl font-bold text-yellow-600">
                  {summary.atRisk}
                </h2>
              </div>

              <div className="rounded-lg bg-yellow-50 p-3">
                <AlertTriangle
                  size={20}
                  className="text-yellow-600"
                />
              </div>
            </div>
          </div>

          {/* Non Compliant */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Non-Compliant
                </p>

                <h2 className="mt-2 text-2xl font-bold text-red-600">
                  {summary.nonCompliant}
                </h2>
              </div>

              <div className="rounded-lg bg-red-50 p-3">
                <XCircle
                  size={20}
                  className="text-red-600"
                />
              </div>
            </div>
          </div>

          {/* Pending Review */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Pending Review
                </p>

                <h2 className="mt-2 text-2xl font-bold text-blue-600">
                  {summary.pendingReview}
                </h2>
              </div>

              <div className="rounded-lg bg-blue-50 p-3">
                <Clock
                  size={20}
                  className="text-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================
            AVERAGE SCORE
        ====================================== */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Average Compliance Score
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Across all active vendors
              </p>
            </div>

            <div
              className={`text-3xl font-bold ${getScoreColor(
                summary.averageScore
              )}`}
            >
              {summary.averageScore}%
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-current transition-all"
              style={{
                width: `${Math.min(
                  summary.averageScore,
                  100
                )}%`,
                color:
                  summary.averageScore >= 80
                    ? "#16a34a"
                    : summary.averageScore >= 50
                    ? "#ca8a04"
                    : "#dc2626",
              }}
            />
          </div>
        </div>

        {/* ======================================
            VENDOR TABLE
        ====================================== */}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold text-gray-900">
              Vendor Compliance
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review the compliance status of your vendors.
            </p>
          </div>

          {vendors.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Users
                size={40}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-3 font-medium text-gray-900">
                No vendors found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                There are no active vendors to display.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Vendor
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Service
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Compliance Score
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Documents
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Issues
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {vendors.map((vendor) => (
                    <tr
                      key={vendor.vendorId}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >

                      {/* Vendor */}

                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {vendor.vendorName}
                          </p>

                          {vendor.vendorEmail && (
                            <p className="mt-1 text-xs text-gray-500">
                              {vendor.vendorEmail}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Service */}

                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-700">
                          {vendor.serviceType ||
                            "Not Assigned"}
                        </span>
                      </td>

                      {/* Score */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-sm font-bold ${getScoreColor(
                              vendor.score
                            )}`}
                          >
                            {vendor.score}%
                          </span>

                          <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(
                                  vendor.score || 0,
                                  100
                                )}%`,
                                backgroundColor:
                                  vendor.score >= 80
                                    ? "#16a34a"
                                    : vendor.score >= 50
                                    ? "#ca8a04"
                                    : "#dc2626",
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">
                        {getStatusBadge(
                          vendor.status
                        )}
                      </td>

                      {/* Documents */}

                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-600">
                          {vendor.satisfiedRequirements || 0}
                          {" / "}
                          {vendor.totalRequirements || 0}
                        </span>

                        <p className="mt-1 text-xs text-gray-400">
                          Required documents
                        </p>
                      </td>

                      {/* Issues */}

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            openIssues(vendor)
                          }
                          className={`text-sm transition ${
                            vendor.issues?.length
                              ? "font-medium text-red-600 hover:text-red-800"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {getIssueSummary(vendor)}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ========================================
          ISSUES MODAL
      ======================================== */}

      {showIssues && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeIssues}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Compliance Issues
                </h2>

                {selectedVendor && (
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedVendor.vendorName}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={closeIssues}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}

            <div className="max-h-[450px] overflow-y-auto p-6">

              {selectedIssues.length === 0 ? (
                <div className="py-10 text-center">
                  <ShieldCheck
                    size={42}
                    className="mx-auto text-green-500"
                  />

                  <h3 className="mt-3 font-medium text-gray-900">
                    No compliance issues
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    All required documents are currently compliant.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedIssues.map(
                    (issue, index) => (
                      <div
                        key={`${issue.type}-${index}`}
                        className="rounded-lg border border-red-200 bg-red-50 p-4"
                      >
                        <div className="flex gap-3">

                          <div className="mt-1 shrink-0">
                            <FileWarning
                              size={19}
                              className="text-red-600"
                            />
                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="font-medium text-gray-900">
                              {issue.documentType ||
                                "Compliance Issue"}
                            </p>

                            <p className="mt-1 text-sm leading-5 text-gray-600">
                              {issue.message}
                            </p>

                            {issue.type && (
                              <span className="mt-2 inline-block rounded-md bg-white px-2 py-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                                {issue.type.replaceAll(
                                  "_",
                                  " "
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}

            <div className="flex justify-end border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={closeIssues}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compliance;
