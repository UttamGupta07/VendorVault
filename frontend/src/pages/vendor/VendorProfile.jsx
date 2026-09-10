import { useEffect, useState } from "react";
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
  CalendarDays,
  Loader2,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

const VendorProfile = () => {
  const { vendor, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH VENDOR PROFILE
  // ==========================================
  useEffect(() => {
    const fetchVendorProfile = async () => {
      if (authLoading) return;

      if (!vendor?._id && !vendor?.id) {
        setError("Vendor information not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const vendorId = vendor._id || vendor.id;

        const response = await axiosInstance.get(
          `/api/vendor/${vendorId}`
        );

        if (response.data.success) {
          setProfile(response.data.vendor);
        } else {
          setError(
            response.data.message || "Failed to fetch profile."
          );
        }
      } catch (error) {
        console.error(
          "Fetch vendor profile error:",
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message ||
            "Failed to fetch vendor profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProfile();
  }, [vendor, authLoading]);

  // ==========================================
  // LOADING
  // ==========================================
  if (authLoading || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={32}
            className="animate-spin text-indigo-600"
          />
          <p className="text-sm text-gray-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error || !profile) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <XCircle
            size={40}
            className="mx-auto mb-3 text-red-500"
          />

          <h2 className="text-lg font-semibold text-red-700">
            Unable to load profile
          </h2>

          <p className="mt-1 text-sm text-red-600">
            {error || "Vendor profile not found."}
          </p>
        </div>
      </div>
    );
  }

  const documents = profile.documents || {};

  // ==========================================
  // COMPLIANCE STATUS
  // ==========================================
  const complianceStatus =
    profile.complianceStatus || "COMPLIANT";

  const statusConfig = {
    COMPLIANT: {
      label: "Compliant",
      icon: CheckCircle2,
      className:
        "bg-green-50 text-green-700 border-green-200",
    },

    AT_RISK: {
      label: "At Risk",
      icon: AlertTriangle,
      className:
        "bg-yellow-50 text-yellow-700 border-yellow-200",
    },

    NON_COMPLIANT: {
      label: "Non-Compliant",
      icon: XCircle,
      className:
        "bg-red-50 text-red-700 border-red-200",
    },
  };

  const currentStatus =
    statusConfig[complianceStatus] ||
    statusConfig.COMPLIANT;

  const StatusIcon = currentStatus.icon;

  // ==========================================
  // HELPERS
  // ==========================================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ==========================================
            HEADER
        ========================================== */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your vendor information and compliance status.
          </p>
        </div>

        {/* ==========================================
            PROFILE CARD
        ========================================== */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600" />

          <div className="px-5 pb-6 md:px-8">

            {/* Profile Avatar */}
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-indigo-100 text-2xl font-bold text-indigo-600 shadow-md">
                  {getInitials(profile.name)}
                </div>

                <div className="pb-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {profile.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {profile.companyName || "Vendor"}
                  </p>
                </div>
              </div>

              {/* Compliance Badge */}
              <div
                className={`flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${currentStatus.className}`}
              >
                <StatusIcon size={17} />
                {currentStatus.label}
              </div>
            </div>

            {/* Basic Info */}
            <div className="mt-6 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-50 p-2">
                  <Mail
                    size={17}
                    className="text-indigo-600"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Email
                  </p>

                  <p className="text-sm font-medium text-gray-700">
                    {profile.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-50 p-2">
                  <Phone
                    size={17}
                    className="text-indigo-600"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Phone
                  </p>

                  <p className="text-sm font-medium text-gray-700">
                    {profile.phone || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-50 p-2">
                  <CalendarDays
                    size={17}
                    className="text-indigo-600"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Joined
                  </p>

                  <p className="text-sm font-medium text-gray-700">
                    {formatDate(profile.createdAt)}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ==========================================
            STAT CARDS
        ========================================== */}
        {/* <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <StatCard
            title="Required Documents"
            value={documents.required || 0}
            icon={FileCheck2}
            bg="bg-indigo-50"
            iconColor="text-indigo-600"
          />

          <StatCard
            title="Approved"
            value={documents.approved || 0}
            icon={CheckCircle2}
            bg="bg-green-50"
            iconColor="text-green-600"
          />

          <StatCard
            title="Expiring Soon"
            value={documents.expiringSoon || 0}
            icon={Clock}
            bg="bg-yellow-50"
            iconColor="text-yellow-600"
          />

          <StatCard
            title="Expired"
            value={documents.expired || 0}
            icon={AlertTriangle}
            bg="bg-red-50"
            iconColor="text-red-600"
          />

        </div> */}

        {/* ==========================================
            MAIN GRID
        ========================================== */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* ==========================================
              PERSONAL INFORMATION
          ========================================== */}
          <SectionCard
            icon={User}
            title="Personal Information"
          >
            <InfoItem
              label="Full Name"
              value={profile.name}
            />

            <InfoItem
              label="Email Address"
              value={profile.email}
            />

            <InfoItem
              label="Phone Number"
              value={profile.phone}
            />
          </SectionCard>

          {/* ==========================================
              COMPANY INFORMATION
          ========================================== */}
          <SectionCard
            icon={Building2}
            title="Company Information"
          >
            <InfoItem
              label="Company Name"
              value={profile.companyName}
            />

            <InfoItem
              label="Service Type"
              value={profile.serviceType?.name}
            />

            <InfoItem
              label="Service Description"
              value={
                profile.serviceType?.description ||
                "No description available"
              }
            />
          </SectionCard>

          {/* ==========================================
              COMPLIANCE
          ========================================== */}
          {/* <SectionCard
            icon={ShieldCheck}
            title="Compliance Overview"
          >
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Compliance Score
                </span>

                <span className="text-lg font-bold text-indigo-600">
                  {profile.complianceScore || 0}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all"
                  style={{
                    width: `${Math.min(
                      profile.complianceScore || 0,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <DocumentCount
                label="Submitted"
                value={documents.submitted}
              />

              <DocumentCount
                label="Approved"
                value={documents.approved}
              />

              <DocumentCount
                label="Missing"
                value={documents.missing}
              />

              <DocumentCount
                label="Rejected"
                value={documents.rejected}
              />
            </div>
          </SectionCard> */}

          {/* ==========================================
              ADDRESS
          ========================================== */}
          <SectionCard
            icon={MapPin}
            title="Business Address"
          >
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm leading-6 text-gray-700">
                {profile.address?.street && (
                  <>
                    {profile.address.street}
                    <br />
                  </>
                )}

                {profile.address?.city &&
                  `${profile.address.city}, `}

                {profile.address?.state}
                <br />

                {profile.address?.country}

                {profile.address?.pincode &&
                  ` - ${profile.address.pincode}`}
              </p>
            </div>
          </SectionCard>

        </div>

        {/* ==========================================
            DOCUMENT SUMMARY
        ========================================== */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">

          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2.5">
              <FileCheck2
                size={20}
                className="text-indigo-600"
              />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Document Summary
              </h2>

              <p className="text-xs text-gray-500">
                Current status of your compliance documents
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">

            <DocumentCount
              label="Required"
              value={documents.required}
            />

            <DocumentCount
              label="Submitted"
              value={documents.submitted}
            />

            <DocumentCount
              label="Approved"
              value={documents.approved}
            />

            <DocumentCount
              label="Missing"
              value={documents.missing}
            />

            <DocumentCount
              label="Rejected"
              value={documents.rejected}
            />

          </div>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// STAT CARD
// ==========================================
const StatCard = ({
  title,
  value,
  icon: Icon,
  bg,
  iconColor,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${bg}`}>
          <Icon size={20} className={iconColor} />
        </div>

      </div>
    </div>
  );
};

// ==========================================
// SECTION CARD
// ==========================================
const SectionCard = ({
  icon: Icon,
  title,
  children,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">

      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-indigo-50 p-2.5">
          <Icon
            size={19}
            className="text-indigo-600"
          />
        </div>

        <h2 className="font-semibold text-gray-900">
          {title}
        </h2>
      </div>

      <div className="space-y-4">
        {children}
      </div>

    </div>
  );
};

// ==========================================
// INFO ITEM
// ==========================================
const InfoItem = ({ label, value }) => {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 pb-3 last:border-0 last:pb-0">

      <span className="text-xs font-medium text-gray-400">
        {label}
      </span>

      <span className="text-sm font-medium text-gray-700">
        {value || "N/A"}
      </span>

    </div>
  );
};

// ==========================================
// DOCUMENT COUNT
// ==========================================
const DocumentCount = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">

      <p className="text-xl font-bold text-gray-900">
        {value || 0}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {label}
      </p>

    </div>
  );
};

export default VendorProfile;