 
import React, { useMemo, useState } from "react";
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
} from "lucide-react";

import AddVendorModel from "./vendor/AddVendorModel";

const VendorManagement = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");

  // Controls Add Vendor modal
  const [showAddVendor, setShowAddVendor] = useState(false);

  // Temporary vendor data
  // We will replace this with API data later
  const vendors = [
    {
      id: 1,
      name: "ABC Technologies Pvt Ltd",
      email: "contact@abctech.com",
      serviceType: "IT Services",
      documents: "8/8",
      compliance: 96,
      status: "Active",
    },
    {
      id: 2,
      name: "XYZ Security Solutions",
      email: "info@xyzsecurity.com",
      serviceType: "Security",
      documents: "6/8",
      compliance: 72,
      status: "Pending",
    },
    {
      id: 3,
      name: "TechCorp Solutions",
      email: "admin@techcorp.com",
      serviceType: "Consulting",
      documents: "8/8",
      compliance: 100,
      status: "Active",
    },
    {
      id: 4,
      name: "SafeGuard Services",
      email: "support@safeguard.com",
      serviceType: "Security",
      documents: "7/8",
      compliance: 84,
      status: "Review",
    },
    {
      id: 5,
      name: "Global Logistics Ltd",
      email: "contact@globallogistics.com",
      serviceType: "Logistics",
      documents: "5/7",
      compliance: 68,
      status: "Pending",
    },
  ];

  // Filter vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesSearch =
        vendor.name.toLowerCase().includes(search.toLowerCase()) ||
        vendor.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || vendor.status === statusFilter;

      const matchesService =
        serviceFilter === "All" ||
        vendor.serviceType === serviceFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesService
      );
    });
  }, [search, statusFilter, serviceFilter]);

  // Status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-200";

      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "Review":
        return "bg-orange-50 text-orange-700 border-orange-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Compliance color
  const getComplianceColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";

    return "text-red-600";
  };

  // Called after vendor is successfully created
  const handleVendorAdded = (vendor) => {
    console.log("Vendor created successfully:", vendor);

    // Later we will refetch the vendor list here
    // or add the new vendor to local state.
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Vendor Management
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage vendors and monitor their compliance status
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddVendor(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition"
        >
          <Plus size={18} />
          Add Vendor
        </button>

      </div>

      {/* ================= STATISTICS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {/* Total Vendors */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Vendors
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                128
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
                94
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
                22
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
                12
              </h2>
            </div>

            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle size={22} />
            </div>

          </div>

        </div>

      </div>

      {/* ================= FILTERS ================= */}
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
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
          </select>

          {/* Service */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">
              All Services
            </option>

            <option value="IT Services">
              IT Services
            </option>

            <option value="Security">
              Security
            </option>

            <option value="Consulting">
              Consulting
            </option>

            <option value="Logistics">
              Logistics
            </option>
          </select>

        </div>

      </div>

      {/* ================= VENDOR TABLE ================= */}
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

                filteredVendors.map((vendor) => (

                  <tr
                    key={vendor.id}
                    className="hover:bg-gray-50 transition"
                  >

                    {/* Vendor */}
                    <td className="px-6 py-4">

                      <p className="font-medium text-gray-900">
                        {vendor.name}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {vendor.email}
                      </p>

                    </td>

                    {/* Service */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {vendor.serviceType}
                    </td>

                    {/* Documents */}
                    <td className="px-6 py-4">

                      <span className="text-sm font-medium text-gray-700">
                        {vendor.documents}
                      </span>

                    </td>

                    {/* Compliance */}
                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">

                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{
                              width: `${vendor.compliance}%`,
                            }}
                          />

                        </div>

                        <span
                          className={`text-sm font-semibold ${getComplianceColor(
                            vendor.compliance
                          )}`}
                        >
                          {vendor.compliance}%
                        </span>

                      </div>

                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(
                          vendor.status
                        )}`}
                      >
                        {vendor.status}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">

                      <div className="flex justify-end">

                        <button
                          type="button"
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                        >
                          <MoreVertical size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center"
                  >
                    <p className="text-gray-500">
                      No vendors found
                    </p>
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* ================= PAGINATION ================= */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-700">
              {filteredVendors.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-700">
              128
            </span>{" "}
            vendors
          </p>

          <div className="flex items-center gap-2">

            <button
              type="button"
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              disabled
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
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
            >
              2
            </button>

            <button
              type="button"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
            >
              3
            </button>

            <button
              type="button"
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <ChevronRight size={18} />
            </button>

          </div>

        </div>

      </div>

      {/* ================= ADD VENDOR MODAL ================= */}
      {showAddVendor && (
        <AddVendorModel
          onClose={() => setShowAddVendor(false)}
          onVendorAdded={handleVendorAdded}
        />
      )}

    </div>
  );
};

export default VendorManagement;

