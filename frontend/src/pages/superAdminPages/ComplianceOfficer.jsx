import React from "react";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  FileText,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  Store,
  Upload,
  Users,
} from "lucide-react";

const ComplianceOfficer = () => {
  return (
    <div className="min-h-screen bg-blue-50 text-slate-900">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-blue-700">
            Compliance Operations
          </p>

          <h1 className="text-3xl font-semibold tracking-tight">
            Compliance Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor vendor documents, compliance risks and upcoming
            expiries from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          <button className="flex items-center gap-2 border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium transition hover:bg-blue-50">
            <Upload size={17} />
            Upload Document
          </button>

          <button className="flex items-center gap-2 bg-[#071426] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2563EB]">
            <Plus size={17} />
            Add Vendor
          </button>

        </div>
      </div>


      {/* =====================================================
          COMPLIANCE SCORE
      ===================================================== */}

      <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Score */}

        <div className="border border-slate-200 bg-slate-50 p-6">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Overall Compliance
              </p>

              <h2 className="mt-2 text-4xl font-semibold">
                87%
              </h2>

              <p className="mt-2 text-xs text-emerald-700">
                +4.2% from last month
              </p>
            </div>

            <div className="bg-emerald-50 p-3 text-emerald-700">
              <ShieldCheck size={23} />
            </div>

          </div>

          <div className="mt-6 h-2 bg-blue-50">
            <div
              className="h-full bg-[#059669]"
              style={{ width: "87%" }}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs text-slate-500">
            <span>Current health</span>
            <span>Target 95%</span>
          </div>

        </div>


        {/* Vendor Compliance */}

        <div className="border border-slate-200 bg-slate-50 p-6">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Compliant Vendors
              </p>

              <h2 className="mt-2 text-4xl font-semibold">
                126
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                out of 148 vendors
              </p>
            </div>

            <div className="bg-emerald-50 p-3 text-emerald-700">
              <Store size={23} />
            </div>

          </div>

          <div className="mt-6 flex items-center gap-2">

            <div className="h-2 flex-1 bg-blue-50">
              <div
                className="h-full bg-[#059669]"
                style={{ width: "85%" }}
              />
            </div>

            <span className="text-xs font-semibold">
              85%
            </span>

          </div>

        </div>


        {/* Documents */}

        <div className="border border-slate-200 bg-slate-50 p-6">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Documents
              </p>

              <h2 className="mt-2 text-4xl font-semibold">
                1,284
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Across all vendors
              </p>
            </div>

            <div className="bg-blue-50 p-3 text-blue-700">
              <FileText size={23} />
            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          ALERT STAT CARDS
      ===================================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <ComplianceStat
          title="Expired Documents"
          value="18"
          subtitle="Requires immediate action"
          icon={ShieldAlert}
          type="danger"
        />

        <ComplianceStat
          title="Expiring in 7 Days"
          value="12"
          subtitle="Reminder already scheduled"
          icon={CalendarClock}
          type="warning"
        />

        <ComplianceStat
          title="Pending Review"
          value="23"
          subtitle="Documents waiting for review"
          icon={Clock3}
          type="neutral"
        />

        <ComplianceStat
          title="Compliant Documents"
          value="1,231"
          subtitle="Valid documents"
          icon={FileCheck2}
          type="success"
        />

      </div>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* =================================================
            DOCUMENT EXPIRY
        ================================================= */}

        <div className="xl:col-span-2 border border-slate-200 bg-slate-50">

          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

            <div>
              <h2 className="font-semibold">
                Upcoming Document Expiries
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Documents requiring attention
              </p>
            </div>

            <button className="flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-700">
              View all
              <ArrowRight size={16} />
            </button>

          </div>


          <div className="divide-y divide-[#E2E8F0]">

            <ExpiryRow
              vendor="ABC Logistics Pvt. Ltd."
              document="Insurance Certificate"
              date="Aug 26, 2026"
              days="2 days"
              status="critical"
            />

            <ExpiryRow
              vendor="Sharma Enterprises"
              document="GST Certificate"
              date="Aug 28, 2026"
              days="4 days"
              status="warning"
            />

            <ExpiryRow
              vendor="TechNova Solutions"
              document="Business License"
              date="Aug 30, 2026"
              days="6 days"
              status="warning"
            />

            <ExpiryRow
              vendor="Global Supplies"
              document="ISO Certificate"
              date="Sep 02, 2026"
              days="9 days"
              status="normal"
            />

            <ExpiryRow
              vendor="Metro Packaging"
              document="Insurance Certificate"
              date="Sep 05, 2026"
              days="12 days"
              status="normal"
            />

          </div>

        </div>


        {/* =================================================
            ALERTS
        ================================================= */}

        <div className="border border-slate-200 bg-slate-50">

          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

            <div>
              <h2 className="font-semibold">
                Recent Alerts
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest compliance activity
              </p>
            </div>

            <Bell size={19} className="text-blue-700" />

          </div>


          <div className="divide-y divide-[#E2E8F0]">

            <AlertItem
              icon={ShieldAlert}
              title="Document expired"
              description="ABC Logistics — Insurance"
              time="15 min ago"
              type="danger"
            />

            <AlertItem
              icon={CalendarClock}
              title="Document expiring soon"
              description="Sharma Enterprises — GST"
              time="1 hour ago"
              type="warning"
            />

            <AlertItem
              icon={FileCheck2}
              title="Document approved"
              description="TechNova — Business License"
              time="2 hours ago"
              type="success"
            />

            <AlertItem
              icon={Upload}
              title="New document uploaded"
              description="Global Supplies — ISO"
              time="4 hours ago"
              type="neutral"
            />

          </div>


          <button className="flex w-full items-center justify-center gap-2 border-t border-slate-200 py-4 text-sm font-medium text-blue-700 hover:bg-blue-50">
            View all alerts
            <ChevronRight size={16} />
          </button>

        </div>

      </div>


      {/* =====================================================
          VENDOR OVERVIEW
      ===================================================== */}

      <div className="mt-6 border border-slate-200 bg-slate-50">

        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="font-semibold">
              Vendor Compliance Overview
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Vendors requiring your attention
            </p>
          </div>

          <div className="relative">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Search vendors..."
              className="w-full border border-slate-200 bg-blue-50 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#2563EB] md:w-64"
            />

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px]">

            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">

                <th className="px-6 py-4">
                  Vendor
                </th>

                <th className="px-6 py-4">
                  Documents
                </th>

                <th className="px-6 py-4">
                  Compliance
                </th>

                <th className="px-6 py-4">
                  Expired
                </th>

                <th className="px-6 py-4">
                  Expiring Soon
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Action
                </th>

              </tr>
            </thead>


            <tbody>

              <VendorRow
                name="ABC Logistics Pvt. Ltd."
                initials="AL"
                documents="18 / 20"
                compliance="72%"
                expired="2"
                expiring="3"
                status="At Risk"
                danger
              />

              <VendorRow
                name="Sharma Enterprises"
                initials="SE"
                documents="15 / 15"
                compliance="91%"
                expired="0"
                expiring="2"
                status="Good"
              />

              <VendorRow
                name="TechNova Solutions"
                initials="TN"
                documents="24 / 25"
                compliance="96%"
                expired="0"
                expiring="1"
                status="Excellent"
              />

              <VendorRow
                name="Global Supplies"
                initials="GS"
                documents="12 / 14"
                compliance="81%"
                expired="1"
                expiring="2"
                status="Needs Review"
              />

              <VendorRow
                name="Metro Packaging"
                initials="MP"
                documents="20 / 20"
                compliance="100%"
                expired="0"
                expiring="0"
                status="Excellent"
              />

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <div className="mt-6">

        <h2 className="mb-4 font-semibold">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <QuickAction
            icon={Plus}
            title="Add Vendor"
            description="Register a new vendor"
          />

          <QuickAction
            icon={Upload}
            title="Upload Document"
            description="Add vendor compliance document"
          />

          <QuickAction
            icon={Clock3}
            title="Review Documents"
            description="23 documents waiting"
          />

          <QuickAction
            icon={Users}
            title="View Vendors"
            description="Manage vendor records"
          />

        </div>

      </div>

    </div>
  );
};


