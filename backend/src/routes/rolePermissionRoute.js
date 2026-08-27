const express = require("express");

const {
  getRoles,
  getRoleByName,
  getPermissionCatalog,
  updateRolePermissions,
  resetRolePermissions,
} = require("../controller/rolePermissionController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();

// ======================================================
// ALL ROUTES = SUPER ADMIN ONLY
// ======================================================

// Get all roles
router.get(
  "/",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  getRoles
);

// Permission catalog
router.get(
  "/permissions/catalog",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  getPermissionCatalog
);

// Get specific role
router.get(
  "/:role",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  getRoleByName
);

// Update role permissions
router.patch(
  "/:role/permissions",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  updateRolePermissions
);

// Reset role permissions
router.patch(
  "/:role/reset",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  resetRolePermissions
);

module.exports = router;