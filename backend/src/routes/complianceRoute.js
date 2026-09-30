const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/authorizeRoles");

const {
  getComplianceOverview,
  getProfile,
  updateProfile,
  changePassword,
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
router.get(
  "/compliance-profile",
  protect,
  authorizeRoles("COMPLIANCE_OFFICER"),
  getProfile
);
router.put(
  "/compliance-profile",
  protect,
  authorizeRoles("COMPLIANCE_OFFICER"),
  updateProfile
);
router.put(
  "/change-password",
  protect,
  authorizeRoles("COMPLIANCE_OFFICER"),
  changePassword
);
module.exports = router;