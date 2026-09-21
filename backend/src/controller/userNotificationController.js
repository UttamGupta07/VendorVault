const UserNotification = require("../models/UserNotification");

/**
 * ============================================================
 * GET MY NOTIFICATIONS
 * ============================================================
 *
 * Works for:
 * - SUPER_ADMIN
 * - COMPLIANCE_OFFICER
 * - AUDITOR
 * - VENDOR
 *
 * Vendors are stored in recipientVendorId.
 * Other users are stored in recipientUserId.
 */
const getMyNotifications = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID not found",
      });
    }

    let filter = {
      organizationId,
    };

    // Vendor
    if (req.user.role === "VENDOR") {
      filter.recipientVendorId = req.user.userId;
    }

    // Super Admin / Compliance Officer / Auditor
    else {
      filter.recipientUserId = req.user.userId;
    }

    const notifications = await UserNotification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("getMyNotifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};


/**
 * ============================================================
 * GET UNREAD NOTIFICATION COUNT
 * ============================================================
 */
const getUnreadNotificationCount = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID not found",
      });
    }

    let filter = {
      organizationId,
      isRead: false,
    };

    if (req.user.role === "VENDOR") {
      filter.recipientVendorId = req.user.userId;
    } else {
      filter.recipientUserId = req.user.userId;
    }

    const count = await UserNotification.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("getUnreadNotificationCount error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch unread notification count",
      error: error.message,
    });
  }
};


/**
 * ============================================================
 * MARK ONE NOTIFICATION AS READ
 * ============================================================
 */
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const organizationId = req.user.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID not found",
      });
    }

    let recipientFilter = {};

    if (req.user.role === "VENDOR") {
      recipientFilter.recipientVendorId = req.user.userId;
    } else {
      recipientFilter.recipientUserId = req.user.userId;
    }

    const notification = await UserNotification.findOneAndUpdate(
      {
        _id: id,
        organizationId,
        ...recipientFilter,
      },
      {
        $set: {
          isRead: true,
        },
      },
      {
        new: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("markNotificationAsRead error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};


/**
 * ============================================================
 * MARK ALL NOTIFICATIONS AS READ
 * ============================================================
 */
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID not found",
      });
    }

    let recipientFilter = {};

    if (req.user.role === "VENDOR") {
      recipientFilter.recipientVendorId = req.user.userId;
    } else {
      recipientFilter.recipientUserId = req.user.userId;
    }

    const result = await UserNotification.updateMany(
      {
        organizationId,
        isRead: false,
        ...recipientFilter,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("markAllNotificationsAsRead error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};


/**
 * ============================================================
 * DELETE ONE NOTIFICATION
 * ============================================================
 */
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const organizationId = req.user.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID not found",
      });
    }

    let recipientFilter = {};

    if (req.user.role === "VENDOR") {
      recipientFilter.recipientVendorId = req.user.userId;
    } else {
      recipientFilter.recipientUserId = req.user.userId;
    }

    const notification = await UserNotification.findOneAndDelete({
      _id: id,
      organizationId,
      ...recipientFilter,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("deleteNotification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};


module.exports = {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};