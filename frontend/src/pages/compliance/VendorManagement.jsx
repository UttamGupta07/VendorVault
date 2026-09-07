
import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  Plus,
  MoreVertical,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import AddVendorModel from "./vendor/AddVendorModel";

const VendorManagement = () => {
  // ============================================================
  // STATE
  // ============================================================

  const [vendors, setVendors] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [serviceFilter, setServiceFilter] = useState("All");

  const [showAddVendor, setShowAddVendor] = useState(false);

  // ============================================================
  // FETCH VENDORS
  // ============================================================

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/vendor/auth",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch vendors"
        );
      }

      setVendors(data.vendors || []);
    } catch (error) {
      console.error(
        "Failed to fetch vendors:",
        error
      );

      setError(
        error.message || "Failed to load vendors"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL FETCH
  // ============================================================

  useEffect(() => {
    fetchVendors();
  }, []);

  // ============================================================
  // SERVICE TYPES
  // ============================================================

  const serviceTypes = useMemo(() => {
    const services = vendors
      .map((vendor) => vendor.serviceType?.name)
      .filter(Boolean);

    return [...new Set(services)];
  }, [vendors]);

  // ============================================================
  // FILTERED VENDORS
  // ============================================================

  const filteredVendors = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    return vendors.filter((vendor) => {
      const vendorName =
        vendor.companyName ||
        vendor.name ||
        "";

      const vendorEmail =
        vendor.email || "";

      const serviceName =
        vendor.serviceType?.name || "";

      const matchesSearch =
        vendorName
          .toLowerCase()
          .includes(searchValue) ||
        vendorEmail
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        vendor.complianceStatus ===
          statusFilter;

      const matchesService =
        serviceFilter === "All" ||
        serviceName === serviceFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesService
      );
    });
  }, [
    vendors,
    search,
    statusFilter,
    serviceFilter,
  ]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalVendors = vendors.length;

  const compliantVendors = vendors.filter(
    (vendor) =>
      vendor.complianceScore >= 90
  ).length;

  const pendingVendors = vendors.filter(
    (vendor) =>
      vendor.complianceStatus ===
        "Pending" ||
      vendor.complianceStatus ===
        "Review"
  ).length;

  const expiringVendors = vendors.filter(
    (vendor) =>
      (vendor.expiringSoon || 0) > 0 ||
      (vendor.expired || 0) > 0
  ).length;

  // ============================================================
  // STATUS STYLE
  // ============================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-200";

      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "Review":
        return "bg-orange-50 text-orange-700 border-orange-200";

      case "Expiring":
        return "bg-red-50 text-red-700 border-red-200";

      case "Suspended":
        return "bg-red-50 text-red-700 border-red-200";

      case "Inactive":
        return "bg-gray-50 text-gray-700 border-gray-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // ============================================================
  // COMPLIANCE COLOR
  // ============================================================

  const getComplianceColor = (score) => {
    if (score >= 90) {
      return "text-green-600";
    }

    if (score >= 75) {
      return "text-yellow-600";
    }

    return "text-red-600";
  };

  // ============================================================
  // HANDLE VENDOR ADDED
  // ============================================================

  const handleVendorAdded = async (vendor) => {
    console.log(
      "Vendor created successfully:",
      vendor
    );

    setShowAddVendor(false);

    // Fetch fresh vendor data
    await fetchVendors();
  };

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center py-32">

          <div className="flex flex-col items-center gap-3">

            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="text-sm text-gray-500">
              Loading vendors...
            </p>

          </div>

        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Vendor Management
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage vendors and monitor their
            compliance status
          </p>
        </div>

        <div className="flex gap-3">

          {/* Refresh */}

          <button
            type="button"
            onClick={fetchVendors}
            disabled={loading}
            className="flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          {/* Add Vendor */}

          <button
            type="button"
            onClick={() =>
              setShowAddVendor(true)
            }
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition"
          >
            <Plus size={18} />

            Add Vendor
          </button>

        </div>

      </div>

      {/* ========================================================
          ERROR
      ======================================================== */}

      {error && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">

          <div className="flex items-center gap-3">

            <AlertCircle size={18} />

            <span>{error}</span>

          </div>

          <button
            type="button"
            onClick={fetchVendors}
            className="font-medium underline hover:no-underline"
          >
            Retry
          </button>

        </div>
      )}

      {/* ========================================================
          STATISTICS
      ======================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {/* Total Vendors */}

        <div className="bg-white border border-gray-200 rounded-xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Total Vendors
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {totalVendors}
              </h2>

            </div>

            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <FileText size={22} />
            </div>

          </div>

        </div>

        {/* Compliant */}

        <div className="bg-white border border-gray-200 rounded-xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Compliant
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {compliantVendors}
              </h2>

            </div>

            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle size={22} />
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

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {pendingVendors}
              </h2>

            </div>

            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
              <Clock size={22} />
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

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {expiringVendors}
              </h2>

            </div>

            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle size={22} />
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================
          FILTERS
      ======================================================== */}

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">

        <div className="flex flex-col lg:flex-row gap-3">

          {/* Search */}

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search vendors by name or email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          </div>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border border-gray-200 rounded-lg px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >

            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Review">
              Review
            </option>

            <option value="Expiring">
              Expiring
            </option>

            <option value="Suspended">
              Suspended
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>

          {/* Service Type */}

          <select
            value={serviceFilter}
            onChange={(e) =>
              setServiceFilter(e.target.value)
            }
            className="border border-gray-200 rounded-lg px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >

            <option value="All">
              All Services
            </option>

            {serviceTypes.map((service) => (
              <option
                key={service}
                value={service}
              >
                {service}
              </option>
            ))}

          </select>

        </div>

      </div>

      {/* ========================================================
          VENDOR TABLE
      ======================================================== */}

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
                  Compliance
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>

                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredVendors.length > 0 ? (

                filteredVendors.map((vendor) => {

                  const complianceScore =
                    vendor.complianceScore || 0;

                  const uploadedDocuments =
                    vendor.documents?.uploaded || 0;

                  const requiredDocuments =
                    vendor.documents?.required || 0;

                  return (
                    <tr
                      key={vendor.id}
                      className="hover:bg-gray-50 transition"
                    >

                      {/* =================================================
                          VENDOR
                      ================================================= */}

                      <td className="px-6 py-4">

                        <div>

                          <p className="font-medium text-gray-900">
                            {vendor.companyName ||
                              vendor.name ||
                              "Unnamed Vendor"}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {vendor.email ||
                              "No email"}
                          </p>

                        </div>

                      </td>

                      {/* =================================================
                          SERVICE TYPE
                      ================================================= */}

                      <td className="px-6 py-4 text-sm text-gray-700">

                        {vendor.serviceType?.name ||
                          "Not Assigned"}

                      </td>

                      {/* =================================================
                          DOCUMENTS
                      ================================================= */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2">

                          <FileText
                            size={16}
                            className="text-gray-400"
                          />

                          <span className="text-sm font-medium text-gray-700">
                            {uploadedDocuments}/
                            {requiredDocuments}
                          </span>

                        </div>

                        {vendor.documents
                          ?.missing > 0 && (
                          <p className="text-xs text-red-500 mt-1">
                            {
                              vendor.documents
                                .missing
                            }{" "}
                            missing
                          </p>
                        )}

                      </td>

                      {/* =================================================
                          COMPLIANCE
                      ================================================= */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">

                            <div
                              className="h-full bg-blue-600 rounded-full transition-all"
                              style={{
                                width: `${Math.min(
                                  Math.max(
                                    complianceScore,
                                    0
                                  ),
                                  100
                                )}%`,
                              }}
                            />

                          </div>

                          <span
                            className={`text-sm font-semibold ${getComplianceColor(
                              complianceScore
                            )}`}
                          >
                            {complianceScore}%
                          </span>

                        </div>

                      </td>

                      {/* =================================================
                          STATUS
                      ================================================= */}

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(
                            vendor.complianceStatus
                          )}`}
                        >
                          {vendor.complianceStatus ||
                            "Unknown"}
                        </span>

                      </td>

                      {/* =================================================
                          ACTIONS
                      ================================================= */}

                      <td className="px-6 py-4">

                        <div className="flex justify-end">

                          <button
                            type="button"
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition"
                          >
                            <MoreVertical
                              size={18}
                            />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <FileText
                        size={42}
                        className="text-gray-300 mb-3"
                      />

                      <p className="text-gray-600 font-medium">
                        No vendors found
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try changing your search
                        or filters.
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* ========================================================
            PAGINATION
        ======================================================== */}

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">

          <p className="text-sm text-gray-500">

            Showing{" "}

            <span className="font-medium text-gray-700">
              {filteredVendors.length}
            </span>{" "}

            of{" "}

            <span className="font-medium text-gray-700">
              {totalVendors}
            </span>{" "}

            vendors

          </p>

          <div className="flex items-center gap-2">

            <button
              type="button"
              disabled
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              1
            </button>

            <button
              type="button"
              disabled
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>

          </div>

        </div>

      </div>

      {/* ========================================================
          ADD VENDOR MODAL
      ======================================================== */}

      {showAddVendor && (
        <AddVendorModel
          onClose={() =>
            setShowAddVendor(false)
          }
          onVendorAdded={
            handleVendorAdded
          }
        />
      )}

    </div>
  );
};

export default VendorManagement;
