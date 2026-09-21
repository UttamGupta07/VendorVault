const express = require("express");
const router = express.Router();

const {
    getAuditLogs,
    getAuditLogsForCompliance,
} = require("../controller/auditLogController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

router.get(
    "/",
    authMiddleware,
    (req, res, next) => {
        // Only Super Admin can access audit logs.
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
router.get(
    "/compliance-audit-logs",
    authMiddleware,
    authorizeRoles("COMPLIANCE_OFFICER"),
    getAuditLogsForCompliance
);

module.exports = router;