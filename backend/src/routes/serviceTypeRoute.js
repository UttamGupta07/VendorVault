const express = require("express");

const {
  createServiceType,
  getServiceTypes,
  getServiceTypeById,
  updateServiceType,
  deleteServiceType,
} = require("../controller/serviceTypeController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();

// All routes require authentication
router.use(protect);

// Only SUPER_ADMIN can manage service types
router.use(authorizeRoles("SUPER_ADMIN"));

router.post("/", createServiceType);
router.get("/", getServiceTypes);
router.get("/:id", getServiceTypeById);
router.put("/:id", updateServiceType);
router.delete("/:id", deleteServiceType);

module.exports = router;