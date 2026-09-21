
import {
  FileText,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

const ExpiryDocumentCard = ({ document, onRenew }) => {
  const expiryDate = document?.expiryDate
    ? new Date(document.expiryDate)
    : null;

  const today = new Date();

  const daysLeft = expiryDate
    ? Math.ceil(
        (expiryDate - today) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const isExpired =
    expiryDate && expiryDate < today;

  const isUrgent =
    !isExpired &&
    daysLeft !== null &&
    daysLeft <= 7;

  const isSoon =
    !isExpired &&
    daysLeft !== null &&
    daysLeft <= 30;

  const getStatus = () => {
    if (isExpired) {
      return {
        text: "Expired",
        className:
          "bg-red-50 text-red-600 border-red-100",
        icon: AlertTriangle,
      };
    }

    if (isUrgent) {
      return {
        text: "Urgent",
        className:
          "bg-orange-50 text-orange-600 border-orange-100",
        icon: AlertTriangle,
      };
    }

    if (isSoon) {
      return {
        text: "Expiring Soon",
        className:
          "bg-amber-50 text-amber-600 border-amber-100",
        icon: CalendarDays,
      };
    }

    return {
      text: "Valid",
      className:
        "bg-emerald-50 text-emerald-600 border-emerald-100",
      icon: CheckCircle2,
    };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* DOCUMENT INFO */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <FileText size={20} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-800">
              {document?.documentTypeId?.name ||
                document?.documentType?.name ||
                document?.originalFileName ||
                "Document"}
            </h3>

            {document?.originalFileName && (
              <p className="mt-0.5 truncate text-xs text-slate-400">
                {document.originalFileName}
              </p>
            )}
          </div>
        </div>

        {/* EXPIRY INFO */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div>
            <p className="text-[11px] font-medium text-slate-400">
              Expiry Date
            </p>

            <div className="mt-1 flex items-center gap-1.5">
              <CalendarDays
                size={14}
                className="text-slate-400"
              />

              <span className="text-sm font-semibold text-slate-700">
                {expiryDate
                  ? expiryDate.toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "No expiry date"}
              </span>
            </div>
          </div>

          {/* STATUS */}
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}
          >
            <StatusIcon size={13} />
            {status.text}
          </div>

          {/* DAYS LEFT */}
          {expiryDate && (
            <div className="min-w-[75px]">
              <p className="text-[11px] font-medium text-slate-400">
                {isExpired ? "Status" : "Time Left"}
              </p>

              <p
                className={`mt-1 text-sm font-bold ${
                  isExpired
                    ? "text-red-600"
                    : daysLeft <= 7
                    ? "text-orange-600"
                    : "text-slate-700"
                }`}
              >
                {isExpired
                  ? "Expired"
                  : `${daysLeft} day${
                      daysLeft !== 1 ? "s" : ""
                    }`}
              </p>
            </div>
          )}

          {/* RENEW BUTTON */}
          {(isExpired || isSoon) && (
            <button
              type="button"
              onClick={() => onRenew?.(document)}
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                bg-indigo-600
                px-3
                py-2
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-indigo-700
              "
            >
              <RefreshCw size={14} />
              Renew
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpiryDocumentCard;