const express = require("express");
const router = express.Router();

const {
    getAuditLogs,
} = require("../controller/auditLogController");

const authMiddleware = require("../middleware/authMiddleware");

router.get(
    "/",
    authMiddleware,
    (req, res, next) => {
        if (req.user.role !== "SUPER_ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        next();
    },
    getAuditLogs
);

module.exports = router;