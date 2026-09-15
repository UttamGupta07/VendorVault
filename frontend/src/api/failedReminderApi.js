import axiosInstance from "./axiosInstance";

// Fetch failed reminder jobs from BullMQ.
// Only Super Admin users can access this API.
export const getFailedReminderJobs = async () => {
    const response = await axiosInstance.get(
        "/api/admin/failed-reminders"
    );

    return response.data;
};