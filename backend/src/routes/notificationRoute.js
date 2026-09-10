const express = require("express");

const router = express.Router();

const {
    markNotificationAsRead,
  getNotifications,
} = require("../controller/notificationcontroller");

const protect = require("../middleware/authMiddleware");

router.get(
  "/",
  protect,
  getNotifications
);

router.patch(
  "/:id/read",
  protect,
  markNotificationAsRead
);

module.exports = router;