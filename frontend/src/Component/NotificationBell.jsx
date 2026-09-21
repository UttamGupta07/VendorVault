import { useEffect, useState } from "react";
import {
    Bell,
    Check,
    X,
} from "lucide-react";
import {
    getUserNotifications,
    markUserNotificationAsRead,
} from "../api/userNotificationApi";

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadNotifications = async () => {
        try {
            const data = await getUserNotifications();

            if (data.success) {
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            console.error("Failed to load notifications:", error);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            setLoading(true);

            await markUserNotificationAsRead(id);

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification._id === id
                        ? { ...notification, isRead: true }
                        : notification
                )
            );

            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark notification:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => {
        setShowNotifications((prev) => !prev);
        loadNotifications();
    };

    return (
        <div className="relative">
            <button
                onClick={handleOpen}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
                <Bell
                    size={21}
                    className="text-gray-700 dark:text-gray-200"
                />

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-semibold">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {showNotifications && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowNotifications(false)}
                    />

                    <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <div>
                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                    Notifications
                                </h3>

                                {unreadCount > 0 && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {unreadCount} unread notification
                                        {unreadCount > 1 ? "s" : ""}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() => setShowNotifications(false)}
                                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <X
                                    size={18}
                                    className="text-gray-500"
                                />
                            </button>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="px-4 py-10 text-center">
                                    <Bell
                                        size={30}
                                        className="mx-auto text-gray-400 mb-2"
                                    />

                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        No notifications
                                    </p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`px-4 py-3 border-b border-gray-100 dark:border-gray-800 ${
                                            !notification.isRead
                                                ? "bg-gray-50 dark:bg-gray-800/60"
                                                : ""
                                        }`}
                                    >
                                        <div className="flex justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                    {notification.title}
                                                </p>

                                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                    {notification.message}
                                                </p>

                                                <p className="text-xs text-gray-400 mt-2">
                                                    {new Date(
                                                        notification.createdAt
                                                    ).toLocaleString()}
                                                </p>
                                            </div>

                                            {!notification.isRead && (
                                                <button
                                                    disabled={loading}
                                                    onClick={() =>
                                                        handleMarkAsRead(
                                                            notification._id
                                                        )
                                                    }
                                                    className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                                                    title="Mark as read"
                                                >
                                                    <Check
                                                        size={16}
                                                        className="text-green-600"
                                                    />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;