const express = require("express");

const router = express.Router();

const {
  getComplianceDashboard,
} = require("../controller/complianceDashboardController");

const 
  protect
 = require("../middleware/authMiddleware");
const  authorizeRoles  = require("../middleware/authorizeRoles");

router.get(
  "/",
  protect,
  authorizeRoles("COMPLIANCE_OFFICER"),getComplianceDashboard
);

module.exports = router;