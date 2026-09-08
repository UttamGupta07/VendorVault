
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddVendorModel from "./vendor/AddVendorModel";
import {
  Search,
  Plus,
  Building2,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const VendorManagement = () => {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showAddVendor, setShowAddVendor] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/api/vendor");

      if (response.data.success) {
        setVendors(response.data.vendors);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);

      setError(
        error.response?.data?.message || "Failed to load vendors"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter((vendor) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      vendor.name?.toLowerCase().includes(searchText) ||
      vendor.companyName?.toLowerCase().includes(searchText) ||
      vendor.email?.toLowerCase().includes(searchText) ||
      vendor.serviceType?.name?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" ||
      vendor.complianceStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusDetails = (status) => {
    switch (status) {
      case "COMPLIANT":
        return {
          label: "Compliant",
          className: "bg-green-50 text-green-700",
          icon: <CheckCircle size={15} />,
        };

      case "AT_RISK":
        return {
          label: "At Risk",
          className: "bg-yellow-50 text-yellow-700",
          icon: <AlertTriangle size={15} />,
        };

      case "NON_COMPLIANT":
        return {
          label: "Non-Compliant",
          className: "bg-red-50 text-red-700",
          icon: <XCircle size={15} />,
        };

      default:
        return {
          label: "Unknown",
          className: "bg-gray-50 text-gray-600",
          icon: null,
        };
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading vendors...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Vendor Management
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor vendor compliance
          </p>
        </div>

        <button
          onClick={() => setShowAddVendor(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
        >
          <Plus size={18} />
          Add Vendor
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-4 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white outline-none"
        >
          <option value="ALL">All Status</option>
          <option value="COMPLIANT">Compliant</option>
          <option value="AT_RISK">At Risk</option>
          <option value="NON_COMPLIANT">Non-Compliant</option>
        </select>
      </div>

      {/* Vendor Count */}
      <div className="mb-4 text-sm text-gray-500">
        Showing {filteredVendors.length} of {vendors.length} vendors
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Vendor
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Service Type
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Documents
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Compliance Score
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredVendors.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Building2
                        size={32}
                        className="text-gray-300"
                      />

                      <p className="font-medium">
                        No vendors found
                      </p>

                      <p className="text-sm">
                        Try changing your search or filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => {
                  const status = getStatusDetails(
                    vendor.complianceStatus
                  );

                  return (
                    <tr
                      key={vendor._id}
                      onClick={() =>
                        navigate(
                          `/compliance/vendors/${vendor._id}`
                        )
                      }
                      className="cursor-pointer hover:bg-gray-50 transition"
                    >
                      {/* Vendor */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Building2
                              size={19}
                              className="text-gray-500"
                            />
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {vendor.companyName}
                            </p>

                            <p className="text-sm text-gray-500">
                              {vendor.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Service Type */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {vendor.serviceType?.name || "N/A"}
                        </span>
                      </td>

                      {/* Documents */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText
                            size={17}
                            className="text-gray-400"
                          />

                          <span className="text-sm font-medium text-gray-700">
                            {vendor.documents?.submitted || 0}/
                            {vendor.documents?.required || 0}
                          </span>
                        </div>

                        {vendor.documents?.missing > 0 && (
                          <p className="text-xs text-red-500 mt-1">
                            {vendor.documents.missing} missing
                          </p>
                        )}
                      </td>

                      {/* Compliance Score */}
                      <td className="px-6 py-4">
                        <span
                          className={`font-semibold ${getScoreColor(
                            vendor.complianceScore
                          )}`}
                        >
                          {vendor.complianceScore}%
                        </span>
                      </td>

                      {/* Compliance Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showAddVendor && (
  <AddVendorModel
    onClose={() => setShowAddVendor(false)}
    onVendorAdded={() => {
      setShowAddVendor(false);
      fetchVendors();
    }}
  />
)}
    </div>
  );
};

export default VendorManagement;

