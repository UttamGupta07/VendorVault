import React, { useEffect, useState } from "react";

import {
    Users,
    UserCheck,
    FileCheck2,
    CheckCircle2,
    XCircle,
    Clock3,
    ArrowRight,
    RefreshCw,
    Activity,
    ShieldCheck,
} from "lucide-react";

import { getComplianceTeam } from "../../api/complianceTeamApi";

const ComplianceTeam = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedOfficer, setSelectedOfficer] =
        useState(null);

    const loadTeam = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await getComplianceTeam();

            if (response?.success) {
                setData(response.data);
            }
        } catch (err) {
            console.error(
                "Compliance team loading error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Failed to load compliance team."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTeam();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="text-center">
                    <RefreshCw
                        size={30}
                        className="mx-auto animate-spin text-indigo-600"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                        Loading compliance team...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <div className="flex items-center gap-3">
                    <XCircle
                        className="text-red-600"
                        size={22}
                    />

                    <div>
                        <p className="font-semibold text-red-800">
                            Unable to load compliance team
                        </p>

                        <p className="mt-1 text-sm text-red-600">
                            {error}
                        </p>
                    </div>
                </div>

                <button
                    onClick={loadTeam}
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const overview = data?.overview || {};
    const team = data?.team || [];
    const activities = data?.activities || [];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

                <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                        Team Performance
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight">
                        Compliance Team
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm text-slate-500">
                        Monitor Compliance Officers,
                        their verification work and
                        document review activity.
                    </p>
                </div>

                <button
                    onClick={loadTeam}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>
            </div>

            {/* ==========================================
                OVERVIEW CARDS
            ========================================== */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <OverviewCard
                    title="Total Officers"
                    value={overview.totalOfficers || 0}
                    icon={Users}
                    iconClass="bg-indigo-50 text-indigo-600"
                />

                <OverviewCard
                    title="Active Officers"
                    value={overview.activeOfficers || 0}
                    icon={UserCheck}
                    iconClass="bg-emerald-50 text-emerald-600"
                />

                <OverviewCard
                    title="Documents Reviewed"
                    value={overview.totalReviewed || 0}
                    icon={FileCheck2}
                    iconClass="bg-blue-50 text-blue-600"
                />

                <OverviewCard
                    title="Approved / Rejected"
                    value={`${overview.totalApproved || 0} / ${
                        overview.totalRejected || 0
                    }`}
                    icon={ShieldCheck}
                    iconClass="bg-violet-50 text-violet-600"
                />

            </div>

            {/* ==========================================
                OFFICER CARDS
            ========================================== */}

            <div className="mb-8">

                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Compliance Officers
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Select an officer to view complete
                            performance and activity.
                        </p>
                    </div>
                </div>

                {team.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                        <Users
                            size={38}
                            className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 font-semibold text-slate-700">
                            No Compliance Officers found
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                        {team.map((officer) => (
                            <OfficerCard
                                key={officer._id}
                                officer={officer}
                                onClick={() =>
                                    setSelectedOfficer(
                                        officer
                                    )
                                }
                            />
                        ))}

                    </div>
                )}
            </div>

            {/* ==========================================
                RECENT ACTIVITY
            ========================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                    <div>
                        <h2 className="font-bold text-slate-900">
                            Recent Team Activity
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Latest document review actions
                        </p>
                    </div>

                    <Activity
                        size={20}
                        className="text-indigo-600"
                    />
                </div>

                <div className="divide-y divide-slate-100">

                    {activities.length === 0 ? (
                        <div className="p-10 text-center">
                            <Clock3
                                size={30}
                                className="mx-auto text-slate-300"
                            />

                            <p className="mt-2 text-sm text-slate-500">
                                No review activity yet.
                            </p>
                        </div>
                    ) : (
                        activities.slice(0, 10).map(
                            (activity) => (
                                <ActivityRow
                                    key={
                                        activity._id
                                    }
                                    activity={
                                        activity
                                    }
                                />
                            )
                        )
                    )}

                </div>
            </div>

            {/* ==========================================
                OFFICER DETAIL MODAL
            ========================================== */}

            {selectedOfficer && (
                <OfficerDetails
                    officer={selectedOfficer}
                    activities={activities}
                    onClose={() =>
                        setSelectedOfficer(null)
                    }
                />
            )}

        </div>
    );
};

const OverviewCard = ({
    title,
    value,
    icon: Icon,
    iconClass,
}) => {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {value}
                    </p>
                </div>

                <div
                    className={`rounded-xl p-3 ${iconClass}`}
                >
                    <Icon size={21} />
                </div>

            </div>
        </div>
    );
};

