const Notification = require("../models/Notification");
const Vendor = require("../models/Vendor");

const getNotifications = async (req, res) => {
  try {
    // ---------------------------------------------
    // Check authenticated user
    // ---------------------------------------------
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    console.log("Logged in user:", req.user);

    // ---------------------------------------------
    // Find vendor using JWT user id
    // ---------------------------------------------
    const vendor = await Vendor.findOne({
      userId: req.user.id,
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    // ---------------------------------------------
    // Get vendor notifications
    // ---------------------------------------------
    const notifications = await Notification.find({
      vendorId: vendor._id,
    })
      .select("reminderType title message isRead createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

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
    console.error("Mark notification as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

module.exports = {
    markNotificationAsRead,
  getNotifications,
};