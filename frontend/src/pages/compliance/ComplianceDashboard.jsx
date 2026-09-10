 import React, { useEffect, useState } from "react";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Clock,
  FileWarning,
  FileCheck,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

const ComplianceDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        "/api/compliance-dashboard"
      );

      if (response.data.success) {
        setDashboard(response.data);
      }
    } catch (error) {
      console.error("Dashboard error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load compliance dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />

          <p className="mt-3 text-gray-600">
            Loading compliance dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />

          <h2 className="text-xl font-semibold mt-4">
            Unable to load dashboard
          </h2>

          <p className="text-gray-500 mt-2">
            {error}
          </p>

          <button
            onClick={fetchDashboard}
            className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats || {};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Compliance Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Monitor vendor compliance and document status
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Vendors"
          value={stats.totalVendors}
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Compliant Vendors"
          value={stats.compliantVendors}
          icon={ShieldCheck}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <StatCard
          title="Pending Reviews"
          value={stats.pendingReviews}
          icon={Clock}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />

        <StatCard
          title="Non-Compliant"
          value={stats.nonCompliantVendors}
          icon={ShieldAlert}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      {/* SECOND ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
        <StatCard
          title="Expired Documents"
          value={stats.expiredDocuments}
          icon={FileWarning}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />

        <StatCard
          title="Expiring in 30 Days"
          value={stats.expiringSoonDocuments}
          icon={AlertTriangle}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />

        <StatCard
          title="Approved Documents"
          value={stats.approvedDocuments}
          icon={FileCheck}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <StatCard
          title="Rejected Documents"
          value={stats.rejectedDocuments}
          icon={XCircle}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      {/* COMPLIANCE OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900">
            Overall Compliance
          </h2>

          <div className="flex items-center justify-center py-8">
            <div className="relative w-40 h-40">
              <div className="w-40 h-40 rounded-full border-[14px] border-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.overallCompliance}%
                  </p>

                  <p className="text-xs text-gray-500">
                    Overall
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <ProgressRow
              label="Compliant"
              value={stats.compliantVendors}
              total={stats.totalVendors}
            />

            <ProgressRow
              label="Warning"
              value={stats.warningVendors}
              total={stats.totalVendors}
            />

            <ProgressRow
              label="Non-Compliant"
              value={stats.nonCompliantVendors}
              total={stats.totalVendors}
            />
          </div>
        </div>

        {/* VENDORS NEEDING ATTENTION */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-gray-900">
                Vendors Requiring Attention
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Vendors with incomplete or problematic compliance
              </p>
            </div>
          </div>

          {dashboard.attentionVendors?.length === 0 ? (
            <div className="py-10 text-center">
              <ShieldCheck className="w-10 h-10 text-green-500 mx-auto" />

              <p className="mt-3 text-gray-600">
                All vendors are compliant
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {dashboard.attentionVendors.map((vendor) => (
                <div
                  key={vendor.vendorId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {vendor.vendorName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {vendor.email}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {vendor.complianceScore}%
                    </p>

                    <StatusBadge status={vendor.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RECENT DOCUMENTS */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-6">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            Recent Document Activity
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Latest vendor document submissions
          </p>
        </div>

        {dashboard.recentDocuments?.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No document activity yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Vendor
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Document
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Extraction
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {dashboard.recentDocuments.map((doc) => (
                  <tr
                    key={doc._id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {doc.vendorName}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {doc.documentName}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge
                        status={doc.status}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {doc.extractionStatus || "N/A"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {doc.createdAt
                        ? new Date(
                            doc.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};


// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="text-2xl font-bold text-gray-900 mt-2">
            {value ?? 0}
          </p>
        </div>

        <div
          className={`w-11 h-11 rounded-lg flex items-center justify-center ${iconBg}`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};


// ======================================================
// PROGRESS ROW
// ======================================================

const ProgressRow = ({
  label,
  value,
  total,
}) => {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">
          {label}
        </span>

        <span className="font-medium text-gray-900">
          {value}
        </span>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};


// ======================================================
// STATUS BADGE
// ======================================================

const StatusBadge = ({ status }) => {
  const normalized =
    status?.toLowerCase();

  let classes =
    "bg-gray-100 text-gray-600";

  if (
    normalized === "compliant" ||
    normalized === "approved"
  ) {
    classes =
      "bg-green-100 text-green-700";
  }

  if (
    normalized === "warning" ||
    normalized === "pending"
  ) {
    classes =
      "bg-yellow-100 text-yellow-700";
  }

  if (
    normalized === "non-compliant" ||
    normalized === "rejected" ||
    normalized === "expired"
  ) {
    classes =
      "bg-red-100 text-red-700";
  }

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${classes}`}
    >
      {status || "Unknown"}
    </span>
  );
};

export default ComplianceDashboard;