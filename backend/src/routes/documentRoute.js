const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const
  authorizeRoles
    = require("../middleware/authorizeRoles");

const {
  uploadVendorDocument,
  getPendingReviewDocuments,
  getDocumentForReview,
  reviewDocument,
} = require("../controller/documentController");

const protect = require("../middleware/authMiddleware");


// ==========================================
// Vendor uploads document
// ==========================================

router.post(
  "/upload",
  protect,
  upload.single("document"),
  uploadVendorDocument
);


// ==========================================
// Compliance Officer
// Get documents pending review
// ==========================================

router.get(
  "/pending-review",
  protect,
  authorizeRoles("COMPLIANCE_OFFICER"),
  getPendingReviewDocuments
);


// ==========================================
// Compliance Officer
// Get single document for review
// ==========================================

router.get(
  "/:id",
  protect,
  authorizeRoles("COMPLIANCE_OFFICER"),
  getDocumentForReview
);


// ==========================================
// Compliance Officer
// Approve / Reject document
// ==========================================

router.put(
  "/:id/review",
  protect,
  authorizeRoles("COMPLIANCE_OFFICER"),
  reviewDocument
);


module.exports = router;