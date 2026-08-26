import React, { useMemo, useState } from "react";

import {
  Search,
  Plus,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Building2,
} from "lucide-react";

import VendorTable from "./vendor/VendorTable"

import AddVendorModel from "./vendor/AddVendorModel"

const ComplianceVendor = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddVendor, setShowAddVendor] = useState(false);

  // ================= VENDOR DATA =================

  const vendors = [
    {
      id: 1,
      name: "Acme Technologies Pvt. Ltd.",
      code: "VEN-001",
      contact: "Rajesh Kumar",
      email: "rajesh@acme.com",
      documents: 12,
      validDocuments: 12,
      status: "Compliant",
      risk: "Low",
      expiring: 0,
      updated: "Today",
    },
    {
      id: 2,
      name: "Global Supplies Ltd.",
      code: "VEN-002",
      contact: "Amit Sharma",
      email: "amit@globalsupplies.com",
      documents: 10,
      validDocuments: 8,
      status: "At Risk",
      risk: "High",
      expiring: 2,
      updated: "Yesterday",
    },
    {
      id: 3,
      name: "TechSource Solutions",
      code: "VEN-003",
      contact: "Priya Singh",
      email: "priya@techsource.com",
      documents: 8,
      validDocuments: 6,
      status: "Pending",
      risk: "Medium",
      expiring: 1,
      updated: "2 days ago",
    },
    {
      id: 4,
      name: "Prime Logistics",
      code: "VEN-004",
      contact: "Vikas Verma",
      email: "vikas@primelogistics.com",
      documents: 15,
      validDocuments: 15,
      status: "Compliant",
      risk: "Low",
      expiring: 0,
      updated: "3 days ago",
    },
    {
      id: 5,
      name: "SecureBuild Industries",
      code: "VEN-005",
      contact: "Neha Gupta",
      email: "neha@securebuild.com",
      documents: 9,
      validDocuments: 5,
      status: "At Risk",
      risk: "High",
      expiring: 3,
      updated: "4 days ago",
    },
  ];

  // ================= SEARCH + FILTER =================

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        vendor.name.toLowerCase().includes(searchValue) ||
        vendor.code.toLowerCase().includes(searchValue) ||
        vendor.contact.toLowerCase().includes(searchValue) ||
        vendor.email.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        vendor.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <div className="flex items-center gap-2">

            <Building2
              size={24}
              className="text-indigo-600"
            />

            <h1 className="text-2xl font-bold text-slate-900">
              Vendors
            </h1>

          </div>

          <p className="mt-1 text-sm text-slate-500">
            Monitor vendor compliance, documents and expiry risks.
          </p>
        </div>

        {/* Add Vendor Button */}

        <button
          type="button"
          onClick={() => setShowAddVendor(true)}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-indigo-600
            px-4
            py-2.5
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-indigo-700
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-500
            focus:ring-offset-2
          "
        >
          <Plus size={18} />

          Add Vendor
        </button>

      </div>

      {/* =====================================================
          TOOLBAR
      ====================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4">

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          {/* ================= SEARCH ================= */}

          <div className="relative w-full lg:max-w-md">

            <Search
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendors..."
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                py-2.5
                pl-10
                pr-4
                text-sm
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-indigo-500
                focus:bg-white
              "
            />

          </div>

          {/* ================= FILTERS ================= */}

          <div className="flex items-center gap-2">

            {/* Status Filter */}

            <div className="relative">

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="
                  appearance-none
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  py-2.5
                  pl-10
                  pr-9
                  text-sm
                  text-slate-600
                  outline-none
                  transition
                  focus:border-indigo-500
                "
              >
                <option value="All">
                  All Status
                </option>

                <option value="Compliant">
                  Compliant
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="At Risk">
                  At Risk
                </option>
              </select>

              <Filter
                size={16}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <ChevronDown
                size={15}
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

            </div>

            {/* More Filters */}

            <button
              type="button"
              className="
                rounded-xl
                border
                border-slate-200
                p-2.5
                text-slate-500
                transition
                hover:bg-slate-50
                hover:text-slate-700
              "
              title="More filters"
            >
              <SlidersHorizontal size={18} />
            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          VENDOR TABLE
      ====================================================== */}

      <VendorTable
        vendors={filteredVendors}
      />

      {/* =====================================================
          ADD VENDOR MODAL
      ====================================================== */}

      {showAddVendor && (
        <AddVendorModel
          onClose={() => setShowAddVendor(false)}
        />
      )}

    </div>
  );
};

export default ComplianceVendor;