const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
    getSuperAdminDashboard,
} = require("../controller/adminDashboardController");

const router = express.Router();

// ======================================================
// SUPER ADMIN DASHBOARD
// ======================================================
// Only authenticated SUPER_ADMIN can access this route.
// ======================================================

router.get(
    "/",
    protect,
    authorizeRoles("SUPER_ADMIN"),
    getSuperAdminDashboard
);

module.exports = router;