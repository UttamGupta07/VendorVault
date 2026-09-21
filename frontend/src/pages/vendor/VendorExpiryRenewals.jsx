import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Clock3,
  AlertTriangle,
  FileCheck2,
  XCircle,
  RefreshCw,
  Search,
} from "lucide-react";

import {
  getVendorExpiryDocuments,
} from "../../api/vendorExpiryApi";
import ExpiryDocumentCard from "../../Component/vendor/ExpiryDocumentCard";
import { useNavigate } from "react-router-dom";

const VendorExpiryRenewals = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getVendorExpiryDocuments();

      if (response?.success) {
        setDocuments(
          response.documents ||
            response.data?.documents ||
            []
        );
      } else {
        setError(
          response?.message ||
            "Failed to load documents"
        );
      }
    } catch (err) {
      console.error(
        "Expiry documents error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load expiry documents"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  /* =========================
     DOCUMENT STATUS
  ========================= */

  const getDocumentStatus = (document) => {
    if (!document?.expiryDate) {
      return "NO_EXPIRY";
    }

    const today = new Date();
    const expiryDate = new Date(
      document.expiryDate
    );

    const daysLeft = Math.ceil(
      (expiryDate - today) /
        (1000 * 60 * 60 * 24)
    );

    if (daysLeft < 0) {
      return "EXPIRED";
    }

    if (daysLeft <= 7) {
      return "URGENT";
    }

    if (daysLeft <= 30) {
      return "SOON";
    }

    return "VALID";
  };

  /* =========================
     STATISTICS
  ========================= */

  const stats = useMemo(() => {
    const result = {
      total: documents.length,
      expired: 0,
      urgent: 0,
      soon: 0,
      valid: 0,
    };

    documents.forEach((document) => {
      const status =
        getDocumentStatus(document);

      if (status === "EXPIRED") {
        result.expired++;
      }

      if (status === "URGENT") {
        result.urgent++;
      }

      if (status === "SOON") {
        result.soon++;
      }

      if (status === "VALID") {
        result.valid++;
      }
    });

    return result;
  }, [documents]);

  /* =========================
     FILTER DOCUMENTS
  ========================= */

  const filteredDocuments = useMemo(() => {
    return documents
      .filter((document) => {
        const status =
          getDocumentStatus(document);

        if (filter === "ALL") {
          return true;
        }

        if (filter === "EXPIRING") {
          return (
            status === "URGENT" ||
            status === "SOON"
          );
        }

        if (filter === "EXPIRED") {
          return status === "EXPIRED";
        }

        if (filter === "VALID") {
          return status === "VALID";
        }

        return true;
      })
      .filter((document) => {
        if (!search.trim()) {
          return true;
        }

        const searchText =
          search.toLowerCase();

        const documentName =
          document?.documentTypeId?.name ||
          document?.documentType?.name ||
          document?.originalFileName ||
          "";

        return documentName
          .toLowerCase()
          .includes(searchText);
      })
      .sort((a, b) => {
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;

        return (
          new Date(a.expiryDate) -
          new Date(b.expiryDate)
        );
      });
  }, [documents, filter, search]);

  /* =========================
     RENEW
  ========================= */

  const handleRenew = (document) => {
  navigate("/vendor/documents");
  console.log(document);
    // Later:
    // navigate(`/vendor/documents/renew/${document._id}`);
  };

  return (
    <div className="min-h-[calc(100vh-84px)] bg-slate-50 p-5 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Clock3 size={17} />
                </div>

                <span className="text-sm font-medium text-slate-500">
                  Document Management
                </span>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Expiry & Renewals
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Track your document expiry dates and
                renew documents before they expire.
              </p>
            </div>

            <button
              type="button"
              onClick={loadDocuments}
              disabled={loading}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-semibold
                text-slate-700
                shadow-sm
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <RefreshCw
                size={16}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
            <AlertTriangle
              size={19}
              className="shrink-0 text-red-500"
            />

            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* STATS */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={FileCheck2}
            title="Total Documents"
            value={stats.total}
            iconClass="bg-indigo-50 text-indigo-600"
          />

          <StatCard
            icon={AlertTriangle}
            title="Expiring Soon"
            value={stats.urgent + stats.soon}
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            icon={XCircle}
            title="Expired"
            value={stats.expired}
            iconClass="bg-red-50 text-red-600"
          />

          <StatCard
            icon={Clock3}
            title="Valid"
            value={stats.valid}
            iconClass="bg-emerald-50 text-emerald-600"
          />
        </div>

        {/* FILTER SECTION */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* SEARCH */}
            <div className="relative w-full lg:max-w-sm">
              <Search
                size={17}
                className="
                  pointer-events-none
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
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search documents..."
                className="
                  h-10
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  pl-10
                  pr-3
                  text-sm
                  text-slate-700
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-indigo-500
                  focus:ring-2
                  focus:ring-indigo-500/10
                "
              />
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={filter === "ALL"}
                onClick={() => setFilter("ALL")}
              >
                All
              </FilterButton>

              <FilterButton
                active={filter === "EXPIRING"}
                onClick={() =>
                  setFilter("EXPIRING")
                }
              >
                Expiring Soon
              </FilterButton>

              <FilterButton
                active={filter === "EXPIRED"}
                onClick={() =>
                  setFilter("EXPIRED")
                }
              >
                Expired
              </FilterButton>

              <FilterButton
                active={filter === "VALID"}
                onClick={() =>
                  setFilter("VALID")
                }
              >
                Valid
              </FilterButton>
            </div>
          </div>
        </div>

        {/* DOCUMENT LIST */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Documents
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {filteredDocuments.length} document
                {filteredDocuments.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>
          </div>

          {loading ? (
            <LoadingState />
          ) : filteredDocuments.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map(
                (document) => (
                  <ExpiryDocumentCard
                    key={document._id}
                    document={document}
                    onRenew={handleRenew}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================
   STAT CARD
========================= */

const StatCard = ({
  icon: Icon,
  title,
  value,
  iconClass,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={20} />
        </div>

        <div>
          <p className="text-xs font-medium text-slate-400">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================
   FILTER BUTTON
========================= */

const FilterButton = ({
  active,
  onClick,
  children,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-lg
        px-3
        py-2
        text-xs
        font-semibold
        transition
        ${
          active
            ? "bg-indigo-600 text-white"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }
      `}
    >
      {children}
    </button>
  );
};

/* =========================
   LOADING
========================= */

const LoadingState = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white"
        />
      ))}
    </div>
  );
};

/* =========================
   EMPTY STATE
========================= */

const EmptyState = ({ filter }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <FileCheck2 size={25} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-800">
        No documents found
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
        {filter === "EXPIRED"
          ? "You don't have any expired documents."
          : filter === "EXPIRING"
          ? "You don't have any documents expiring soon."
          : "No documents are available."}
      </p>
    </div>
  );
};

export default VendorExpiryRenewals;