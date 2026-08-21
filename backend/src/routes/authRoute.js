 const express = require("express");

const {
  registerOrganization,
  loginUser,
  getMe,
  logoutUser,
} = require("../controller/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register-organization", registerOrganization);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/me", protect, getMe);

module.exports = router;