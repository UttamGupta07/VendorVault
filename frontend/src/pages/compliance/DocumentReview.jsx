 import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
  ExternalLink,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

const DocumentReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  const [showRejectBox, setShowRejectBox] =
    useState(false);

  const [rejectionReason, setRejectionReason] =
    useState("");

  // ============================================================
  // Fetch document
  // ============================================================

  const fetchDocument = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        `/api/documents/${id}`
      );

      if (response.data.success) {
        setDocument(response.data.document);
      } else {
        setError(
          response.data.message ||
            "Failed to load document"
        );
      }
    } catch (err) {
      console.error(
        "Fetch document error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load document"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [id]);

  // ============================================================
  // Format date
  // ============================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ============================================================
  // Approve
  // ============================================================

  const handleApprove = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this document?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      const response =
        await axiosInstance.put(
          `/api/documents/${id}/review`,
          {
            action: "APPROVE",
          }
        );

      if (response.data.success) {
        setDocument((prev) => ({
          ...prev,
          status:
            response.data.document.status,
          reviewedBy:
            response.data.document.reviewedBy,
          reviewedAt:
            response.data.document.reviewedAt,
          rejectionReason: null,
        }));

        setShowRejectBox(false);
      }
    } catch (err) {
      console.error(
        "Approve document error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to approve document"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // Reject
  // ============================================================

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError(
        "Please provide a rejection reason."
      );
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const response =
        await axiosInstance.put(
          `/api/documents/${id}/review`,
          {
            action: "REJECT",
            rejectionReason:
              rejectionReason.trim(),
          }
        );

      if (response.data.success) {
        setDocument((prev) => ({
          ...prev,
          status:
            response.data.document.status,
          reviewedBy:
            response.data.document.reviewedBy,
          reviewedAt:
            response.data.document.reviewedAt,
          rejectionReason:
            response.data.document.rejectionReason,
        }));

        setShowRejectBox(false);
      }
    } catch (err) {
      console.error(
        "Reject document error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to reject document"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // Status badge
  // ============================================================

  const StatusBadge = () => {
    if (!document) return null;

    const status = document.status;

    if (status === "APPROVED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
          <CheckCircle size={15} />
          Approved
        </span>
      );
    }

    if (status === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200">
          <XCircle size={15} />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
        <Clock size={15} />
        Pending Review
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

            <div className="h-8 bg-gray-200 rounded w-40" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-[650px] bg-white rounded-xl border" />
              <div className="h-[650px] bg-white rounded-xl border" />
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // Error / not found
  // ============================================================

  if (error && !document) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">

          <button
            onClick={() =>
              navigate("/compliance/documents")
            }
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={17} />
            Back to Documents
          </button>

          <div className="bg-white border border-red-200 rounded-xl p-8 text-center">

            <XCircle
              size={40}
              className="mx-auto text-red-500"
            />

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Unable to load document
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>

          </div>
        </div>
      </div>
    );
  }

  if (!document) return null;

  const vendorName =
    document.vendorId?.companyName ||
    document.vendorId?.name ||
    "Unknown Vendor";

  const documentType =
    document.documentTypeId?.name ||
    "Unknown";

  const serviceType =
    document.serviceTypeId?.name ||
    "—";

  const extractedData =
    document.extractedData || {};

  const isPending =
    document.status === "PENDING_REVIEW";

  // ============================================================
  // Page
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      <div className="max-w-7xl mx-auto">

        {/* Back */}
        <button
          onClick={() =>
            navigate("/compliance/documents")
          }
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-5"
        >
          <ArrowLeft size={17} />
          Back to Documents
        </button>

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText
                  size={24}
                  className="text-blue-600"
                />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {document.originalFileName ||
                    "Document"}
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  {vendorName}
                </p>
              </div>

            </div>

            <StatusBadge />

          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* Main */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* ================================================== */}
          {/* PDF */}
          {/* ================================================== */}

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">

              <div>
                <h2 className="font-semibold text-gray-900">
                  Document Preview
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {document.originalFileName}
                </p>
              </div>

              <a
                href={document.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <ExternalLink size={15} />
                Open
              </a>

            </div>

            <div className="h-[650px] bg-gray-100">

              <iframe
                src={document.fileUrl}
                title="Document Preview"
                className="w-full h-full border-0"
              />

            </div>

          </div>

          {/* ================================================== */}
          {/* Information */}
          {/* ================================================== */}

          <div className="space-y-6">

            {/* Document information */}
            <div className="bg-white border border-gray-200 rounded-xl">

              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  Document Information
                </h2>
              </div>

              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

                <InfoItem
                  label="Vendor"
                  value={vendorName}
                />

                <InfoItem
                  label="Vendor Email"
                  value={
                    document.vendorId?.email ||
                    "—"
                  }
                />

                <InfoItem
                  label="Document Type"
                  value={documentType}
                />

                <InfoItem
                  label="Service Type"
                  value={serviceType}
                />

                <InfoItem
                  label="Uploaded"
                  value={formatDate(
                    document.createdAt
                  )}
                />

                <InfoItem
                  label="Expiry Date"
                  value={formatDate(
                    document.expiryDate
                  )}
                />

                <InfoItem
                  label="Version"
                  value={
                    document.version || 1
                  }
                />

                <InfoItem
                  label="Extraction"
                  value={
                    document.extractionStatus
                  }
                />

              </div>

            </div>

            {/* Extracted data */}
            <div className="bg-white border border-gray-200 rounded-xl">

              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  Extracted Information
                </h2>
              </div>

              <div className="p-5">

                {Object.keys(extractedData)
                  .length === 0 ? (
                  <div className="text-center py-8">

                    <AlertTriangle
                      size={28}
                      className="mx-auto text-amber-500"
                    />

                    <p className="mt-3 text-sm text-gray-500">
                      No extracted information
                      available.
                    </p>

                  </div>
                ) : (
                  <div className="space-y-4">

                    {Object.entries(
                      extractedData
                    ).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-gray-100 pb-3 last:border-0"
                        >
                          <span className="text-sm font-medium text-gray-600 capitalize">
                            {formatKey(key)}
                          </span>

                          <span className="text-sm text-gray-900 sm:text-right max-w-md break-words">
                            {formatValue(
                              value
                            )}
                          </span>
                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

            </div>

            {/* Rejection reason */}
            {document.status ===
              "REJECTED" &&
              document.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">

                  <div className="flex gap-3">

                    <XCircle
                      size={20}
                      className="text-red-600 flex-shrink-0"
                    />

                    <div>
                      <h3 className="font-semibold text-red-800">
                        Rejection Reason
                      </h3>

                      <p className="text-sm text-red-700 mt-1">
                        {
                          document.rejectionReason
                        }
                      </p>
                    </div>

                  </div>

                </div>
              )}

            {/* ================================================= */}
            {/* Review Actions */}
            {/* ================================================= */}

            {isPending && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">

                <h2 className="font-semibold text-gray-900">
                  Review Document
                </h2>

                <p className="text-sm text-gray-500 mt-1 mb-5">
                  Verify the document and extracted
                  information before making a decision.
                </p>

                {/* Reject box */}
                {showRejectBox && (
                  <div className="mb-5">

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason
                    </label>

                    <textarea
                      value={
                        rejectionReason
                      }
                      onChange={(e) =>
                        setRejectionReason(
                          e.target.value
                        )
                      }
                      rows={4}
                      placeholder="Explain why this document is being rejected..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />

                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">

                  {!showRejectBox ? (
                    <button
                      onClick={() =>
                        setShowRejectBox(
                          true
                        )
                      }
                      disabled={actionLoading}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 disabled:opacity-50"
                    >
                      <XCircle size={17} />
                      Reject
                    </button>
                  ) : (
                    <button
                      onClick={handleReject}
                      disabled={
                        actionLoading ||
                        !rejectionReason.trim()
                      }
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <XCircle size={17} />
                      )}

                      {actionLoading
                        ? "Rejecting..."
                        : "Confirm Rejection"}
                    </button>
                  )}

                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white font-medium text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <CheckCircle size={17} />
                    )}

                    {actionLoading
                      ? "Processing..."
                      : "Approve"}
                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

// ============================================================
// Info Item
// ============================================================

const InfoItem = ({ label, value }) => {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </p>

      <p className="text-sm font-medium text-gray-900 mt-1 break-words">
        {value || "—"}
      </p>
    </div>
  );
};

// ============================================================
// Format extracted key
// ============================================================

const formatKey = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (str) =>
      str.toUpperCase()
    );
};

// ============================================================
// Format extracted value
// ============================================================

const formatValue = (value) => {
  if (value === null || value === undefined) {
    return "—";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

export default DocumentReview;