const OfficerCard = ({
    officer,
    onClick,
}) => {
    const stats = officer.stats || {};

    return (
        <button
            onClick={onClick}
            className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
        >

            <div className="flex items-start justify-between">

                <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
                        {officer.name
                            ?.charAt(0)
                            ?.toUpperCase() || "C"}
                    </div>

                    <div>
                        <h3 className="font-bold text-slate-900">
                            {officer.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                            {officer.email}
                        </p>
                    </div>

                </div>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        officer.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                    }`}
                >
                    {officer.isActive
                        ? "Active"
                        : "Inactive"}
                </span>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

                <MiniStat
                    label="Vendors"
                    value={
                        stats.vendorsVerified || 0
                    }
                />

                <MiniStat
                    label="Reviewed"
                    value={
                        stats.totalReviewed || 0
                    }
                />

                <MiniStat
                    label="Approved"
                    value={
                        stats.approved || 0
                    }
                />

                <MiniStat
                    label="Rejected"
                    value={
                        stats.rejected || 0
                    }
                />

            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                <span className="text-xs text-slate-400">
                    Last activity:{" "}
                    {formatDate(
                        stats.lastActivityAt
                    )}
                </span>

                <span className="flex items-center gap-1 text-sm font-semibold text-indigo-600 transition group-hover:gap-2">
                    View Details
                    <ArrowRight size={16} />
                </span>

            </div>

        </button>
    );
};

const MiniStat = ({
    label,
    value,
}) => {
    return (
        <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] font-medium text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-lg font-bold text-slate-800">
                {value}
            </p>
        </div>
    );
};

const ActivityRow = ({
    activity,
}) => {
    const approved =
        activity.status === "APPROVED";

    return (
        <div className="flex items-center gap-4 px-6 py-4">

            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    approved
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-600"
                }`}
            >
                {approved ? (
                    <CheckCircle2 size={18} />
                ) : (
                    <XCircle size={18} />
                )}
            </div>

            <div className="min-w-0 flex-1">

                <p className="text-sm font-semibold text-slate-800">
                    {activity.reviewedBy?.name ||
                        "Compliance Officer"}{" "}
                    <span className="font-normal text-slate-500">
                        {approved
                            ? "approved"
                            : "rejected"}{" "}
                        a document
                    </span>
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                    {activity.originalFileName}
                    {" • "}
                    {activity.vendorId
                        ?.companyName ||
                        activity.vendorId
                            ?.name ||
                        "Vendor"}
                </p>

            </div>

            <span className="whitespace-nowrap text-xs text-slate-400">
                {formatDate(
                    activity.reviewedAt
                )}
            </span>

        </div>
    );
};

const OfficerDetails = ({
    officer,
    activities,
    onClose,
}) => {
    const stats = officer.stats || {};

    const officerActivities =
        activities.filter(
            (activity) =>
                activity.reviewedBy?._id ===
                officer._id
        );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
            onClick={onClose}
        >
            <div
                onClick={(event) =>
                    event.stopPropagation()
                }
                className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                    <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
                            {officer.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {officer.name}
                            </h2>

                            <p className="text-sm text-slate-500">
                                {officer.email}
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        ✕
                    </button>

                </div>

                <div className="max-h-[calc(90vh-90px)] overflow-y-auto p-6">

                    {/* SUMMARY */}

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                        <DetailStat
                            title="Vendors Verified"
                            value={
                                stats.vendorsVerified ||
                                0
                            }
                            icon={Users}
                        />

                        <DetailStat
                            title="Documents Reviewed"
                            value={
                                stats.totalReviewed ||
                                0
                            }
                            icon={FileCheck2}
                        />

                        <DetailStat
                            title="Approved"
                            value={
                                stats.approved || 0
                            }
                            icon={CheckCircle2}
                        />

                        <DetailStat
                            title="Rejected"
                            value={
                                stats.rejected || 0
                            }
                            icon={XCircle}
                        />

                    </div>

                    {/* ACTIVITY */}

                    <div className="mt-8">

                        <div className="mb-4">
                            <h3 className="font-bold text-slate-900">
                                Review Activity
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                Documents reviewed by this
                                Compliance Officer
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-slate-200">

                            {officerActivities.length ===
                            0 ? (
                                <div className="p-8 text-center text-sm text-slate-500">
                                    No review activity found.
                                </div>
                            ) : (
                                officerActivities.map(
                                    (activity) => (
                                        <ActivityRow
                                            key={
                                                activity._id
                                            }
                                            activity={
                                                activity
                                            }
                                        />
                                    )
                                )
                            )}

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

const DetailStat = ({
    title,
    value,
    icon: Icon,
}) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

            <Icon
                size={19}
                className="text-indigo-600"
            />

            <p className="mt-3 text-xs text-slate-500">
                {title}
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
                {value}
            </p>

        </div>
    );
};

const formatDate = (date) => {
    if (!date) return "No activity";

    return new Date(date).toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
};

export default ComplianceTeam;