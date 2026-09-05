
const express = require("express");

const router = express.Router();

const {
  registerVendor,
  loginVendor,
  getVendorDashboard,
  getVendorDocumentRequirements,
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

module.exports = router;

