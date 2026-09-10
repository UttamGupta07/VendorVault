import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const ComplianceDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryingId, setRetryingId] = useState(null);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expiryFilter, setExpiryFilter] = useState("ALL");

  // retry document extraction
  const handleRetryExtraction = async (documentId) => {
    try {
      setRetryingId(documentId);

      const response = await axiosInstance.post(
        `/api/documents/${documentId}/retry-extraction`
      );

      if (response.data.success) {
        // Update the document in the existing list
        setDocuments((prevDocuments) =>
          prevDocuments.map((document) =>
            document._id === documentId
              ? {
                ...document,
                extractionStatus:
                  response.data.document.extractionStatus,
                extractedData:
                  response.data.document.extractedData,
                expiryDate:
                  response.data.document.expiryDate,
                status:
                  response.data.document.status,
              }
              : document
          )
        );
      }
    } catch (err) {
      console.error(
        "Retry extraction error:",
        err
      );

      alert(
        err.response?.data?.message ||
        "Failed to extract document details"
      );
    } finally {
      setRetryingId(null);
    }
  };

  // ============================================================
  // Fetch all documents
  // ============================================================

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/api/documents");

      if (response.data.success) {
        setDocuments(response.data.documents || []);
      } else {
        setError(response.data.message || "Failed to fetch documents");
      }
    } catch (err) {
      console.error("Fetch documents error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load documents. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // ============================================================
  // Helpers
  // ============================================================

  const getVendorName = (document) => {
    return (
      document.vendorId?.companyName ||
      document.vendorId?.name ||
      "Unknown Vendor"
    );
  };

  const getDocumentType = (document) => {
    return document.documentTypeId?.name || "Unknown";
  };

  const getServiceType = (document) => {
    return document.serviceTypeId?.name || "—";
  };

  const getStatus = (document) => {
    return document.status || "UNKNOWN";
  };

  const getExpiryState = (expiryDate) => {
    if (!expiryDate) {
      return "NO_EXPIRY";
    }

    const today = new Date();
    const expiry = new Date(expiryDate);

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    if (expiry < today) {
      return "EXPIRED";
    }

    const difference =
      (expiry.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24);

    if (difference <= 30) {
      return "EXPIRING_SOON";
    }

    return "VALID";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================================
  // Statistics
  // ============================================================

  const statistics = useMemo(() => {
    const total = documents.length;

    const pending = documents.filter(
      (doc) => doc.status === "PENDING_REVIEW"
    ).length;

    const approved = documents.filter(
      (doc) => doc.status === "APPROVED"
    ).length;

    const rejected = documents.filter(
      (doc) => doc.status === "REJECTED"
    ).length;

    const expired = documents.filter(
      (doc) => getExpiryState(doc.expiryDate) === "EXPIRED"
    ).length;

    const expiringSoon = documents.filter(
      (doc) =>
        getExpiryState(doc.expiryDate) === "EXPIRING_SOON"
    ).length;

    return {
      total,
      pending,
      approved,
      rejected,
      expired,
      expiringSoon,
    };
  }, [documents]);

  // ============================================================
  // Filter documents
  // ============================================================

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const vendorName = getVendorName(document).toLowerCase();
      const documentName =
        document.originalFileName?.toLowerCase() || "";
      const documentType = getDocumentType(document).toLowerCase();

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        vendorName.includes(searchText) ||
        documentName.includes(searchText) ||
        documentType.includes(searchText);

      const matchesStatus =
        statusFilter === "ALL" ||
        document.status === statusFilter;

      const expiryState = getExpiryState(document.expiryDate);

      const matchesExpiry =
        expiryFilter === "ALL" ||
        expiryState === expiryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesExpiry
      );
    });
  }, [
    documents,
    search,
    statusFilter,
    expiryFilter,
  ]);

  // ============================================================
  // Status badge
  // ============================================================

  const StatusBadge = ({ status }) => {
    const config = {
      PENDING_REVIEW: {
        label: "Pending Review",
        className:
          "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock,
      },
      APPROVED: {
        label: "Approved",
        className:
          "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle,
      },
      REJECTED: {
        label: "Rejected",
        className:
          "bg-red-50 text-red-700 border-red-200",
        icon: XCircle,
      },
    };

    const current = config[status] || {
      label: status || "Unknown",
      className:
        "bg-gray-50 text-gray-600 border-gray-200",
      icon: FileText,
    };

    const Icon = current.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${current.className}`}
      >
        <Icon size={13} />
        {current.label}
      </span>
    );
  };

  // ============================================================
  // Expiry badge
  // ============================================================

  const ExpiryBadge = ({ expiryDate }) => {
    const state = getExpiryState(expiryDate);

    if (state === "NO_EXPIRY") {
      return (
        <span className="text-sm text-gray-400">
          No expiry
        </span>
      );
    }

    if (state === "EXPIRED") {
      return (
        <span className="inline-flex items-center gap-1.5 text-red-600 text-sm font-medium">
          <AlertTriangle size={14} />
          {formatDate(expiryDate)}
        </span>
      );
    }

    if (state === "EXPIRING_SOON") {
      return (
        <span className="inline-flex items-center gap-1.5 text-amber-600 text-sm font-medium">
          <Clock size={14} />
          {formatDate(expiryDate)}
        </span>
      );
    }

    return (
      <span className="text-sm text-gray-600">
        {formatDate(expiryDate)}
      </span>
    );
  };

  // ============================================================
  // Loading
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-200 rounded w-80" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-28 bg-white rounded-xl border"
                />
              ))}
            </div>

            <div className="h-96 bg-white rounded-xl border" />
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // Page
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Documents
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage and review vendor compliance documents
            </p>
          </div>

          <button
            onClick={fetchDocuments}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm">
              {error}
            </span>

            <button
              onClick={fetchDocuments}
              className="text-sm font-medium underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Total */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Documents
                </p>

                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {statistics.total}
                </p>
              </div>

              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText
                  size={21}
                  className="text-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Pending Review
                </p>

                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {statistics.pending}
                </p>
              </div>

              <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center">
                <Clock
                  size={21}
                  className="text-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Expiring */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Expiring Soon
                </p>

                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {statistics.expiringSoon}
                </p>
              </div>

              <div className="w-11 h-11 rounded-lg bg-orange-50 flex items-center justify-center">
                <AlertTriangle
                  size={21}
                  className="text-orange-600"
                />
              </div>
            </div>
          </div>

          {/* Expired */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Expired
                </p>

                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {statistics.expired}
                </p>
              </div>

              <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center">
                <XCircle
                  size={21}
                  className="text-red-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex flex-col lg:flex-row gap-3">

            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search vendor, document name or type..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="appearance-none w-full lg:w-48 px-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">
                  All Status
                </option>

                <option value="PENDING_REVIEW">
                  Pending Review
                </option>

                <option value="APPROVED">
                  Approved
                </option>

                <option value="REJECTED">
                  Rejected
                </option>
              </select>

              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>

            {/* Expiry */}
            <div className="relative">
              <select
                value={expiryFilter}
                onChange={(e) =>
                  setExpiryFilter(e.target.value)
                }
                className="appearance-none w-full lg:w-48 px-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">
                  All Expiry
                </option>

                <option value="VALID">
                  Valid
                </option>

                <option value="EXPIRING_SOON">
                  Expiring Soon
                </option>

                <option value="EXPIRED">
                  Expired
                </option>

                <option value="NO_EXPIRY">
                  No Expiry
                </option>
              </select>

              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                All Documents
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                {filteredDocuments.length} document
                {filteredDocuments.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                <FileText
                  size={25}
                  className="text-gray-400"
                />
              </div>

              <h3 className="mt-4 font-medium text-gray-900">
                No documents found
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">

                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Vendor
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Document
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Type
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Uploaded
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Expiry
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Status
                    </th>

                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredDocuments.map((document) => (
                    <tr
                      key={document._id}
                      className="hover:bg-gray-50 transition"
                    >

                      {/* Vendor */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {getVendorName(document)}
                          </p>

                          {document.vendorId?.email && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {document.vendorId.email}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Document */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <FileText
                              size={17}
                              className="text-blue-600"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[220px]">
                              {document.originalFileName ||
                                "Unnamed document"}
                            </p>

                            <p className="text-xs text-gray-500">
                              Version {document.version || 1}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm text-gray-700">
                            {getDocumentType(document)}
                          </p>

                          <p className="text-xs text-gray-400 mt-0.5">
                            {getServiceType(document)}
                          </p>
                        </div>
                      </td>

                      {/* Uploaded */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {formatDate(document.createdAt)}
                      </td>

                      {/* Expiry */}
                      <td className="px-5 py-4">
                        <ExpiryBadge
                          expiryDate={document.expiryDate}
                        />
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge
                          status={getStatus(document)}
                        />
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">

                          {document.extractionStatus === "FAILED" && (
                            <button
                              onClick={() =>
                                handleRetryExtraction(document._id)
                              }
                              disabled={retryingId === document._id}
                              className="inline-flex items-center gap-1.5 px-3 py-2
                   text-sm font-medium
                   text-orange-600
                   bg-orange-50
                   hover:bg-orange-100
                   rounded-lg
                   disabled:opacity-50
                   disabled:cursor-not-allowed"
                            >
                              <RefreshCw
                                size={15}
                                className={
                                  retryingId === document._id
                                    ? "animate-spin"
                                    : ""
                                }
                              />

                              {retryingId === document._id
                                ? "Extracting..."
                                : "Retry Extraction"}
                            </button>
                          )}

                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() =>
                                navigate(
                                  `/compliance/documents/${document._id}`
                                )
                              }
                              className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition ${document.status === "PENDING_REVIEW"
                                  ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                  : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                }`}
                            >
                              <Eye size={16} />

                              {document.status === "PENDING_REVIEW"
                                ? "Review"
                                : "View"}
                            </button>
                          </td>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceDocuments;