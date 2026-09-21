const express = require("express");

const {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require("../controller/userNotificationController");

const protect  = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * Get current user's/vendor's notifications
 */
router.get(
  "/",
  protect,
  getMyNotifications
);

/**
 * Get unread notification count
 */
router.get(
  "/unread-count",
  protect,
  getUnreadNotificationCount
);

/**
 * Mark one notification as read
 */
router.patch(
  "/:id/read",
  protect,
  markNotificationAsRead
);

/**
 * Mark all notifications as read
 */
router.patch(
  "/read-all",
  protect,
  markAllNotificationsAsRead
);

/**
 * Delete one notification
 */
router.delete(
  "/:id",
  protect,
  deleteNotification
);

module.exports = router;