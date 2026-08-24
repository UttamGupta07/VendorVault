const express = require("express");

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
} = require("../controller/adminUserController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();

// ==========================================
// USER MANAGEMENT
// SUPER_ADMIN ONLY
// ==========================================

// Get all users
router.get(
  "/",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  getUsers
);

// Get single user
router.get(
  "/:id",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  getUserById
);

// Create user
router.post(
  "/",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  createUser
);

// Update user
router.put(
  "/:id",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  updateUser
);

// Activate / deactivate user
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  toggleUserStatus
);

// Delete user
router.delete(
  "/:id",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  deleteUser
);

module.exports = router;