import axiosInstance from "./axiosInstance";

// Get Super Admin dashboard data
export const getSuperAdminDashboard = async () => {
    const response = await axiosInstance.get(
        "/api/admin/dashboard"
    );

    return response.data;
};