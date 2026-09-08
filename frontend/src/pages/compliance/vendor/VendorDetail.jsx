import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";

const VendorDetail = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVendor();
  }, [vendorId]);

  const fetchVendor = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        `/api/vendor/${vendorId}`
      );

      if (response.data.success) {
        setVendor(response.data.vendor);
      }
    } catch (error) {
      console.error("Error fetching vendor:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load vendor details"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case "COMPLIANT":
        return {
          label: "Compliant",
          className: "bg-green-50 text-green-700",
          icon: <CheckCircle size={16} />,
        };

      case "AT_RISK":
        return {
          label: "At Risk",
          className: "bg-yellow-50 text-yellow-700",
          icon: <AlertTriangle size={16} />,
        };

      case "NON_COMPLIANT":
        return {
          label: "Non-Compliant",
          className: "bg-red-50 text-red-700",
          icon: <XCircle size={16} />,
        };

      default:
        return {
          label: "Unknown",
          className: "bg-gray-50 text-gray-600",
          icon: null,
        };
    }
  };

  const getDocumentStatus = (document) => {
    if (document.status === "REJECTED") {
      return {
        label: "Rejected",
        className: "bg-red-50 text-red-700",
        icon: <XCircle size={14} />,
      };
    }

    if (document.status === "PENDING_REVIEW") {
      return {
        label: "Pending Review",
        className: "bg-yellow-50 text-yellow-700",
        icon: <AlertTriangle size={14} />,
      };
    }

    if (
      document.expiryDate &&
      new Date(document.expiryDate) < new Date()
    ) {
      return {
        label: "Expired",
        className: "bg-red-50 text-red-700",
        icon: <XCircle size={14} />,
      };
    }

    if (document.expiryDate) {
      const today = new Date();
      const expiry = new Date(document.expiryDate);
      const days =
        (expiry - today) / (1000 * 60 * 60 * 24);

      if (days <= 30) {
        return {
          label: "Expiring",
          className: "bg-yellow-50 text-yellow-700",
          icon: <AlertTriangle size={14} />,
        };
      }
    }

    return {
      label: "Valid",
      className: "bg-green-50 text-green-700",
      icon: <CheckCircle size={14} />,
    };
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysUntilExpiry = (date) => {
    if (!date) return 0;

    const today = new Date();
    const expiry = new Date(date);

    return Math.ceil(
      (expiry - today) / (1000 * 60 * 60 * 24)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">
          Loading vendor details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate("/compliance/vendors")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Vendors
        </button>

        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!vendor) return null;

  const status = getStatusDetails(
    vendor.complianceStatus
  );

  const documents = vendor.documents?.list || [];

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate("/compliance/vendors")}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft size={18} />
        Back to Vendors
      </button>

      {/* Vendor Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
              <Building2
                size={26}
                className="text-gray-500"
              />
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {vendor.companyName}
                </h1>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.className}`}
                >
                  {status.icon}
                  {status.label}
                </span>
              </div>

              <p className="text-gray-500 mt-1">
                {vendor.serviceType?.name || "N/A"}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Vendor ID: VEN-
                {vendor._id.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Compliance Score */}
          <div className="lg:text-right">
            <p className="text-sm text-gray-500">
              Compliance Score
            </p>

            <p className="text-4xl font-bold text-gray-900 mt-1">
              {vendor.complianceScore}%
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Documents"
          value={vendor.documents?.submitted || 0}
          icon={<FileText size={20} />}
        />

        <SummaryCard
          title="Valid"
          value={
            vendor.documents?.approved || 0
          }
          icon={<CheckCircle size={20} />}
        />

        <SummaryCard
          title="Expiring"
          value={
            vendor.documents?.expiringSoon || 0
          }
          icon={<AlertTriangle size={20} />}
        />

        <SummaryCard
          title="Missing"
          value={
            vendor.documents?.missing || 0
          }
          icon={<XCircle size={20} />}
        />
      </div>

      {/* Vendor Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          Vendor Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InfoItem
            icon={<Building2 size={17} />}
            label="Company Name"
            value={vendor.companyName}
          />

          <InfoItem
            icon={<Mail size={17} />}
            label="Email"
            value={vendor.email}
          />

          <InfoItem
            icon={<Phone size={17} />}
            label="Phone"
            value={vendor.phone || "—"}
          />

          <InfoItem
            icon={<Briefcase size={17} />}
            label="Service Type"
            value={vendor.serviceType?.name || "N/A"}
          />

          <InfoItem
            icon={<Calendar size={17} />}
            label="Onboarded"
            value={formatDate(vendor.createdAt)}
          />

          <InfoItem
            icon={<CheckCircle size={17} />}
            label="Compliance Status"
            value={status.label}
          />
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Documents
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Documents submitted by this vendor
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Document
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Expiry Date
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {documents.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No documents uploaded yet.
                  </td>
                </tr>
              ) : (
                documents.map((document) => {
                  const documentStatus =
                    getDocumentStatus(document);

                  return (
                    <tr
                      key={document._id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileText
                            size={18}
                            className="text-gray-400"
                          />

                          <span className="text-sm font-medium text-gray-800">
                            {document.documentTypeId?.name ||
                              document.originalFileName}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${documentStatus.className}`}
                        >
                          {documentStatus.icon}
                          {documentStatus.label}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(
                          document.expiryDate
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            window.open(
                              document.fileUrl,
                              "_blank"
                            )
                          }
                          className="text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          View
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

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          Recent Activity
        </h2>

        <div className="space-y-4">
          {documents.slice(0, 4).map((document) => {
            const status =
              getDocumentStatus(document);

            const daysLeft = getDaysUntilExpiry(
              document.expiryDate
            );

            let message = "";

            if (document.status === "APPROVED") {
              message = `${
                document.documentTypeId?.name ||
                "Document"
              } approved`;
            } else if (document.status === "REJECTED") {
              message = `${
                document.documentTypeId?.name ||
                "Document"
              } rejected`;
            } else if (
              document.expiryDate &&
              daysLeft >= 0 &&
              daysLeft <= 30
            ) {
              message = `${
                document.documentTypeId?.name ||
                "Document"
              } expires in ${daysLeft} days`;
            } else {
              message = `${
                document.documentTypeId?.name ||
                "Document"
              } uploaded`;
            }

            return (
              <div
                key={document._id}
                className="flex items-start gap-3"
              >
                <div
                  className={`mt-1 ${
                    status.label === "Valid"
                      ? "text-green-500"
                      : status.label === "Expiring"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {status.icon}
                </div>

                <div>
                  <p className="text-sm text-gray-800">
                    {message}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(document.updatedAt)}
                  </p>
                </div>
              </div>
            );
          })}

          {documents.length === 0 && (
            <p className="text-sm text-gray-500">
              No activity available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>

        <div className="text-gray-400">{icon}</div>
      </div>

      <p className="text-2xl font-semibold text-gray-900 mt-2">
        {value}
      </p>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400">
        {icon}
      </div>

      <div>
        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="text-sm font-medium text-gray-800 mt-1">
          {value}
        </p>
      </div>
    </div>
  );
};

export default VendorDetail;

