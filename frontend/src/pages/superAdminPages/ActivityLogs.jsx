import { useEffect, useState } from "react";
import {
    Activity,
    AlertCircle,
    RefreshCw,
} from "lucide-react";

import { getFailedReminderJobs } from "../../api/failedReminderApi";

const ActivityLogs = () => {

    const [failedJobs, setFailedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchFailedJobs = async () => {

        try {
            setLoading(true);
            setError("");

            const data = await getFailedReminderJobs();

            setFailedJobs(data.jobs || []);

        } catch (error) {

            console.error(
                "Failed to fetch failed reminder jobs:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load failed reminder jobs"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFailedJobs();
    }, []);

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleString();
    };

    return (
        <div className="p-6">

            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">

                <div>
                    <div className="flex items-center gap-3">

                        <Activity
                            size={28}
                            className="text-red-500"
                        />

                        <h1 className="text-2xl font-semibold">
                            Activity Logs
                        </h1>

                    </div>

                    <p className="text-gray-500 mt-1">
                        Monitor failed reminder jobs and system activity.
                    </p>
                </div>

                <button
                    onClick={fetchFailedJobs}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                    <RefreshCw
                        size={17}
                        className={loading ? "animate-spin" : ""}
                    />

                    Refresh
                </button>

            </div>

            {/* Failed Reminder Section */}
            <div className="bg-white border rounded-xl shadow-sm">

                <div className="px-5 py-4 border-b">

                    <h2 className="text-lg font-semibold">
                        Failed Reminder Jobs
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Reminder jobs that could not be delivered
                        after all retry attempts.
                    </p>

                </div>

                {/* Error */}
                {error && (
                    <div className="m-5 p-4 rounded-lg bg-red-50 text-red-700 flex items-center gap-2">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="p-10 text-center text-gray-500">
                        Loading failed jobs...
                    </div>
                ) : failedJobs.length === 0 ? (

                    <div className="p-10 text-center text-gray-500">
                        No failed reminder jobs found.
                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>
                                <tr className="border-b bg-gray-50">

                                    <th className="text-left px-5 py-3 text-sm font-medium">
                                        Job ID
                                    </th>

                                    <th className="text-left px-5 py-3 text-sm font-medium">
                                        Document
                                    </th>

                                    <th className="text-left px-5 py-3 text-sm font-medium">
                                        Vendor
                                    </th>

                                    <th className="text-left px-5 py-3 text-sm font-medium">
                                        Reminder
                                    </th>

                                    <th className="text-left px-5 py-3 text-sm font-medium">
                                        Attempts
                                    </th>

                                    <th className="text-left px-5 py-3 text-sm font-medium">
                                        Failure Reason
                                    </th>

                                    <th className="text-left px-5 py-3 text-sm font-medium">
                                        Failed At
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {failedJobs.map((job) => (

                                    <tr
                                        key={job.jobId}
                                        className="border-b last:border-b-0 hover:bg-gray-50"
                                    >

                                        <td className="px-5 py-4 text-sm">
                                            {job.jobId}
                                        </td>

                                        <td className="px-5 py-4 text-sm">
                                            {job.documentId || "N/A"}
                                        </td>

                                        <td className="px-5 py-4 text-sm">
                                            {job.vendorId || "N/A"}
                                        </td>

                                        <td className="px-5 py-4 text-sm">

                                            <span className="px-2 py-1 rounded-md bg-orange-100 text-orange-700 text-xs font-medium">
                                                {job.reminderType}
                                            </span>

                                        </td>

                                        <td className="px-5 py-4 text-sm">
                                            {job.attempts}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-red-600 max-w-xs">
                                            {job.reason}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {formatDate(job.failedAt)}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
};

export default ActivityLogs;