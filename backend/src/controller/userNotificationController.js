const UserNotification = require("../models/UserNotification");

const getUserNotifications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { userId, organizationId } = req.user;

    if (!userId || !organizationId) {
      return res.status(400).json({
        success: false,
        message: "User or organization information is missing",
      });
    }

    const notifications = await UserNotification.find({
      organizationId,
      recipientUserId: userId,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = await UserNotification.countDocuments({
      organizationId,
      recipientUserId: userId,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Get user notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

const markUserNotificationAsRead = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { userId, organizationId } = req.user;
    const { id } = req.params;

    const notification = await UserNotification.findOne({
      _id: id,
      organizationId,
      recipientUserId: userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark user notification as read error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

module.exports = {
  getUserNotifications,
  markUserNotificationAsRead,
};