// =========================================================
// COMPLIANCE STAT
// =========================================================

const ComplianceStat = ({
  title,
  value,
  subtitle,
  icon: Icon,
  type,
}) => {

  const styles = {

    danger: {
      box: "bg-red-50",
      icon: "text-red-700",
      value: "text-red-700",
    },

    warning: {
      box: "bg-[#EFF6FF]",
      icon: "text-blue-700",
      value: "text-blue-700",
    },

    success: {
      box: "bg-emerald-50",
      icon: "text-emerald-700",
      value: "text-emerald-700",
    },

    neutral: {
      box: "bg-blue-50",
      icon: "text-slate-900",
      value: "text-slate-900",
    },

  };

  const style = styles[type];

  return (
    <div className="border border-slate-200 bg-slate-50 p-5">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className={`mt-2 text-2xl font-semibold ${style.value}`}>
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>

        </div>

        <div className={`p-3 ${style.box} ${style.icon}`}>
          <Icon size={20} />
        </div>

      </div>

    </div>
  );
};


// =========================================================
// EXPIRY ROW
// =========================================================

const ExpiryRow = ({
  vendor,
  document,
  date,
  days,
  status,
}) => {

  const isCritical = status === "critical";

  return (
    <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-center gap-3">

        <div className="bg-blue-50 p-3 text-blue-700">
          <FileText size={19} />
        </div>

        <div>

          <p className="text-sm font-medium">
            {document}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {vendor}
          </p>

        </div>

      </div>


      <div className="flex items-center gap-6">

        <div className="text-right">

          <p className="text-xs text-slate-500">
            Expiry
          </p>

          <p className="mt-1 text-sm font-medium">
            {date}
          </p>

        </div>

        <span
          className={`whitespace-nowrap px-3 py-1 text-xs font-semibold ${
            isCritical
              ? "bg-red-50 text-red-700"
              : status === "warning"
              ? "bg-[#EFF6FF] text-blue-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {days}
        </span>

      </div>

    </div>
  );
};


// =========================================================
// ALERT ITEM
// =========================================================

const AlertItem = ({
  icon: Icon,
  title,
  description,
  time,
  type,
}) => {

  const styles = {

    danger: {
      box: "bg-red-50",
      icon: "text-red-700",
    },

    warning: {
      box: "bg-[#EFF6FF]",
      icon: "text-blue-700",
    },

    success: {
      box: "bg-emerald-50",
      icon: "text-emerald-700",
    },

    neutral: {
      box: "bg-blue-50",
      icon: "text-slate-900",
    },

  };

  const style = styles[type];

  return (
    <div className="flex gap-3 px-6 py-4">

      <div className={`h-fit p-2 ${style.box} ${style.icon}`}>
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-1 truncate text-xs text-slate-500">
          {description}
        </p>

        <p className="mt-1 text-[11px] text-slate-500">
          {time}
        </p>

      </div>

    </div>
  );
};


// =========================================================
// VENDOR ROW
// =========================================================

const VendorRow = ({
  name,
  initials,
  documents,
  compliance,
  expired,
  expiring,
  status,
  danger,
}) => {

  return (
    <tr className="border-b border-slate-200 last:border-0 hover:bg-blue-50/50">

      {/* Vendor */}

      <td className="px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center bg-[#071426] text-xs font-semibold text-white">
            {initials}
          </div>

          <span className="text-sm font-medium">
            {name}
          </span>

        </div>

      </td>


      {/* Documents */}

      <td className="px-6 py-5 text-sm text-slate-500">
        {documents}
      </td>


      {/* Compliance */}

      <td className="px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="h-1.5 w-20 bg-blue-50">

            <div
              className={`h-full ${
                danger
                  ? "bg-[#DC2626]"
                  : "bg-[#059669]"
              }`}
              style={{
                width: compliance,
              }}
            />

          </div>

          <span className="text-sm font-medium">
            {compliance}
          </span>

        </div>

      </td>


      {/* Expired */}

      <td className="px-6 py-5">

        <span
          className={`text-sm font-semibold ${
            expired !== "0"
              ? "text-red-700"
              : "text-emerald-700"
          }`}
        >
          {expired}
        </span>

      </td>


      {/* Expiring */}

      <td className="px-6 py-5">

        <span
          className={`text-sm font-semibold ${
            expiring !== "0"
              ? "text-blue-700"
              : "text-emerald-700"
          }`}
        >
          {expiring}
        </span>

      </td>


      {/* Status */}

      <td className="px-6 py-5">

        <span
          className={`whitespace-nowrap px-3 py-1 text-xs font-semibold ${
            danger
              ? "bg-red-50 text-red-700"
              : status === "Excellent"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-[#EFF6FF] text-blue-700"
          }`}
        >
          {status}
        </span>

      </td>


      {/* Action */}

      <td className="px-6 py-5">

        <button className="flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-700">
          View
          <ChevronRight size={15} />
        </button>

      </td>

    </tr>
  );
};


// =========================================================
// QUICK ACTION
// =========================================================

const QuickAction = ({
  icon: Icon,
  title,
  description,
}) => {

  return (
    <button className="group flex items-center gap-4 border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-[#2563EB] hover:bg-blue-50">

      <div className="bg-[#071426] p-3 text-white transition group-hover:bg-[#2563EB]">
        <Icon size={20} />
      </div>

      <div>

        <p className="text-sm font-semibold">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>

      </div>

    </button>
  );
};


export default ComplianceOfficer;