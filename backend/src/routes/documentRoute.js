const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");
const { uploadDocument } = require("../controller/documentController");

const protect = require("../middleware/authMiddleware");

// Vendor uploads document
router.post(
  "/upload",
  protect,
  upload.single("document"),
  uploadDocument
);

module.exports = router;