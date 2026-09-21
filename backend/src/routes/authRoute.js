const express = require("express");
const {
  registerOrganization,
  loginUser,
  getMe,
  logoutUser,
  changePassword,
  updateProfile,
  updateOrganization,
  forgotPassword,
  resetPassword,
} = require("../controller/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register-organization", registerOrganization);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/me", protect, getMe);

// Change password for the currently logged-in user
router.put("/change-password", protect, changePassword);

// Update profile of the currently logged-in user
router.put("/profile", protect, updateProfile);

// Update organization of the currently logged-in user's organization
router.put("/organization", protect, updateOrganization);

// forget password routes 

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password",
  resetPassword
);

module.exports = router;