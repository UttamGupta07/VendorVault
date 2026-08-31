const express = require("express");

const {
  createDocumentType,
  getDocumentTypes,
  getDocumentTypeById,
  updateDocumentType,
  deleteDocumentType,
} = require("../controller/documentTypeController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();

// All routes require authentication
router.use(protect);

// Only SUPER_ADMIN can manage document types
router.use(authorizeRoles("SUPER_ADMIN"));

router.post("/", createDocumentType);
router.get("/", getDocumentTypes);
router.get("/:id", getDocumentTypeById);
router.put("/:id", updateDocumentType);
router.delete("/:id", deleteDocumentType);

module.exports = router;