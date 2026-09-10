import axiosInstance from "./axiosInstance";

export const getAdminReports = async () => {
    const response = await axiosInstance.get("/api/admin/reports");
    return response.data;
};