import React, { useEffect, useState } from "react";
import {
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Truck,
    UsersRound,
    TrendingUp,
    RefreshCw,
    BarChart3,
    AlertTriangle,
} from "lucide-react";
import { getAdminReports } from "../../api/adminReportApi";

const ReportsAnalytics = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadReports = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminReports();
            setReports(data.reports);
        } catch (err) {
            console.error(err);
            setError("Failed to load reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw
                        size={28}
                        className="animate-spin text-indigo-600"
                    />
                    <p className="text-sm text-slate-500">
                        Loading reports...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-5 lg:p-8">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                    <div className="flex items-center gap-3">
                        <AlertTriangle
                            size={24}
                            className="text-red-500"
                        />
                        <div>
                            <h3 className="font-semibold text-red-700">
                                Failed to load reports
                            </h3>
                            <p className="mt-1 text-sm text-red-600">
                                {error}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={loadReports}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                        <RefreshCw size={15} />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-full overflow-x-hidden p-5 lg:p-8">

            {/* =========================
                PAGE HEADER
            ========================= */}
            <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                            <BarChart3
                                size={22}
                                className="text-purple-600"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Reports & Analytics
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Compliance and document performance overview
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={loadReports}
                    className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                    <RefreshCw size={15} />
                    Refresh
                </button>
            </section>

            {/* =========================
                DOCUMENT STATISTICS
            ========================= */}
            <section>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Document Statistics
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        Current document processing status
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Documents"
                        value={reports.totalDocuments}
                        icon={FileText}
                        bg="bg-blue-100"
                        color="text-blue-600"
                    />

                    <StatCard
                        title="Approved Documents"
                        value={reports.approvedDocuments}
                        icon={CheckCircle}
                        bg="bg-green-100"
                        color="text-green-600"
                    />

                    <StatCard
                        title="Rejected Documents"
                        value={reports.rejectedDocuments}
                        icon={XCircle}
                        bg="bg-red-100"
                        color="text-red-500"
                    />

                    <StatCard
                        title="Pending Documents"
                        value={reports.pendingDocuments}
                        icon={Clock}
                        bg="bg-orange-100"
                        color="text-orange-600"
                    />
                </div>
            </section>

            {/* =========================
                PLATFORM STATISTICS
            ========================= */}
            <section className="mt-6">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Platform Statistics
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        Current vendors and compliance team overview
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <StatCard
                        title="Total Vendors"
                        value={reports.totalVendors}
                        icon={Truck}
                        bg="bg-green-100"
                        color="text-green-600"
                    />

                    <StatCard
                        title="Compliance Officers"
                        value={reports.totalComplianceOfficers}
                        icon={UsersRound}
                        bg="bg-purple-100"
                        color="text-purple-600"
                    />
                </div>
            </section>

            {/* =========================
                APPROVAL ANALYTICS
            ========================= */}
            <section className="mt-6">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Approval Analytics
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        Document approval and rejection performance
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <RateCard
                        title="Approval Rate"
                        value={reports.approvalRate}
                        icon={TrendingUp}
                        bg="bg-green-100"
                        color="text-green-600"
                    />

                    <RateCard
                        title="Rejection Rate"
                        value={reports.rejectionRate}
                        icon={XCircle}
                        bg="bg-red-100"
                        color="text-red-500"
                    />
                </div>
            </section>
        </div>
    );
};

const StatCard = ({
    title,
    value,
    icon: Icon,
    bg,
    color,
}) => {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}
            >
                <Icon
                    size={22}
                    className={color}
                />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-500">
                {title}
            </p>

            <h3 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                {Number(value || 0).toLocaleString()}
            </h3>
        </div>
    );
};

const RateCard = ({
    title,
    value,
    icon: Icon,
    bg,
    color,
}) => {
    const percentage = Math.min(
        Math.max(Number(value || 0), 0),
        100
    );

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-4xl font-bold tracking-tight text-slate-900">
                            {percentage}%
                        </span>

                        <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${bg} ${color}`}
                        >
                            Current
                        </span>
                    </div>
                </div>

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}
                >
                    <Icon
                        size={22}
                        className={color}
                    />
                </div>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                    className={`h-full rounded-full ${color.replace(
                        "text-",
                        "bg-"
                    )} transition-all duration-500`}
                    style={{
                        width: `${percentage}%`,
                    }}
                />
            </div>

            <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>0%</span>
                <span>100%</span>
            </div>
        </div>
    );
};

export default ReportsAnalytics;