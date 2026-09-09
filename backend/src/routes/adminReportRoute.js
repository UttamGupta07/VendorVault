const express = require("express");
const router = express.Router();

const { getAdminReports } = require("../controller/adminReportController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, (req, res, next) => {
    if (req.user.role !== "SUPER_ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Access denied",
        });
    }

    next();
}, getAdminReports);

module.exports = router;