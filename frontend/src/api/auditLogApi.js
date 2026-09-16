import axios from "axios";

const API_URL =
    "http://localhost:5000/api/admin/activity-logs";

export const getAuditLogs = async (params = {}) => {
    const response = await axios.get(API_URL, {
        params,
        withCredentials: true,
    });

    return response.data;
};