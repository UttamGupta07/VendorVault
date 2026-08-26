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
    <div className="min-h-screen bg-[#EDEAE0] text-[#1C2B3A]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-[#A8792C]">
            Compliance Operations
          </p>

          <h1 className="text-3xl font-semibold tracking-tight">
            Compliance Dashboard
          </h1>

          <p className="mt-2 text-sm text-[#54636F]">
            Monitor vendor documents, compliance risks and upcoming
            expiries from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          <button className="flex items-center gap-2 border border-[#C9C2AE] bg-[#F5F3EB] px-4 py-3 text-sm font-medium transition hover:bg-[#EDEAE0]">
            <Upload size={17} />
            Upload Document
          </button>

          <button className="flex items-center gap-2 bg-[#1C2B3A] px-4 py-3 text-sm font-semibold text-[#F5F3EB] transition hover:bg-[#A8792C]">
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

        <div className="border border-[#C9C2AE] bg-[#F5F3EB] p-6">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-[#54636F]">
                Overall Compliance
              </p>

              <h2 className="mt-2 text-4xl font-semibold">
                87%
              </h2>

              <p className="mt-2 text-xs text-[#33604F]">
                +4.2% from last month
              </p>
            </div>

            <div className="bg-[#DCE8E1] p-3 text-[#33604F]">
              <ShieldCheck size={23} />
            </div>

          </div>

          <div className="mt-6 h-2 bg-[#EDEAE0]">
            <div
              className="h-full bg-[#33604F]"
              style={{ width: "87%" }}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs text-[#54636F]">
            <span>Current health</span>
            <span>Target 95%</span>
          </div>

        </div>


        {/* Vendor Compliance */}

        <div className="border border-[#C9C2AE] bg-[#F5F3EB] p-6">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-[#54636F]">
                Compliant Vendors
              </p>

              <h2 className="mt-2 text-4xl font-semibold">
                126
              </h2>

              <p className="mt-2 text-xs text-[#54636F]">
                out of 148 vendors
              </p>
            </div>

            <div className="bg-[#DCE8E1] p-3 text-[#33604F]">
              <Store size={23} />
            </div>

          </div>

          <div className="mt-6 flex items-center gap-2">

            <div className="h-2 flex-1 bg-[#EDEAE0]">
              <div
                className="h-full bg-[#33604F]"
                style={{ width: "85%" }}
              />
            </div>

            <span className="text-xs font-semibold">
              85%
            </span>

          </div>

        </div>


        {/* Documents */}

        <div className="border border-[#C9C2AE] bg-[#F5F3EB] p-6">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-[#54636F]">
                Total Documents
              </p>

              <h2 className="mt-2 text-4xl font-semibold">
                1,284
              </h2>

              <p className="mt-2 text-xs text-[#54636F]">
                Across all vendors
              </p>
            </div>

            <div className="bg-[#EDEAE0] p-3 text-[#A8792C]">
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

        <div className="xl:col-span-2 border border-[#C9C2AE] bg-[#F5F3EB]">

          <div className="flex items-center justify-between border-b border-[#C9C2AE] px-6 py-5">

            <div>
              <h2 className="font-semibold">
                Upcoming Document Expiries
              </h2>

              <p className="mt-1 text-xs text-[#54636F]">
                Documents requiring attention
              </p>
            </div>

            <button className="flex items-center gap-1 text-sm font-medium text-[#A8792C] hover:text-[#8B631F]">
              View all
              <ArrowRight size={16} />
            </button>

          </div>


          <div className="divide-y divide-[#C9C2AE]">

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

        <div className="border border-[#C9C2AE] bg-[#F5F3EB]">

          <div className="flex items-center justify-between border-b border-[#C9C2AE] px-6 py-5">

            <div>
              <h2 className="font-semibold">
                Recent Alerts
              </h2>

              <p className="mt-1 text-xs text-[#54636F]">
                Latest compliance activity
              </p>
            </div>

            <Bell size={19} className="text-[#A8792C]" />

          </div>


          <div className="divide-y divide-[#C9C2AE]">

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


          <button className="flex w-full items-center justify-center gap-2 border-t border-[#C9C2AE] py-4 text-sm font-medium text-[#A8792C] hover:bg-[#EDEAE0]">
            View all alerts
            <ChevronRight size={16} />
          </button>

        </div>

      </div>


      {/* =====================================================
          VENDOR OVERVIEW
      ===================================================== */}

      <div className="mt-6 border border-[#C9C2AE] bg-[#F5F3EB]">

        <div className="flex flex-col gap-4 border-b border-[#C9C2AE] px-6 py-5 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="font-semibold">
              Vendor Compliance Overview
            </h2>

            <p className="mt-1 text-xs text-[#54636F]">
              Vendors requiring your attention
            </p>
          </div>

          <div className="relative">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#54636F]"
            />

            <input
              type="text"
              placeholder="Search vendors..."
              className="w-full border border-[#C9C2AE] bg-[#EDEAE0] py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#A8792C] md:w-64"
            />

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px]">

            <thead>
              <tr className="border-b border-[#C9C2AE] text-left text-xs uppercase tracking-wider text-[#54636F]">

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
      box: "bg-[#F0DDD7]",
      icon: "text-[#A6402B]",
      value: "text-[#A6402B]",
    },

    warning: {
      box: "bg-[#EEE5D2]",
      icon: "text-[#A8792C]",
      value: "text-[#8B631F]",
    },

    success: {
      box: "bg-[#DCE8E1]",
      icon: "text-[#33604F]",
      value: "text-[#33604F]",
    },

    neutral: {
      box: "bg-[#EDEAE0]",
      icon: "text-[#1C2B3A]",
      value: "text-[#1C2B3A]",
    },

  };

  const style = styles[type];

  return (
    <div className="border border-[#C9C2AE] bg-[#F5F3EB] p-5">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-[#54636F]">
            {title}
          </p>

          <p className={`mt-2 text-2xl font-semibold ${style.value}`}>
            {value}
          </p>

          <p className="mt-1 text-xs text-[#54636F]">
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

        <div className="bg-[#EDEAE0] p-3 text-[#A8792C]">
          <FileText size={19} />
        </div>

        <div>

          <p className="text-sm font-medium">
            {document}
          </p>

          <p className="mt-1 text-xs text-[#54636F]">
            {vendor}
          </p>

        </div>

      </div>


      <div className="flex items-center gap-6">

        <div className="text-right">

          <p className="text-xs text-[#54636F]">
            Expiry
          </p>

          <p className="mt-1 text-sm font-medium">
            {date}
          </p>

        </div>

        <span
          className={`whitespace-nowrap px-3 py-1 text-xs font-semibold ${
            isCritical
              ? "bg-[#F0DDD7] text-[#A6402B]"
              : status === "warning"
              ? "bg-[#EEE5D2] text-[#8B631F]"
              : "bg-[#DCE8E1] text-[#33604F]"
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
      box: "bg-[#F0DDD7]",
      icon: "text-[#A6402B]",
    },

    warning: {
      box: "bg-[#EEE5D2]",
      icon: "text-[#A8792C]",
    },

    success: {
      box: "bg-[#DCE8E1]",
      icon: "text-[#33604F]",
    },

    neutral: {
      box: "bg-[#EDEAE0]",
      icon: "text-[#1C2B3A]",
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

        <p className="mt-1 truncate text-xs text-[#54636F]">
          {description}
        </p>

        <p className="mt-1 text-[11px] text-[#54636F]">
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
    <tr className="border-b border-[#C9C2AE] last:border-0 hover:bg-[#EDEAE0]/50">

      {/* Vendor */}

      <td className="px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center bg-[#1C2B3A] text-xs font-semibold text-[#F5F3EB]">
            {initials}
          </div>

          <span className="text-sm font-medium">
            {name}
          </span>

        </div>

      </td>


      {/* Documents */}

      <td className="px-6 py-5 text-sm text-[#54636F]">
        {documents}
      </td>


      {/* Compliance */}

      <td className="px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="h-1.5 w-20 bg-[#EDEAE0]">

            <div
              className={`h-full ${
                danger
                  ? "bg-[#A6402B]"
                  : "bg-[#33604F]"
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
              ? "text-[#A6402B]"
              : "text-[#33604F]"
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
              ? "text-[#A8792C]"
              : "text-[#33604F]"
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
              ? "bg-[#F0DDD7] text-[#A6402B]"
              : status === "Excellent"
              ? "bg-[#DCE8E1] text-[#33604F]"
              : "bg-[#EEE5D2] text-[#8B631F]"
          }`}
        >
          {status}
        </span>

      </td>


      {/* Action */}

      <td className="px-6 py-5">

        <button className="flex items-center gap-1 text-sm font-medium text-[#A8792C] hover:text-[#8B631F]">
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
    <button className="group flex items-center gap-4 border border-[#C9C2AE] bg-[#F5F3EB] p-5 text-left transition hover:border-[#A8792C] hover:bg-[#EDEAE0]">

      <div className="bg-[#1C2B3A] p-3 text-[#F5F3EB] transition group-hover:bg-[#A8792C]">
        <Icon size={20} />
      </div>

      <div>

        <p className="text-sm font-semibold">
          {title}
        </p>

        <p className="mt-1 text-xs text-[#54636F]">
          {description}
        </p>

      </div>

    </button>
  );
};


export default ComplianceOfficer;