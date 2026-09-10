import React, { useEffect, useState } from "react";
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
            <div className="p-6">
                <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                <p className="mt-4 text-gray-500">Loading reports...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                <p className="mt-4 text-red-500">{error}</p>

                <button
                    onClick={loadReports}
                    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Reports & Analytics
                </h1>
                <p className="text-gray-500">
                    Platform-wide compliance and document statistics
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Documents"
                    value={reports.totalDocuments}
                />

                <StatCard
                    title="Approved Documents"
                    value={reports.approvedDocuments}
                />

                <StatCard
                    title="Rejected Documents"
                    value={reports.rejectedDocuments}
                />

                <StatCard
                    title="Pending Documents"
                    value={reports.pendingDocuments}
                />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <StatCard
                    title="Total Vendors"
                    value={reports.totalVendors}
                />

                <StatCard
                    title="Compliance Officers"
                    value={reports.totalComplianceOfficers}
                />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <RateCard
                    title="Approval Rate"
                    value={reports.approvalRate}
                />

                <RateCard
                    title="Rejection Rate"
                    value={reports.rejectionRate}
                />
            </div>
        </div>
    );
};

const StatCard = ({ title, value }) => {
    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>
            <h2 className="mt-2 text-3xl font-bold">{value}</h2>
        </div>
    );
};

const RateCard = ({ title, value }) => {
    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>

            <div className="mt-3 flex items-center gap-4">
                <div className="text-4xl font-bold">{value}%</div>

                <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${value}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReportsAnalytics;