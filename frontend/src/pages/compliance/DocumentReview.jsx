
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  User,
  Hash,
  MapPin,
  AlertCircle,
  Loader2,
} from "lucide-react";

const DocumentReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // ==========================================
  // Fetch document
  // ==========================================

  const fetchDocument = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://localhost:5000/api/documents/${id}`,
        {
          withCredentials: true,
        }
      );

      setDocument(response.data.document);
    } catch (error) {
      console.error("Failed to fetch document:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load document"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [id]);

  // ==========================================
  // Approve document
  // ==========================================

  const handleApprove = async () => {
    try {
      setReviewing(true);
      setError("");

      await axios.put(
        `http://localhost:5000/api/documents/${id}/review`,
        {
          action: "APPROVE",
        },
        {
          withCredentials: true,
        }
      );

      navigate("/compliance/documents");
    } catch (error) {
      console.error("Approve document error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to approve document"
      );
    } finally {
      setReviewing(false);
    }
  };

  // ==========================================
  // Reject document
  // ==========================================

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }

    try {
      setReviewing(true);
      setError("");

      await axios.put(
        `http://localhost:5000/api/documents/${id}/review`,
        {
          action: "REJECT",
          rejectionReason: rejectionReason.trim(),
        },
        {
          withCredentials: true,
        }
      );

      navigate("/compliance/documents");
    } catch (error) {
      console.error("Reject document error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to reject document"
      );
    } finally {
      setReviewing(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2
          size={35}
          className="animate-spin text-blue-600"
        />
      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <button
          onClick={() =>
            navigate("/compliance/documents")
          }
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Documents
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} />
            {error || "Document not found"}
          </div>
        </div>
      </div>
    );
  }

  const extractedData = document.extractedData || {};

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ======================================
          Header
      ======================================= */}

      <div className="border-b bg-white">
        <div className="flex items-center justify-between px-6 py-4">

          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                navigate("/compliance/documents")
              }
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Document Review
              </h1>

              <p className="text-sm text-gray-500">
                Review AI-extracted information before
                approving the document
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1.5 text-sm font-medium text-yellow-700">
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            Pending Review
          </div>

        </div>
      </div>

      {/* ======================================
          Error
      ======================================= */}

      {error && (
        <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* ======================================
          Main Content
      ======================================= */}

      <div className="grid min-h-[calc(100vh-81px)] grid-cols-1 lg:grid-cols-2">

        {/* ====================================
            PDF
        ===================================== */}

        <div className="flex flex-col border-r bg-gray-100">

          <div className="flex items-center gap-3 border-b bg-white px-6 py-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <FileText
                size={20}
                className="text-blue-600"
              />
            </div>

            <div className="min-w-0">
              <h2 className="truncate font-semibold text-gray-900">
                {document.originalFileName}
              </h2>

              <p className="text-xs text-gray-500">
                PDF Document
              </p>
            </div>

          </div>

          <div className="flex-1 p-4">

            <iframe
              src={document.fileUrl}
              title={document.originalFileName}
              className="h-full min-h-[700px] w-full rounded-lg border bg-white shadow-sm"
            />

          </div>

        </div>

        {/* ====================================
            Extracted Information
        ===================================== */}

        <div className="flex flex-col bg-white">

          <div className="flex-1 overflow-y-auto p-6">

            {/* Vendor */}
            <div className="mb-6 rounded-xl border bg-gray-50 p-5">

              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Vendor Information
              </h2>

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
                  <User
                    size={21}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    {document.vendorId?.name ||
                      "Unknown Vendor"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {document.vendorId?.email || ""}
                  </p>
                </div>

              </div>

            </div>

            {/* Document Information */}
            <div className="mb-6">

              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Extracted Information
              </h2>

              <div className="space-y-4">

                {/* Document Type */}
                <div className="rounded-lg border p-4">

                  <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase text-gray-500">
                    <FileText size={15} />
                    Document Type
                  </div>

                  <p className="font-medium text-gray-900">
                    {extractedData.documentType ||
                      "Not available"}
                  </p>

                </div>

                {/* Document Number */}
                <div className="rounded-lg border p-4">

                  <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase text-gray-500">
                    <Hash size={15} />
                    Document Number
                  </div>

                  <p className="font-medium text-gray-900">
                    {extractedData.documentNumber ||
                      "Not available"}
                  </p>

                </div>

                {/* Vendor Name from document */}
                <div className="rounded-lg border p-4">

                  <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase text-gray-500">
                    <User size={15} />
                    Name in Document
                  </div>

                  <p className="font-medium text-gray-900">
                    {extractedData.vendorName ||
                      "Not available"}
                  </p>

                </div>

                {/* Issue Date */}
                <div className="rounded-lg border p-4">

                  <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase text-gray-500">
                    <Calendar size={15} />
                    Issue / Effective Date
                  </div>

                  <p className="font-medium text-gray-900">
                    {extractedData.issueDate ||
                      "Not available"}
                  </p>

                </div>

                {/* Expiry Date */}
                <div className="rounded-lg border p-4">

                  <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase text-gray-500">
                    <Calendar size={15} />
                    Expiry Date
                  </div>

                  <p className="font-medium text-gray-900">
                    {extractedData.expiryDate ||
                      "No expiry date"}
                  </p>

                </div>

                {/* Address */}
                <div className="rounded-lg border p-4">

                  <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase text-gray-500">
                    <MapPin size={15} />
                    Address
                  </div>

                  <p className="leading-relaxed text-gray-900">
                    {extractedData.address ||
                      "Not available"}
                  </p>

                </div>

              </div>

            </div>

            {/* Clauses */}
            <div className="mb-6">

              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Compliance Clauses
              </h2>

              {extractedData.clauses?.length > 0 ? (
                <div className="space-y-3">

                  {extractedData.clauses.map(
                    (clause, index) => (
                      <div
                        key={index}
                        className="rounded-lg border bg-gray-50 p-4"
                      >
                        <div className="flex gap-3">
                          <span className="font-semibold text-blue-600">
                            {index + 1}.
                          </span>

                          <p className="text-sm leading-relaxed text-gray-700">
                            {clause}
                          </p>
                        </div>
                      </div>
                    )
                  )}

                </div>
              ) : (
                <div className="rounded-lg border bg-gray-50 p-4 text-sm text-gray-500">
                  No compliance clauses were extracted.
                </div>
              )}

            </div>

            {/* AI Status */}
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">

              <div className="flex items-center gap-3">

                <CheckCircle
                  size={20}
                  className="text-green-600"
                />

                <div>
                  <p className="font-medium text-green-800">
                    AI Extraction Completed
                  </p>

                  <p className="text-sm text-green-700">
                    The information above was extracted
                    from the uploaded document.
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* ==================================
              Decision Footer
          =================================== */}

          <div className="border-t bg-white p-5">

            <div className="mb-4">
              <h3 className="font-semibold text-gray-900">
                Compliance Decision
              </h3>

              <p className="text-sm text-gray-500">
                Verify the extracted information against
                the original document before making a
                decision.
              </p>
            </div>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setShowRejectModal(true)
                }
                disabled={reviewing}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-3 font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XCircle size={18} />
                Reject
              </button>

              <button
                onClick={handleApprove}
                disabled={reviewing}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reviewing ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <CheckCircle size={18} />
                )}

                Approve
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          Reject Modal
      ======================================= */}

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

            <div className="border-b px-6 py-5">

              <h2 className="text-lg font-semibold text-gray-900">
                Reject Document
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Please provide a reason for rejecting
                this document.
              </p>

            </div>

            <div className="p-6">

              <textarea
                value={rejectionReason}
                onChange={(e) =>
                  setRejectionReason(e.target.value)
                }
                placeholder="Enter rejection reason..."
                rows={5}
                className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />

            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4">

              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                disabled={reviewing}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                disabled={reviewing}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {reviewing && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                Reject Document
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default DocumentReview;

