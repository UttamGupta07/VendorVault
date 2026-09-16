import { useEffect, useState } from "react";

import {
    Activity,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Search,
} from "lucide-react";

import { getAuditLogs } from "../../api/auditLogApi";

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [action, setAction] = useState("");

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });

    const fetchAuditLogs = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAuditLogs({
                page,
                limit: 20,
                action,
                search,
            });

            setLogs(data.logs || []);

            setPagination(
                data.pagination || {
                    page: 1,
                    limit: 20,
                    total: 0,
                    totalPages: 0,
                }
            );
        } catch (error) {
            console.error("Failed to fetch audit logs:", error);

            setError(
                error.response?.data?.message ||
                    "Failed to load audit logs"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuditLogs();
    }, [page, action, search]);

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleString();
    };

    const getActionStyle = (actionName) => {
        if (!actionName) {
            return "bg-gray-100 text-gray-700";
        }

        const value = actionName.toUpperCase();

        if (
            value.includes("DELETE") ||
            value.includes("REJECT") ||
            value.includes("FAIL")
        ) {
            return "bg-red-100 text-red-700";
        }

        if (
            value.includes("CREATE") ||
            value.includes("ADD") ||
            value.includes("APPROVE")
        ) {
            return "bg-green-100 text-green-700";
        }

        if (
            value.includes("UPDATE") ||
            value.includes("EDIT")
        ) {
            return "bg-blue-100 text-blue-700";
        }

        return "bg-purple-100 text-purple-700";
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
        setPage(1);
    };

    const handleActionChange = (event) => {
        setAction(event.target.value);
        setPage(1);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-full">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-100 rounded-xl">
                            <Activity
                                size={24}
                                className="text-purple-600"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Audit Logs
                            </h1>

                            <p className="text-sm text-gray-500 mt-1">
                                Monitor important activities performed in your organization.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={fetchAuditLogs}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
                >
                    <RefreshCw
                        size={17}
                        className={
                            loading ? "animate-spin" : ""
                        }
                    />

                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Search activity, user or email..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-sm"
                        />
                    </div>

                    <select
                        value={action}
                        onChange={handleActionChange}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-sm bg-white"
                    >
                        <option value="">
                            All Actions
                        </option>

                        <option value="CREATE">
                            CREATE
                        </option>

                        <option value="UPDATE">
                            UPDATE
                        </option>

                        <option value="DELETE">
                            DELETE
                        </option>

                        <option value="APPROVE">
                            APPROVE
                        </option>

                        <option value="REJECT">
                            REJECT
                        </option>
                    </select>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 flex items-center gap-2">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {/* Audit Logs Card */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                System Activity
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                {pagination.total} total activity logs
                            </p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        <RefreshCw
                            size={24}
                            className="animate-spin mx-auto mb-3 text-purple-500"
                        />

                        Loading audit logs...
                    </div>
                ) : logs.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Activity
                            size={35}
                            className="mx-auto mb-3 text-gray-300"
                        />

                        <p className="font-medium text-gray-700">
                            No audit logs found
                        </p>

                        <p className="text-sm mt-1">
                            Activity will appear here when actions are performed.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                            Action
                                        </th>

                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                            Performed By
                                        </th>

                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                            Target
                                        </th>

                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                            Description
                                        </th>

                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                            Date
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {logs.map((log) => (
                                        <tr
                                            key={log._id}
                                            className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                                        >
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getActionStyle(
                                                        log.action
                                                    )}`}
                                                >
                                                    {log.action}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {log.performedBy?.name ||
                                                            "Unknown User"}
                                                    </p>

                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {log.performedBy?.email ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="text-sm font-medium text-gray-700">
                                                    {log.targetType ||
                                                        "N/A"}
                                                </p>

                                                {log.targetId && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {log.targetId}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="px-5 py-4 max-w-md">
                                                <p className="text-sm text-gray-700">
                                                    {log.description ||
                                                        "No description"}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(
                                                        log.createdAt
                                                    )}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-sm text-gray-500">
                                Page {pagination.page} of{" "}
                                {pagination.totalPages || 1}
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        setPage(
                                            (currentPage) =>
                                                Math.max(
                                                    currentPage - 1,
                                                    1
                                                )
                                        )
                                    }
                                    disabled={
                                        page <= 1 || loading
                                    }
                                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <button
                                    onClick={() =>
                                        setPage(
                                            (currentPage) =>
                                                Math.min(
                                                    currentPage + 1,
                                                    pagination.totalPages ||
                                                        1
                                                )
                                        )
                                    }
                                    disabled={
                                        page >=
                                            pagination.totalPages ||
                                        loading
                                    }
                                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ActivityLogs;