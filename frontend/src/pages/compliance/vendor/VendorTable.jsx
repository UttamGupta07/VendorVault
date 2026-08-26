import React from "react";
import {
  MoreHorizontal,
  Eye,
  FileText,
} from "lucide-react";

const VendorTable = ({ vendors }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

      {/* Table Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

        <div>
          <h2 className="font-semibold text-slate-900">
            Vendor Directory
          </h2>

          <p className="mt-0.5 text-xs text-slate-400">
            Review and manage registered vendors
          </p>
        </div>

        <span className="text-xs text-slate-400">
          {vendors.length} vendors
        </span>

      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">

        <table className="w-full min-w-[950px]">

          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Vendor
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Contact
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Documents
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Compliance
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Expiring
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Updated
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                Action
              </th>

            </tr>
          </thead>

          <tbody>

            {vendors.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-5 py-12 text-center"
                >
                  <p className="text-sm font-medium text-slate-600">
                    No vendors found
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Try changing your search or filter.
                  </p>
                </td>
              </tr>
            ) : (
              vendors.map((vendor) => (
                <VendorRow
                  key={vendor.id}
                  vendor={vendor}
                />
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

const VendorRow = ({ vendor }) => {
  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">

      {/* Vendor */}
      <td className="px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
            {vendor.name.charAt(0)}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              {vendor.name}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              {vendor.code}
            </p>
          </div>

        </div>

      </td>

      {/* Contact */}
      <td className="px-5 py-4">

        <p className="text-sm text-slate-700">
          {vendor.contact}
        </p>

        <p className="mt-0.5 text-xs text-slate-400">
          {vendor.email}
        </p>

      </td>

      {/* Documents */}
      <td className="px-5 py-4">

        <div className="flex items-center gap-2">

          <FileText
            size={16}
            className="text-slate-400"
          />

          <span className="text-sm font-medium text-slate-700">
            {vendor.validDocuments}/{vendor.documents}
          </span>

        </div>

        <p className="mt-1 text-[11px] text-slate-400">
          valid documents
        </p>

      </td>

      {/* Compliance */}
      <td className="px-5 py-4">
        <ComplianceBadge
          status={vendor.status}
        />
      </td>

      {/* Expiring */}
      <td className="px-5 py-4">

        {vendor.expiring === 0 ? (
          <span className="text-sm text-slate-400">
            None
          </span>
        ) : (
          <span className="text-sm font-semibold text-amber-600">
            {vendor.expiring} document
            {vendor.expiring > 1 ? "s" : ""}
          </span>
        )}

      </td>

      {/* Updated */}
      <td className="px-5 py-4 text-sm text-slate-500">
        {vendor.updated}
      </td>

      {/* Action */}
      <td className="px-5 py-4">

        <div className="flex justify-end gap-1">

          <button
            className="
              rounded-lg
              p-2
              text-slate-400
              hover:bg-slate-100
              hover:text-indigo-600
            "
            title="View vendor"
          >
            <Eye size={17} />
          </button>

          <button
            className="
              rounded-lg
              p-2
              text-slate-400
              hover:bg-slate-100
              hover:text-slate-700
            "
          >
            <MoreHorizontal size={17} />
          </button>

        </div>

      </td>

    </tr>
  );
};

const ComplianceBadge = ({ status }) => {

  const config = {
    Compliant: {
      icon: CheckIcon,
      className: "bg-emerald-50 text-emerald-600",
    },
    Pending: {
      icon: ClockIcon,
      className: "bg-amber-50 text-amber-600",
    },
    "At Risk": {
      icon: RiskIcon,
      className: "bg-red-50 text-red-600",
    },
  };

  const current = config[status] || config.Pending;
  const Icon = current.icon;

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-2.5
        py-1
        text-xs
        font-semibold
        ${current.className}
      `}
    >
      <Icon size={13} />

      {status}
    </span>
  );
};

const CheckIcon = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const ClockIcon = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const RiskIcon = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M10.3 3.8L2.7 17a2 2 0 001.7 3h15.2a2 2 0 001.7-3L13.7 3.8a2 2 0 00-3.4 0z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

export default VendorTable;