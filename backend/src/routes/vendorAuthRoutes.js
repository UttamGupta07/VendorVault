
const express = require("express");

const router = express.Router();

const {
  registerVendor,
  loginVendor,
  getVendorDashboard,
  getVendorDocumentRequirements,
  getAllVendors,
  getVendorById,
} = require("../controller/vendorAuthController");

const getCurrentVendor =
  require("../controller/vendorAuthController").getCurrentVendor;

const protect = require("../middleware/authMiddleware");

// ==========================================
// VENDOR REGISTRATION
// Only authenticated Super Admin / Compliance Officer
// ==========================================
router.post(
  "/register",
  protect,
  registerVendor
);

// ==========================================
// VENDOR LOGIN
// ==========================================
router.post(
  "/login",
  loginVendor
);

// ==========================================
// GET CURRENT VENDOR
// ==========================================
router.get(
  "/me",
  protect,
  getCurrentVendor
);
router.get(
  "/dashboard",
  protect,
  getVendorDashboard
);
router.get("/documents/requirements", protect, getVendorDocumentRequirements);
 

const authorizeRoles = require("../middleware/authorizeRoles");

router.get(
  "/",
  protect,
  authorizeRoles(
    "SUPER_ADMIN",
    "COMPLIANCE_OFFICER"
  ),
  getAllVendors
);
router.get(
  "/:vendorId",
  protect,
  authorizeRoles("SUPER_ADMIN", "COMPLIANCE_OFFICER","VENDOR"),
  getVendorById
);
module.exports = router;

