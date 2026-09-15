 import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  RefreshCw,
  Search,
  XCircle,
  ChevronRight,
  Filter,
} from "lucide-react";

const ExpiryTracker = () => {
  const [documents, setDocuments] = useState([]);

  const [summary, setSummary] = useState({
    expired: 0,
    expiring7Days: 0,
    expiring15Days: 0,
    expiring30Days: 0,
    valid: 0,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [reviewFilter, setReviewFilter] = useState("ALL");

  // Summary card filter
  const [summaryFilter, setSummaryFilter] = useState("ALL");

  const [selectedDocument, setSelectedDocument] = useState(null);

  // =====================================================
  // Fetch expiry tracker data
  // =====================================================

  const fetchExpiryTracker = async () => {
    try {
      setError("");

      const response = await axiosInstance.get(
        "/api/documents/expiry-tracker",
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setDocuments(response.data.documents || []);

        setSummary({
          expired: response.data.summary?.expired || 0,
          expiring7Days:
            response.data.summary?.expiring7Days || 0,
          expiring15Days:
            response.data.summary?.expiring15Days || 0,
          expiring30Days:
            response.data.summary?.expiring30Days || 0,
          valid: response.data.summary?.valid || 0,
          total: response.data.summary?.total || 0,
        });
      }
    } catch (err) {
      console.error("Expiry tracker error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load expiry tracker"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExpiryTracker();
  }, []);

  // =====================================================
  // Refresh
  // =====================================================

  const handleRefresh = () => {
    setRefreshing(true);
    fetchExpiryTracker();
  };

  // =====================================================
  // Summary card filter
  // =====================================================

  const handleSummaryFilter = (filter) => {
    if (summaryFilter === filter) {
      setSummaryFilter("ALL");
    } else {
      setSummaryFilter(filter);

      // Clear normal expiry dropdown when using summary card
      setStatusFilter("ALL");
    }
  };

  // =====================================================
  // Clear filters
  // =====================================================

  const clearFilters = () => {
    setSummaryFilter("ALL");
    setStatusFilter("ALL");
    setReviewFilter("ALL");
    setSearch("");
  };

  // =====================================================
  // Check whether any filter is active
  // =====================================================

  const hasActiveFilters =
    summaryFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    reviewFilter !== "ALL" ||
    search.trim() !== "";

  // =====================================================
  // Filter documents
  // =====================================================

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const vendorName =
        document.vendor?.companyName ||
        document.vendor?.name ||
        "";

      const documentName =
        document.documentType?.name || "";

      const serviceName =
        document.serviceType?.name || "";

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        vendorName.toLowerCase().includes(searchText) ||
        documentName.toLowerCase().includes(searchText) ||
        serviceName.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "ALL" ||
        document.expiryStatus === statusFilter;

      const matchesReview =
        reviewFilter === "ALL" ||
        document.reviewStatus === reviewFilter;

      const matchesSummary =
        summaryFilter === "ALL" ||
        document.expiryStatus === summaryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesReview &&
        matchesSummary
      );
    });
  }, [
    documents,
    search,
    statusFilter,
    reviewFilter,
    summaryFilter,
  ]);

  // =====================================================
  // Format date
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // Expiry status helper
  // =====================================================

  const getExpiryStatus = (document) => {
    switch (document.expiryStatus) {
      case "EXPIRED":
        return {
          label: "Expired",
          className:
            "bg-red-50 text-red-700 border-red-200",
          icon: <XCircle size={14} />,
        };

      case "CRITICAL":
        return {
          label: "Critical",
          className:
            "bg-orange-50 text-orange-700 border-orange-200",
          icon: <AlertCircle size={14} />,
        };

      case "EXPIRING_15_DAYS":
        return {
          label: "Expiring Soon",
          className:
            "bg-yellow-50 text-yellow-700 border-yellow-200",
          icon: <Clock3 size={14} />,
        };

      case "EXPIRING_30_DAYS":
        return {
          label: "Upcoming",
          className:
            "bg-blue-50 text-blue-700 border-blue-200",
          icon: <CalendarDays size={14} />,
        };

      default:
        return {
          label: "Valid",
          className:
            "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle2 size={14} />,
        };
    }
  };

  // =====================================================
  // Days remaining text
  // =====================================================

  const getDaysText = (days) => {
    if (days < 0) {
      const expiredDays = Math.abs(days);

      return `${expiredDays} day${
        expiredDays !== 1 ? "s" : ""
      } ago`;
    }

    if (days === 0) {
      return "Expires today";
    }

    return `${days} day${days !== 1 ? "s" : ""} left`;
  };

  // =====================================================
  // Review status
  // =====================================================

  const getReviewStatus = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="text-green-600 font-medium">
            Approved
          </span>
        );

      case "REJECTED":
        return (
          <span className="text-red-600 font-medium">
            Rejected
          </span>
        );

      default:
        return (
          <span className="text-yellow-600 font-medium">
            Pending Review
          </span>
        );
    }
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded-lg w-64" />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 bg-gray-200 rounded-2xl"
              />
            ))}
          </div>

          <div className="h-96 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  // =====================================================
  // Page
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* =================================================
          Header
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Expiry Tracker
          </h1>

          <p className="text-gray-500 mt-1">
            Monitor vendor documents and upcoming
            compliance renewals.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              refreshing ? "animate-spin" : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* =================================================
          Error
      ================================================= */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* =================================================
          Summary Cards
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">
        {/* Expired */}

        <button
          type="button"
          onClick={() =>
            handleSummaryFilter("EXPIRED")
          }
          className={`w-full text-left bg-white border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${
            summaryFilter === "EXPIRED"
              ? "border-red-400 ring-2 ring-red-100"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Expired
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {summary.expired}
              </h2>

              <p className="text-sm text-red-600 mt-1">
                Requires immediate action
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <XCircle size={23} />
            </div>
          </div>
        </button>

        {/* Next 7 Days */}

        <button
          type="button"
          onClick={() =>
            handleSummaryFilter("CRITICAL")
          }
          className={`w-full text-left bg-white border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${
            summaryFilter === "CRITICAL"
              ? "border-orange-400 ring-2 ring-orange-100"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Next 7 Days
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {summary.expiring7Days}
              </h2>

              <p className="text-sm text-orange-600 mt-1">
                Critical renewals
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <AlertCircle size={23} />
            </div>
          </div>
        </button>

        {/* Next 15 Days */}

        <button
          type="button"
          onClick={() =>
            handleSummaryFilter("EXPIRING_15_DAYS")
          }
          className={`w-full text-left bg-white border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${
            summaryFilter === "EXPIRING_15_DAYS"
              ? "border-yellow-400 ring-2 ring-yellow-100"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Next 15 Days
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {summary.expiring15Days}
              </h2>

              <p className="text-sm text-yellow-600 mt-1">
                Attention required
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <Clock3 size={23} />
            </div>
          </div>
        </button>

        {/* Next 30 Days */}

        <button
          type="button"
          onClick={() =>
            handleSummaryFilter("EXPIRING_30_DAYS")
          }
          className={`w-full text-left bg-white border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${
            summaryFilter === "EXPIRING_30_DAYS"
              ? "border-blue-400 ring-2 ring-blue-100"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Next 30 Days
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {summary.expiring30Days}
              </h2>

              <p className="text-sm text-blue-600 mt-1">
                Upcoming renewals
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarDays size={23} />
            </div>
          </div>
        </button>
      </div>

      {/* =================================================
          Expiry Overview
      ================================================= */}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-7">
        <div className="flex items-center gap-2 mb-6">
          <CalendarDays
            size={19}
            className="text-gray-700"
          />

          <h2 className="font-semibold text-gray-900">
            Expiry Overview
          </h2>
        </div>

        <div className="flex items-center">
          <div className="flex-1">
            <div className="h-2 bg-red-500 rounded-l-full" />

            <p className="text-xs text-gray-500 mt-2">
              Expired
            </p>
          </div>

          <div className="flex-1">
            <div className="h-2 bg-orange-400" />

            <p className="text-xs text-gray-500 mt-2">
              1–7 Days
            </p>
          </div>

          <div className="flex-1">
            <div className="h-2 bg-yellow-400" />

            <p className="text-xs text-gray-500 mt-2">
              8–15 Days
            </p>
          </div>

          <div className="flex-1">
            <div className="h-2 bg-blue-400" />

            <p className="text-xs text-gray-500 mt-2">
              16–30 Days
            </p>
          </div>

          <div className="flex-1">
            <div className="h-2 bg-green-400 rounded-r-full" />

            <p className="text-xs text-gray-500 mt-2">
              30+ Days
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
          Table
      ================================================= */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Filters */}

        <div className="p-5 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search vendor, document or service..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Expiry filter */}

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setSummaryFilter("ALL");
              }}
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white outline-none"
            >
              <option value="ALL">
                All Expiry Status
              </option>

              <option value="EXPIRED">
                Expired
              </option>

              <option value="CRITICAL">
                Next 7 Days
              </option>

              <option value="EXPIRING_15_DAYS">
                Next 15 Days
              </option>

              <option value="EXPIRING_30_DAYS">
                Next 30 Days
              </option>

              <option value="VALID">
                Valid
              </option>
            </select>

            {/* Review filter */}

            <select
              value={reviewFilter}
              onChange={(e) =>
                setReviewFilter(e.target.value)
              }
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white outline-none"
            >
              <option value="ALL">
                All Review Status
              </option>

              <option value="APPROVED">
                Approved
              </option>

              <option value="PENDING_REVIEW">
                Pending Review
              </option>

              <option value="REJECTED">
                Rejected
              </option>
            </select>

            {/* Clear filters */}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition"
              >
                <XCircle size={17} />
                Clear
              </button>
            )}
          </div>

          {/* Result information */}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredDocuments.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {documents.length}
              </span>{" "}
              documents
            </span>

            {summaryFilter !== "ALL" && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                <Filter size={13} />

                Filtered:{" "}
                <span className="font-semibold">
                  {summaryFilter === "EXPIRED"
                    ? "Expired"
                    : summaryFilter === "CRITICAL"
                    ? "Next 7 Days"
                    : summaryFilter ===
                      "EXPIRING_15_DAYS"
                    ? "Next 15 Days"
                    : "Next 30 Days"}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setSummaryFilter("ALL")
                  }
                  className="hover:text-gray-900"
                >
                  <XCircle size={14} />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* =================================================
            Desktop Table
        ================================================= */}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Vendor
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Document
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Expiry Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Days
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Review
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-16 text-center"
                  >
                    <FileText
                      size={38}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-3 font-medium text-gray-700">
                      No documents found
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      Try changing your search or
                      filters.
                    </p>

                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800"
                      >
                        <XCircle size={15} />
                        Clear Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((document) => {
                  const status =
                    getExpiryStatus(document);

                  return (
                    <tr
                      key={document.id}
                      className="hover:bg-gray-50 transition"
                    >
                      {/* Vendor */}

                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {document.vendor
                            ?.companyName ||
                            document.vendor?.name ||
                            "Unknown Vendor"}
                        </div>

                        <div className="text-xs text-gray-500 mt-1">
                          {document.vendor?.email ||
                            "—"}
                        </div>
                      </td>

                      {/* Document */}

                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">
                          {document.documentType
                            ?.name ||
                            "Unknown Document"}
                        </div>

                        <div className="text-xs text-gray-500 mt-1">
                          {document.serviceType
                            ?.name || "—"}
                        </div>
                      </td>

                      {/* Expiry */}

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(
                          document.expiryDate
                        )}
                      </td>

                      {/* Days */}

                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
                            document.daysRemaining < 0
                              ? "text-red-600"
                              : document.daysRemaining <=
                                7
                              ? "text-orange-600"
                              : "text-gray-700"
                          }`}
                        >
                          {getDaysText(
                            document.daysRemaining
                          )}
                        </span>
                      </td>

                      {/* Expiry Status */}

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${status.className}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>
                      </td>

                      {/* Review */}

                      <td className="px-6 py-4 text-sm">
                        {getReviewStatus(
                          document.reviewStatus
                        )}
                      </td>

                      {/* Action */}

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            setSelectedDocument(
                              document
                            )
                          }
                          className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          View
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================================
          Details Drawer
      ================================================= */}

      {selectedDocument && (
        <>
          {/* Overlay */}

          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() =>
              setSelectedDocument(null)
            }
          />

          {/* Drawer */}

          <div className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl overflow-y-auto">
            {/* Drawer Header */}

            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Document Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Expiry information
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedDocument(null)
                }
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Drawer Content */}

            <div className="p-6 space-y-6">
              {/* Vendor */}

              <div>
                <p className="text-xs uppercase font-semibold text-gray-400">
                  Vendor
                </p>

                <p className="font-semibold text-gray-900 mt-1">
                  {selectedDocument.vendor
                    ?.companyName ||
                    selectedDocument.vendor?.name ||
                    "Unknown"}
                </p>

                <p className="text-sm text-gray-500">
                  {selectedDocument.vendor?.email ||
                    "—"}
                </p>
              </div>

              {/* Document */}

              <div>
                <p className="text-xs uppercase font-semibold text-gray-400">
                  Document
                </p>

                <p className="font-semibold text-gray-900 mt-1">
                  {selectedDocument.documentType
                    ?.name || "—"}
                </p>

                <p className="text-sm text-gray-500">
                  {selectedDocument.serviceType
                    ?.name || "—"}
                </p>
              </div>

              {/* File name */}

              <div>
                <p className="text-xs uppercase font-semibold text-gray-400">
                  File
                </p>

                <p className="text-sm text-gray-700 mt-1 break-all">
                  {selectedDocument.fileName ||
                    "—"}
                </p>
              </div>

              {/* Expiry */}

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Expiry Date
                </p>

                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatDate(
                    selectedDocument.expiryDate
                  )}
                </p>

                <p className="text-sm mt-1 text-gray-600">
                  {getDaysText(
                    selectedDocument.daysRemaining
                  )}
                </p>
              </div>

              {/* Expiry Status */}

              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-gray-500">
                  Expiry Status
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${
                    getExpiryStatus(
                      selectedDocument
                    ).className
                  }`}
                >
                  {
                    getExpiryStatus(
                      selectedDocument
                    ).icon
                  }

                  {
                    getExpiryStatus(
                      selectedDocument
                    ).label
                  }
                </span>
              </div>

              {/* Review Status */}

              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-gray-500">
                  Review Status
                </span>

                {getReviewStatus(
                  selectedDocument.reviewStatus
                )}
              </div>

              {/* AI Extraction */}

              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-gray-500">
                  AI Extraction
                </span>

                <span
                  className={`font-medium ${
                    selectedDocument.extractionStatus ===
                    "COMPLETED"
                      ? "text-green-600"
                      : selectedDocument.extractionStatus ===
                        "FAILED"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {selectedDocument.extractionStatus ===
                  "COMPLETED"
                    ? "Completed"
                    : selectedDocument.extractionStatus ||
                      "Unknown"}
                </span>
              </div>

              {/* Rejection reason */}

              {selectedDocument.rejectionReason && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-xs uppercase font-semibold text-red-500">
                    Rejection Reason
                  </p>

                  <p className="text-sm text-red-700 mt-1">
                    {
                      selectedDocument.rejectionReason
                    }
                  </p>
                </div>
              )}

              {/* Review date */}

              {selectedDocument.reviewedAt && (
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm text-gray-500">
                    Reviewed At
                  </span>

                  <span className="text-sm font-medium text-gray-700">
                    {formatDate(
                      selectedDocument.reviewedAt
                    )}
                  </span>
                </div>
              )}

              {/* View document */}

              {selectedDocument.fileUrl && (
                <a
                  href={selectedDocument.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition"
                >
                  <FileText size={18} />
                  View Document
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpiryTracker;