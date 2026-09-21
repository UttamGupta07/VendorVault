 import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

import {
    Activity,
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    FileCheck2,
    FileText,
    RefreshCw,
    Search,
    ShieldCheck,
    User,
    UserPlus,
    Users,
    Upload,
    XCircle,
} from "lucide-react";

const AuditLogs = () => {
    // =====================================================
    // STATE
    // =====================================================

    const [logs, setLogs] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [action, setAction] = useState("ALL");

    const [actorType, setActorType] = useState("ALL");

    const [dateRange, setDateRange] = useState("ALL");

    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalLogs: 0,
        limit: 10,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    // =====================================================
    // ACTION CONFIGURATION
    // =====================================================

    const actionConfig = {
        VENDOR_CREATED: {
            label: "Vendor Created",
            icon: UserPlus,
            className:
                "bg-blue-50 text-blue-700 border-blue-200",
        },

        DOCUMENT_UPLOADED: {
            label: "Document Uploaded",
            icon: Upload,
            className:
                "bg-green-50 text-green-700 border-green-200",
        },

        DOCUMENT_REPLACED: {
            label: "Document Replaced",
            icon: RefreshCw,
            className:
                "bg-indigo-50 text-indigo-700 border-indigo-200",
        },

        DOCUMENT_APPROVED: {
            label: "Document Approved",
            icon: CheckCircle2,
            className:
                "bg-emerald-50 text-emerald-700 border-emerald-200",
        },

        DOCUMENT_REJECTED: {
            label: "Document Rejected",
            icon: XCircle,
            className:
                "bg-red-50 text-red-700 border-red-200",
        },

        DOCUMENT_EXTRACTION_RETRIED: {
            label: "Extraction Retried",
            icon: RefreshCw,
            className:
                "bg-orange-50 text-orange-700 border-orange-200",
        },
    };

    // =====================================================
    // GET ACTION CONFIG
    // =====================================================

    const getActionConfig = (actionName) => {
        if (actionConfig[actionName]) {
            return actionConfig[actionName];
        }

        return {
            label: actionName
                ? actionName
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) =>
                          char.toUpperCase()
                      )
                : "Activity",

            icon: Activity,

            className:
                "bg-slate-50 text-slate-700 border-slate-200",
        };
    };

    // =====================================================
    // FETCH COMPLIANCE AUDIT LOGS
    // =====================================================

    const fetchAuditLogs = async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const params = {
                page,
                limit: 10,
                search: search.trim(),
                action,
                actorType,
                dateRange,
            };

            const response = await axiosInstance.get(
                "/api/admin/activity-logs/compliance-audit-logs",
                {
                    params,
                }
            );

            if (response.data?.success) {
                setLogs(response.data.data || []);

                setPagination(
                    response.data.pagination || {
                        currentPage: 1,
                        totalPages: 1,
                        totalLogs: 0,
                        limit: 10,
                        hasNextPage: false,
                        hasPreviousPage: false,
                    }
                );
            } else {
                setLogs([]);

                setError(
                    response.data?.message ||
                        "Failed to fetch audit logs."
                );
            }
        } catch (err) {
            console.error(
                "Fetch compliance audit logs error:",
                err
            );

            setLogs([]);

            setError(
                err.response?.data?.message ||
                    "Unable to load audit logs. Please try again."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // =====================================================
    // FETCH ON FILTER / PAGE CHANGE
    // =====================================================

    useEffect(() => {
        fetchAuditLogs();
    }, [page, action, actorType, dateRange]);

    // =====================================================
    // SEARCH DEBOUNCE
    // =====================================================

    useEffect(() => {
        const timer = setTimeout(() => {
            if (page !== 1) {
                setPage(1);
            } else {
                fetchAuditLogs();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // =====================================================
    // RESET FILTERS
    // =====================================================

    const resetFilters = () => {
        setSearch("");
        setAction("ALL");
        setActorType("ALL");
        setDateRange("ALL");
        setPage(1);
    };

    // =====================================================
    // ACTOR NAME
    // =====================================================

    const getActorName = (log) => {
        if (!log.actor) {
            return "Unknown";
        }

        return (
            log.actor.name ||
            log.actor.companyName ||
            "Unknown"
        );
    };

    // =====================================================
    // ACTOR EMAIL
    // =====================================================

    const getActorEmail = (log) => {
        return log.actor?.email || "";
    };

    // =====================================================
    // ACTOR ROLE
    // =====================================================

    const getActorRole = (log) => {
        if (log.actorType === "VENDOR") {
            return "Vendor";
        }

        if (log.actor?.role === "COMPLIANCE_OFFICER") {
            return "Compliance Officer";
        }

        return "Compliance Staff";
    };

    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // =====================================================
    // TIME FORMAT
    // =====================================================

    const formatTime = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // =====================================================
    // TARGET LABEL
    // =====================================================

    const getTargetLabel = (log) => {
        if (!log.targetType) {
            return "Activity";
        }

        return log.targetType;
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">

                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                                <Activity size={22} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Audit Logs
                                </h1>

                                <p className="mt-0.5 text-sm text-slate-500">
                                    Track compliance activities and
                                    vendor actions
                                </p>
                            </div>

                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            fetchAuditLogs(true)
                        }
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>
                </div>

                {/* =================================================
                    INFORMATION BANNER
                ================================================== */}

                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <ShieldCheck size={18} />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-800">
                            Compliance Activity
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            This page displays activities performed
                            by Compliance Officers and vendors.
                            Super Admin activities are not shown.
                        </p>
                    </div>
                </div>

                {/* =================================================
                    STAT CARDS
                ================================================== */}

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                    {/* Total */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Total Activities
                                </p>

                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {pagination.totalLogs || 0}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                                <Activity size={20} />
                            </div>

                        </div>
                    </div>

                    {/* Approvals */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Approvals
                                </p>

                                <p className="mt-2 text-2xl font-bold text-emerald-600">
                                    {
                                        logs.filter(
                                            (log) =>
                                                log.action ===
                                                "DOCUMENT_APPROVED"
                                        ).length
                                    }
                                </p>
                            </div>

                            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                                <CheckCircle2 size={20} />
                            </div>

                        </div>
                    </div>

                    {/* Rejections */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Rejections
                                </p>

                                <p className="mt-2 text-2xl font-bold text-red-600">
                                    {
                                        logs.filter(
                                            (log) =>
                                                log.action ===
                                                "DOCUMENT_REJECTED"
                                        ).length
                                    }
                                </p>
                            </div>

                            <div className="rounded-xl bg-red-50 p-3 text-red-600">
                                <XCircle size={20} />
                            </div>

                        </div>
                    </div>
                </div>

                {/* =================================================
                    FILTERS
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

                        {/* Search */}
                        <div className="relative">

                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search activity..."
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                            />
                        </div>

                        {/* Action */}
                        <select
                            value={action}
                            onChange={(e) => {
                                setAction(
                                    e.target.value
                                );
                                setPage(1);
                            }}
                            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                        >
                            <option value="ALL">
                                All Actions
                            </option>

                            <option value="VENDOR_CREATED">
                                Vendor Created
                            </option>

                            <option value="DOCUMENT_UPLOADED">
                                Document Uploaded
                            </option>

                            <option value="DOCUMENT_REPLACED">
                                Document Replaced
                            </option>

                            <option value="DOCUMENT_APPROVED">
                                Document Approved
                            </option>

                            <option value="DOCUMENT_REJECTED">
                                Document Rejected
                            </option>

                            <option value="DOCUMENT_EXTRACTION_RETRIED">
                                Extraction Retried
                            </option>
                        </select>

                        {/* Actor */}
                        <select
                            value={actorType}
                            onChange={(e) => {
                                setActorType(
                                    e.target.value
                                );
                                setPage(1);
                            }}
                            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                        >
                            <option value="ALL">
                                All Actors
                            </option>

                            <option value="USER">
                                Compliance Officers
                            </option>

                            <option value="VENDOR">
                                Vendors
                            </option>
                        </select>

                        {/* Date */}
                        <select
                            value={dateRange}
                            onChange={(e) => {
                                setDateRange(
                                    e.target.value
                                );
                                setPage(1);
                            }}
                            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                        >
                            <option value="ALL">
                                All Time
                            </option>

                            <option value="TODAY">
                                Today
                            </option>

                            <option value="7_DAYS">
                                Last 7 Days
                            </option>

                            <option value="30_DAYS">
                                Last 30 Days
                            </option>
                        </select>
                    </div>

                    {/* Clear filters */}
                    {(search ||
                        action !== "ALL" ||
                        actorType !== "ALL" ||
                        dateRange !== "ALL") && (
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

                            <p className="text-xs text-slate-500">
                                Filters are currently applied
                            </p>

                            <button
                                type="button"
                                onClick={resetFilters}
                                className="text-sm font-medium text-slate-700 transition hover:text-slate-900 hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>

                {/* =================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

                        <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0 text-red-600"
                        />

                        <div>
                            <p className="font-medium text-red-800">
                                Unable to load audit logs
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* =================================================
                    AUDIT LOG TABLE
                ================================================== */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* Table Header */}
                    <div className="border-b border-slate-200 px-5 py-4">

                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    Activity History
                                </h2>

                                <p className="text-xs text-slate-500">
                                    {pagination.totalLogs || 0}{" "}
                                    total activities
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <ShieldCheck size={15} />

                                Compliance audit activity
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        LOADING
                    ================================================== */}

                    {loading ? (
                        <div className="divide-y divide-slate-100">

                            {[1, 2, 3, 4, 5].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="animate-pulse p-5"
                                    >
                                        <div className="flex gap-4">

                                            <div className="h-10 w-10 rounded-xl bg-slate-100" />

                                            <div className="flex-1">

                                                <div className="h-4 w-40 rounded bg-slate-100" />

                                                <div className="mt-2 h-3 w-64 rounded bg-slate-100" />

                                                <div className="mt-3 h-3 w-32 rounded bg-slate-100" />
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : logs.length === 0 ? (
                        /* =================================================
                            EMPTY STATE
                        ================================================== */

                        <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

                            <div className="mb-4 rounded-2xl bg-slate-100 p-4 text-slate-500">
                                <FileText size={30} />
                            </div>

                            <h3 className="text-lg font-semibold text-slate-900">
                                No audit logs found
                            </h3>

                            <p className="mt-1 max-w-md text-sm text-slate-500">
                                There are no compliance activities
                                matching your current filters.
                            </p>

                            {(search ||
                                action !== "ALL" ||
                                actorType !== "ALL" ||
                                dateRange !== "ALL") && (
                                <button
                                    type="button"
                                    onClick={
                                        resetFilters
                                    }
                                    className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* =================================================
                                DESKTOP TABLE
                            ================================================== */}

                            <div className="hidden overflow-x-auto lg:block">

                                <table className="w-full">

                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/70 text-left">

                                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Activity
                                            </th>

                                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Performed By
                                            </th>

                                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Target
                                            </th>

                                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Date & Time
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">

                                        {logs.map((log) => {
                                            const config =
                                                getActionConfig(
                                                    log.action
                                                );

                                            const Icon =
                                                config.icon;

                                            return (
                                                <tr
                                                    key={
                                                        log._id
                                                    }
                                                    className="transition hover:bg-slate-50/70"
                                                >
                                                    {/* Activity */}
                                                    <td className="px-5 py-4">

                                                        <div className="flex items-start gap-3">

                                                            <div
                                                                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${config.className}`}
                                                            >
                                                                <Icon
                                                                    size={
                                                                        18
                                                                    }
                                                                />
                                                            </div>

                                                            <div className="min-w-0">

                                                                <div
                                                                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}
                                                                >
                                                                    {
                                                                        config.label
                                                                    }
                                                                </div>

                                                                <p className="mt-2 max-w-md text-sm font-medium text-slate-800">
                                                                    {
                                                                        log.description
                                                                    }
                                                                </p>

                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Actor */}
                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center gap-3">

                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">

                                                                {log.actorType ===
                                                                "VENDOR" ? (
                                                                    <Users
                                                                        size={
                                                                            17
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <User
                                                                        size={
                                                                            17
                                                                        }
                                                                    />
                                                                )}

                                                            </div>

                                                            <div className="min-w-0">

                                                                <p className="truncate text-sm font-medium text-slate-800">
                                                                    {getActorName(
                                                                        log
                                                                    )}
                                                                </p>

                                                                <p className="truncate text-xs text-slate-500">
                                                                    {getActorRole(
                                                                        log
                                                                    )}
                                                                </p>

                                                                {getActorEmail(
                                                                    log
                                                                ) && (
                                                                    <p className="mt-0.5 max-w-[200px] truncate text-[11px] text-slate-400">
                                                                        {getActorEmail(
                                                                            log
                                                                        )}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Target */}
                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center gap-2">

                                                            <FileCheck2
                                                                size={
                                                                    16
                                                                }
                                                                className="text-slate-400"
                                                            />

                                                            <div>

                                                                <p className="text-sm font-medium text-slate-700">
                                                                    {getTargetLabel(
                                                                        log
                                                                    )}
                                                                </p>

                                                                {log
                                                                    .metadata
                                                                    ?.fileName && (
                                                                    <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-500">
                                                                        {
                                                                            log
                                                                                .metadata
                                                                                .fileName
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Date */}
                                                    <td className="whitespace-nowrap px-5 py-4">

                                                        <div className="flex items-start gap-2">

                                                            <Clock3
                                                                size={
                                                                    15
                                                                }
                                                                className="mt-0.5 text-slate-400"
                                                            />

                                                            <div>

                                                                <p className="text-sm font-medium text-slate-700">
                                                                    {formatDate(
                                                                        log.createdAt
                                                                    )}
                                                                </p>

                                                                <p className="text-xs text-slate-500">
                                                                    {formatTime(
                                                                        log.createdAt
                                                                    )}
                                                                </p>

                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* =================================================
                                MOBILE / TABLET
                            ================================================== */}

                            <div className="divide-y divide-slate-100 lg:hidden">

                                {logs.map((log) => {
                                    const config =
                                        getActionConfig(
                                            log.action
                                        );

                                    const Icon =
                                        config.icon;

                                    return (
                                        <div
                                            key={log._id}
                                            className="p-5"
                                        >
                                            <div className="flex gap-3">

                                                <div
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${config.className}`}
                                                >
                                                    <Icon size={18} />
                                                </div>

                                                <div className="min-w-0 flex-1">

                                                    <div className="flex flex-wrap items-center gap-2">

                                                        <span
                                                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}
                                                        >
                                                            {
                                                                config.label
                                                            }
                                                        </span>

                                                        <span className="text-xs text-slate-400">
                                                            {
                                                                log.targetType
                                                            }
                                                        </span>

                                                    </div>

                                                    <p className="mt-2 text-sm font-medium text-slate-800">
                                                        {
                                                            log.description
                                                        }
                                                    </p>

                                                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

                                                        {/* Actor */}
                                                        <div className="flex items-center gap-2">

                                                            {log.actorType ===
                                                            "VENDOR" ? (
                                                                <Users
                                                                    size={
                                                                        15
                                                                    }
                                                                    className="text-slate-400"
                                                                />
                                                            ) : (
                                                                <User
                                                                    size={
                                                                        15
                                                                    }
                                                                    className="text-slate-400"
                                                                />
                                                            )}

                                                            <div className="min-w-0">

                                                                <p className="truncate text-xs font-medium text-slate-700">
                                                                    {getActorName(
                                                                        log
                                                                    )}
                                                                </p>

                                                                <p className="text-[11px] text-slate-500">
                                                                    {getActorRole(
                                                                        log
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Date */}
                                                        <div className="flex items-center gap-2">

                                                            <CalendarDays
                                                                size={
                                                                    15
                                                                }
                                                                className="text-slate-400"
                                                            />

                                                            <div>

                                                                <p className="text-xs font-medium text-slate-700">
                                                                    {formatDate(
                                                                        log.createdAt
                                                                    )}
                                                                </p>

                                                                <p className="text-[11px] text-slate-500">
                                                                    {formatTime(
                                                                        log.createdAt
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* File */}
                                                    {log.metadata
                                                        ?.fileName && (
                                                        <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">

                                                            <p className="truncate text-xs text-slate-500">
                                                                File:{" "}
                                                                <span className="font-medium text-slate-700">
                                                                    {
                                                                        log
                                                                            .metadata
                                                                            .fileName
                                                                    }
                                                                </span>
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* =================================================
                        PAGINATION
                    ================================================== */}

                    {!loading &&
                        logs.length > 0 &&
                        pagination.totalPages > 0 && (
                            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                                <p className="text-sm text-slate-500">

                                    Page{" "}
                                    <span className="font-medium text-slate-700">
                                        {
                                            pagination.currentPage
                                        }
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium text-slate-700">
                                        {
                                            pagination.totalPages
                                        }
                                    </span>
                                </p>

                                <div className="flex items-center gap-2">

                                    <button
                                        type="button"
                                        disabled={
                                            !pagination.hasPreviousPage
                                        }
                                        onClick={() =>
                                            setPage(
                                                (
                                                    previous
                                                ) =>
                                                    Math.max(
                                                        previous -
                                                            1,
                                                        1
                                                    )
                                            )
                                        }
                                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronLeft
                                            size={16}
                                        />

                                        Previous
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            !pagination.hasNextPage
                                        }
                                        onClick={() =>
                                            setPage(
                                                (
                                                    previous
                                                ) =>
                                                    previous +
                                                    1
                                            )
                                        }
                                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Next

                                        <ChevronRight
                                            size={16}
                                        />
                                    </button>
                                </div>
                            </div>
                        )}
                </div>

                {/* =================================================
                    FOOTER
                ================================================== */}

                <div className="mt-4 flex items-center gap-2 px-1 text-xs text-slate-400">

                    <ShieldCheck size={14} />

                    <span>
                        Audit logs are organization-specific and
                        record compliance-related activities.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;