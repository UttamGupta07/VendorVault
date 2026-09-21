import axios from "axios";

const API_URL = "http://localhost:5000/api/user-notifications";

export const getUserNotifications = async () => {
    const response = await axios.get(API_URL, {
        withCredentials: true,
    });

    return response.data;
};

export const markUserNotificationAsRead = async (id) => {
    const response = await axios.patch(
        `${API_URL}/${id}/read`,
        {},
        {
            withCredentials: true,
        }
    );

    return response.data;
};