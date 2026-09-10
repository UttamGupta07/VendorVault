const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/authorizeRoles");

const {
  getComplianceOverview,
} = require("../controller/complianceController");

// ============================================================
// Compliance Overview
// ============================================================

router.get(
  "/",
  protect,
  authorizeRoles("COMPLIANCE_OFFICER"),
  getComplianceOverview
);

module.exports = router;