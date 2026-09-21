const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getUserNotifications,
  markUserNotificationAsRead,
} = require("../controller/userNotificationController");

const router = express.Router();

router.get("/", protect, getUserNotifications);

router.patch("/:id/read", protect, markUserNotificationAsRead);

module.exports = router;