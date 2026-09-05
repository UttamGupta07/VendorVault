import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Loader2,
  X,
} from "lucide-react";

const VendorDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const fileInputRef = useRef(null);

  // ----------------------------------------
  // Fetch required documents
  // ----------------------------------------
  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        "/api/vendor/auth/documents/requirements"
      );

      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error("Error fetching documents:", error);

      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // ----------------------------------------
  // Open file picker
  // ----------------------------------------
  const handleUploadClick = (document) => {
    setSelectedDocument(document);
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // ----------------------------------------
  // File selected
  // ----------------------------------------
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file || !selectedDocument) {
      return;
    }

    // Only allow PDF
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF document.");
      return;
    }

    // 10 MB limit
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10 MB.");
      return;
    }

    setSelectedFile(file);

    await uploadDocument(file, selectedDocument);
  };

  // ----------------------------------------
  // Upload document
  // ----------------------------------------
  const uploadDocument = async (file, document) => {
    try {
      setUploadingId(document._id);

      const formData = new FormData();
      formData.append("serviceTypeId", document.serviceTypeId);
formData.append("documentTypeId", document.documentTypeId);

      formData.append("document", file);
      formData.append("documentId", document._id);

      const response = await axiosInstance.post(
        "/api/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Document uploaded successfully.");

        // Refresh document list
        await fetchDocuments();
      }
    } catch (error) {
      console.error("Document upload error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to upload document. Please try again."
      );
    } finally {
      setUploadingId(null);
      setSelectedFile(null);
      setSelectedDocument(null);
    }
  };

  // ----------------------------------------
  // Status UI
  // ----------------------------------------
  const getStatus = (document) => {
    if (!document.uploaded) {
      return {
        label: "Missing",
        className: "bg-red-100 text-red-700",
        icon: <AlertCircle size={16} />,
      };
    }

    if (document.status === "APPROVED") {
      return {
        label: "Approved",
        className: "bg-green-100 text-green-700",
        icon: <CheckCircle size={16} />,
      };
    }

    if (document.status === "PENDING_REVIEW") {
      return {
        label: "Under Review",
        className: "bg-yellow-100 text-yellow-700",
        icon: <Clock size={16} />,
      };
    }

    if (document.status === "REJECTED") {
      return {
        label: "Rejected",
        className: "bg-red-100 text-red-700",
        icon: <AlertCircle size={16} />,
      };
    }

    return {
      label: "Uploaded",
      className: "bg-blue-100 text-blue-700",
      icon: <CheckCircle size={16} />,
    };
  };

  // ----------------------------------------
  // Loading
  // ----------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2
            size={32}
            className="animate-spin text-blue-600"
          />
        </div>
      </div>
    );
  }

  // ----------------------------------------
  // Main UI
  // ----------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Documents
          </h1>

          <p className="mt-2 text-gray-500">
            Upload and manage the documents required for your organization.
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          {/* Total */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Required
                </p>

                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {documents.length}
                </p>
              </div>

              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <FileText size={22} />
              </div>
            </div>
          </div>

          {/* Uploaded */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Uploaded
                </p>

                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {
                    documents.filter(
                      (document) => document.uploaded
                    ).length
                  }
                </p>
              </div>

              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <CheckCircle size={22} />
              </div>
            </div>
          </div>

          {/* Missing */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Missing
                </p>

                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {
                    documents.filter(
                      (document) => !document.uploaded
                    ).length
                  }
                </p>
              </div>

              <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                <AlertCircle size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Documents Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

          {/* Card Header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Required Documents
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Please upload all documents listed below.
            </p>
          </div>

          {/* Empty State */}
          {documents.length === 0 ? (
            <div className="py-16 text-center">
              <FileText
                size={45}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-4 text-lg font-semibold text-gray-700">
                No documents required
              </h3>

              <p className="text-gray-500 mt-1">
                There are currently no documents assigned to you.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">

              {documents.map((document) => {
                const status = getStatus(document);

                return (
                  <div
                    key={document._id}
                    className="p-5 md:px-6 hover:bg-gray-50 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      {/* Document Information */}
                      <div className="flex items-start gap-4">

                        <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
                          <FileText size={24} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {document.name}
                          </h3>

                          {document.description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {document.description}
                            </p>
                          )}

                          {document.isRequired && (
                            <span className="inline-block mt-2 text-xs font-medium text-red-600">
                              Required
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status + Action */}
                      <div className="flex items-center gap-3">

                        {/* Status */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.className}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>

                        {/* View */}
                        {document.uploaded &&
                          document.fileUrl && (
                            <a
                              href={document.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                            >
                              <Eye size={16} />
                              View
                            </a>
                          )}

                        {/* Upload */}
                        <button
                          onClick={() =>
                            handleUploadClick(document)
                          }
                          disabled={
                            uploadingId === document._id
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          {uploadingId === document._id ? (
                            <>
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload size={16} />
                              {document.uploaded
                                ? "Replace"
                                : "Upload"}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Upload Information */}
        <div className="mt-5 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <AlertCircle
            size={20}
            className="text-blue-600 mt-0.5"
          />

          <div>
            <p className="text-sm font-medium text-blue-800">
              Document upload requirements
            </p>

            <p className="text-sm text-blue-700 mt-1">
              Upload documents in PDF format. Maximum file size is
              10 MB.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDocuments;

