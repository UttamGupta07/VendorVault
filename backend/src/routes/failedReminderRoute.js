const express = require("express");

const {
    getFailedReminderJobs,
} = require("../controller/failedReminderController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Only authenticated Super Admin users can view failed reminder jobs.
router.get(
    "/",
    authMiddleware,
    (req, res, next) => {

        // Check Super Admin permission.
        if (req.user.role !== "SUPER_ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        next();
    },
    getFailedReminderJobs
);

module.exports = router;