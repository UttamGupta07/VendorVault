import axiosInstance from "./axiosInstance";

export const getComplianceTeam = async () => {
    const response = await axiosInstance.get(
        "/api/admin/compliance-team"
    );

    return response.data;
};