import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Clock3,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
} from "lucide-react";

const SuperAdminDashboard = () => {
  return (
    <div className="min-h-screen bg-blue-50 text-slate-900">

      {/* ================= SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-slate-50 lg:block">

        {/* Logo */}
        <div className="flex h-20 items-center border-b border-slate-200 px-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Vendor<span className="text-blue-700">Vault</span>
            </h1>

            <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Compliance Platform
            </p>
          </div>
        </div>

        {/* Organization */}
        <div className="mx-4 mt-5 border border-slate-200 bg-blue-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Organization
          </p>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center bg-[#071426] text-xs font-bold text-white">
              AM
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                ABC Manufacturing
              </p>

              <p className="text-[11px] text-slate-500">
                Super Admin
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-7 px-3">

          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>

          <NavItem
            icon={<LayoutDashboard size={17} />}
            label="Dashboard"
            active
          />

          <NavItem
            icon={<Building2 size={17} />}
            label="Vendors"
          />

          <NavItem
            icon={<FileText size={17} />}
            label="Documents"
          />

          <NavItem
            icon={<AlertTriangle size={17} />}
            label="Alerts"
            badge="12"
          />

          <NavItem
            icon={<ShieldCheck size={17} />}
            label="Compliance"
          />

          <div className="my-5 border-t border-slate-200" />

          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Administration
          </p>

          <NavItem
            icon={<Users size={17} />}
            label="Users"
          />

          <NavItem
            icon={<Settings size={17} />}
            label="Settings"
          />

        </nav>

        {/* Bottom user */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
              RS
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                Rahul Sharma
              </p>

              <p className="truncate text-xs text-slate-500">
                admin@abcmfg.com
              </p>
            </div>

            <MoreHorizontal
              size={18}
              className="text-slate-500"
            />

          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}
      <main className="lg:ml-64">

        {/* Header */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-blue-50/95 px-6 backdrop-blur lg:px-8">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Wednesday, August 19, 2026
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Good evening, Rahul.
            </h2>
          </div>

          <div className="flex items-center gap-4">

            {/* Search */}
            <div className="hidden items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
              <Search
                size={16}
                className="text-slate-500"
              />

              <input
                type="text"
                placeholder="Search vendors..."
                className="w-40 bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </div>

            {/* Notification */}
            <button className="relative border border-slate-200 bg-slate-50 p-2.5">
              <Bell size={18} />

              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#DC2626] px-1 text-[9px] font-bold text-white">
                4
              </span>
            </button>

            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#071426] text-xs font-bold text-white">
              RS
            </div>

          </div>

        </header>

        {/* Content */}
        <div className="p-6 lg:p-8">

          {/* ================= PAGE TITLE ================= */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                <span>Workspace</span>
                <ChevronRight size={13} />
                <span className="font-medium text-slate-900">
                  Dashboard
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight">
                Compliance Overview
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Monitor your organization's vendor compliance health.
              </p>
            </div>

            <button className="flex items-center justify-center gap-2 bg-[#071426] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8B631F]">
              <Plus size={17} />
              Add User
            </button>

          </div>

          {/* ================= STATS ================= */}
          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Total Vendors"
              value="248"
              change="+18 this month"
              icon={<Building2 size={19} />}
              positive
            />

            <StatCard
              title="Compliant Vendors"
              value="184"
              change="74.2% of total"
              icon={<ShieldCheck size={19} />}
              positive
            />

            <StatCard
              title="Expiring Soon"
              value="32"
              change="Next 30 days"
              icon={<Clock3 size={19} />}
              warning
            />

            <StatCard
              title="Expired Documents"
              value="12"
              change="Requires attention"
              icon={<XCircle size={19} />}
              danger
            />

          </section>

          {/* ================= MAIN GRID ================= */}
          <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">

            {/* Compliance Health */}
            <div className="border border-slate-200 bg-slate-50">

              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                <div>
                  <h3 className="font-bold">
                    Compliance Health
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Organization-wide document status
                  </p>
                </div>

                <button className="text-xs font-semibold text-blue-700">
                  View report →
                </button>

              </div>

              <div className="p-6">

                <div className="grid gap-8 md:grid-cols-[180px_1fr] md:items-center">

                  {/* Score */}
                  <div className="flex flex-col items-center">

                    <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-[14px] border-slate-200">

                      <div className="absolute inset-[-14px] rounded-full border-[14px] border-[#059669] border-r-transparent border-b-transparent rotate-[-45deg]" />

                      <div className="text-center">
                        <p className="text-3xl font-bold">
                          86%
                        </p>

                        <p className="text-[10px] uppercase tracking-widest text-slate-500">
                          Healthy
                        </p>
                      </div>

                    </div>

                    <p className="mt-4 text-xs text-slate-500">
                      +4.8% from last month
                    </p>

                  </div>

                  {/* Status Bars */}
                  <div className="space-y-6">

                    <ProgressRow
                      label="Compliant"
                      value="184"
                      percentage="74%"
                      width="74%"
                      type="good"
                    />

                    <ProgressRow
                      label="Expiring within 30 days"
                      value="32"
                      percentage="13%"
                      width="13%"
                      type="warning"
                    />

                    <ProgressRow
                      label="Expired"
                      value="12"
                      percentage="5%"
                      width="5%"
                      type="danger"
                    />

                    <ProgressRow
                      label="Under review"
                      value="20"
                      percentage="8%"
                      width="8%"
                      type="neutral"
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* Alerts */}
            <div className="border border-slate-200 bg-slate-50">

              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                <div>
                  <h3 className="font-bold">
                    Attention Required
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Items requiring action
                  </p>
                </div>

                <span className="bg-[#DC2626] px-2 py-1 text-[10px] font-bold text-white">
                  12 OPEN
                </span>

              </div>

              <div className="divide-y divide-[#E2E8F0]">

                <AlertItem
                  icon={<XCircle size={17} />}
                  title="Expired documents"
                  count="12"
                  description="Documents have passed their expiry date."
                  danger
                />

                <AlertItem
                  icon={<Clock3 size={17} />}
                  title="Expiring in 7 days"
                  count="8"
                  description="Immediate vendor follow-up recommended."
                  warning
                />

                <AlertItem
                  icon={<FileText size={17} />}
                  title="Pending review"
                  count="20"
                  description="Recently uploaded documents need review."
                />

              </div>

              <div className="p-4">
                <button className="flex w-full items-center justify-center gap-2 border border-slate-200 py-2.5 text-xs font-semibold transition hover:border-[#2563EB] hover:text-blue-700">
                  View all alerts
                  <ArrowUpRight size={14} />
                </button>
              </div>

            </div>

          </section>

          {/* ================= VENDORS ================= */}
          <section className="mt-6 border border-slate-200 bg-slate-50">

            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center">

              <div>
                <h3 className="font-bold">
                  Vendor Compliance
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Recently updated vendor records
                </p>
              </div>

              <button className="flex items-center gap-1 text-xs font-semibold text-blue-700">
                View all vendors
                <ChevronRight size={14} />
              </button>

            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-slate-200 text-[10px] uppercase tracking-[0.14em] text-slate-500">

                    <th className="px-6 py-4 font-semibold">
                      Vendor
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Documents
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Compliance
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Expiring
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4" />

                  </tr>
                </thead>

                <tbody>

                  <VendorRow
                    initials="ZT"
                    name="Zenith Transport Pvt. Ltd."
                    email="contact@zenithtransport.com"
                    documents="12 / 12"
                    score="98%"
                    expiring="0"
                    status="Compliant"
                  />

                  <VendorRow
                    initials="AP"
                    name="Apex Packaging Solutions"
                    email="hello@apexpack.com"
                    documents="9 / 11"
                    score="81%"
                    expiring="2"
                    status="Expiring"
                    warning
                  />

                  <VendorRow
                    initials="NS"
                    name="Nova Security Services"
                    email="admin@novasecurity.in"
                    documents="7 / 10"
                    score="64%"
                    expiring="1"
                    status="Attention"
                    danger
                  />

                  <VendorRow
                    initials="GR"
                    name="GreenRoute Logistics"
                    email="ops@greenroute.in"
                    documents="15 / 15"
                    score="100%"
                    expiring="0"
                    status="Compliant"
                  />

                </tbody>

              </table>

            </div>

            {/* Mobile */}
            <div className="divide-y divide-[#E2E8F0] md:hidden">

              <MobileVendor
                initials="ZT"
                name="Zenith Transport"
                score="98%"
                status="Compliant"
              />

              <MobileVendor
                initials="AP"
                name="Apex Packaging"
                score="81%"
                status="Expiring"
                warning
              />

              <MobileVendor
                initials="NS"
                name="Nova Security"
                score="64%"
                status="Attention"
                danger
              />

            </div>

          </section>

          {/* ================= BOTTOM GRID ================= */}
          <section className="mt-6 grid gap-6 lg:grid-cols-2">

            {/* Recent Activity */}
            <div className="border border-slate-200 bg-slate-50">

              <div className="border-b border-slate-200 px-6 py-5">
                <h3 className="font-bold">
                  Recent Activity
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Latest actions in your organization
                </p>
              </div>

              <div className="divide-y divide-[#E2E8F0]">

                <Activity
                  icon={<FileText size={15} />}
                  title="New document uploaded"
                  user="Apex Packaging Solutions"
                  time="8 minutes ago"
                />

                <Activity
                  icon={<CheckCircle2 size={15} />}
                  title="Document approved"
                  user="Zenith Transport Pvt. Ltd."
                  time="42 minutes ago"
                />

                <Activity
                  icon={<Users size={15} />}
                  title="New Compliance Officer added"
                  user="Amit Kumar"
                  time="2 hours ago"
                />

                <Activity
                  icon={<Bell size={15} />}
                  title="Expiry reminder sent"
                  user="Nova Security Services"
                  time="3 hours ago"
                />

              </div>

            </div>

            {/* Quick Actions */}
            <div className="border border-slate-200 bg-slate-50">

              <div className="border-b border-slate-200 px-6 py-5">
                <h3 className="font-bold">
                  Quick Actions
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Frequently used administration tools
                </p>
              </div>

              <div className="grid gap-3 p-5 sm:grid-cols-2">

                <QuickAction
                  icon={<Users size={19} />}
                  title="Add User"
                  description="Officer or auditor"
                />

                <QuickAction
                  icon={<Building2 size={19} />}
                  title="View Vendors"
                  description="Manage vendor records"
                />

                <QuickAction
                  icon={<ShieldCheck size={19} />}
                  title="Compliance Policies"
                  description="Configure requirements"
                />

                <QuickAction
                  icon={<FileText size={19} />}
                  title="Export Report"
                  description="Download compliance data"
                />

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
};


// ======================================================
// COMPONENTS
// ======================================================

const NavItem = ({
  icon,
  label,
  active = false,
  badge,
}) => {
  return (
    <button
      className={`mb-1 flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-[#071426] text-white"
          : "text-slate-500 hover:bg-blue-50 hover:text-slate-900"
      }`}
    >
      {icon}

      <span className="flex-1 text-left">
        {label}
      </span>

      {badge && (
        <span className="bg-[#DC2626] px-1.5 py-0.5 text-[9px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
};


const StatCard = ({
  title,
  value,
  change,
  icon,
  positive,
  warning,
  danger,
}) => {
  let iconBg = "bg-blue-50";
  let iconColor = "text-slate-900";

  if (warning) {
    iconBg = "bg-blue-50";
    iconColor = "text-blue-700";
  }

  if (danger) {
    iconBg = "bg-blue-50";
    iconColor = "text-red-700";
  }

  return (
    <div className="border border-slate-200 bg-slate-50 p-5">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight">
            {value}
          </p>
        </div>

        <div className={`p-2.5 ${iconBg} ${iconColor}`}>
          {icon}
        </div>

      </div>

      <p
        className={`mt-4 text-xs ${
          danger
            ? "text-red-700"
            : warning
            ? "text-blue-700"
            : positive
            ? "text-emerald-700"
            : "text-slate-500"
        }`}
      >
        {change}
      </p>

    </div>
  );
};


const ProgressRow = ({
  label,
  value,
  percentage,
  width,
  type,
}) => {

  let bar = "bg-[#071426]";

  if (type === "good") {
    bar = "bg-[#059669]";
  }

  if (type === "warning") {
    bar = "bg-[#2563EB]";
  }

  if (type === "danger") {
    bar = "bg-[#DC2626]";
  }

  return (
    <div>

      <div className="mb-2 flex justify-between text-xs">

        <span className="font-medium">
          {label}
        </span>

        <span className="text-slate-500">
          {value} · {percentage}
        </span>

      </div>

      <div className="h-2 bg-[#E2E8F0]">
        <div
          className={`h-full ${bar}`}
          style={{ width }}
        />
      </div>

    </div>
  );
};


const AlertItem = ({
  icon,
  title,
  count,
  description,
  danger,
  warning,
}) => {

  const iconColor = danger
    ? "text-red-700"
    : warning
    ? "text-blue-700"
    : "text-slate-900";

  return (
    <div className="flex gap-4 px-6 py-5">

      <div className={`mt-0.5 ${iconColor}`}>
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex items-center justify-between gap-3">

          <p className="text-sm font-semibold">
            {title}
          </p>

          <span className={`text-lg font-bold ${iconColor}`}>
            {count}
          </span>

        </div>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
};


const VendorRow = ({
  initials,
  name,
  email,
  documents,
  score,
  expiring,
  status,
  warning,
  danger,
}) => {

  const statusClass = danger
    ? "bg-blue-50 text-red-700"
    : warning
    ? "bg-blue-50 text-blue-700"
    : "bg-blue-50 text-emerald-700";

  return (
    <tr className="border-b border-slate-200 last:border-0">

      <td className="px-6 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center bg-[#071426] text-[10px] font-bold text-white">
            {initials}
          </div>

          <div>
            <p className="text-sm font-semibold">
              {name}
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              {email}
            </p>
          </div>

        </div>

      </td>

      <td className="px-6 py-4 text-sm text-slate-500">
        {documents}
      </td>

      <td className="px-6 py-4">

        <span className="text-sm font-bold">
          {score}
        </span>

      </td>

      <td className="px-6 py-4 text-sm">

        <span
          className={
            expiring !== "0"
              ? "font-semibold text-blue-700"
              : "text-slate-500"
          }
        >
          {expiring}
        </span>

      </td>

      <td className="px-6 py-4">

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold ${statusClass}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {status}
        </span>

      </td>

      <td className="px-6 py-4">

        <button className="text-slate-500 hover:text-slate-900">
          <MoreHorizontal size={17} />
        </button>

      </td>

    </tr>
  );
};


const MobileVendor = ({
  initials,
  name,
  score,
  status,
  warning,
  danger,
}) => {

  const statusColor = danger
    ? "text-red-700"
    : warning
    ? "text-blue-700"
    : "text-emerald-700";

  return (
    <div className="flex items-center gap-3 px-5 py-4">

      <div className="flex h-9 w-9 items-center justify-center bg-[#071426] text-[10px] font-bold text-white">
        {initials}
      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-sm font-semibold">
          {name}
        </p>

        <p className={`mt-1 text-xs font-semibold ${statusColor}`}>
          {status}
        </p>

      </div>

      <p className="text-sm font-bold">
        {score}
      </p>

    </div>
  );
};


const Activity = ({
  icon,
  title,
  user,
  time,
}) => {
  return (
    <div className="flex gap-3 px-6 py-4">

      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center bg-blue-50 text-slate-500">
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {user}
        </p>

      </div>

      <p className="whitespace-nowrap text-[10px] text-slate-500">
        {time}
      </p>

    </div>
  );
};


const QuickAction = ({
  icon,
  title,
  description,
}) => {
  return (
    <button className="group flex items-center gap-4 border border-slate-200 bg-blue-50 p-4 text-left transition hover:border-[#2563EB]">

      <div className="bg-slate-50 p-2.5 text-slate-900 group-hover:text-blue-700">
        {icon}
      </div>

      <div>

        <p className="text-sm font-bold">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>

      </div>

    </button>
  );
};

export default SuperAdminDashboard;