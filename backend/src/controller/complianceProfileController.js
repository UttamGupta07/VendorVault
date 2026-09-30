const bcrypt = require("bcryptjs");

const User = require("../models/User");

// ============================================================
// GET MY PROFILE
// ============================================================

const getProfile = async (req, res) => {
  try {
    // --------------------------------------------------------
    // Authentication check
    // --------------------------------------------------------

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { userId, organizationId } = req.user;

    // --------------------------------------------------------
    // Find user
    // --------------------------------------------------------

    const user = await User.findOne({
      _id: userId,
      organizationId,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    // --------------------------------------------------------
    // Return profile
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,

        role: user.role,
        organizationId: user.organizationId,

        status: user.status,

        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// ============================================================
// UPDATE MY PROFILE
// ============================================================

const updateProfile = async (req, res) => {
  try {
    // --------------------------------------------------------
    // Authentication check
    // --------------------------------------------------------

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { userId, organizationId } = req.user;

    // --------------------------------------------------------
    // Get allowed fields only
    // --------------------------------------------------------

    const { name, email, phone } = req.body;

    // --------------------------------------------------------
    // Validate name
    // --------------------------------------------------------

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    // --------------------------------------------------------
    // Validate email
    // --------------------------------------------------------

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // --------------------------------------------------------
    // Find current user
    // --------------------------------------------------------

    const user = await User.findOne({
      _id: userId,
      organizationId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    // --------------------------------------------------------
    // Check duplicate email
    //
    // Only check another user in the same organization.
    // --------------------------------------------------------

    const existingUser = await User.findOne({
      organizationId,
      email: normalizedEmail,
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This email is already being used by another user",
      });
    }

    // --------------------------------------------------------
    // Update allowed profile fields
    // --------------------------------------------------------

    user.name = name.trim();
    user.email = normalizedEmail;
    user.phone = phone ? phone.trim() : "";

    await user.save();

    // --------------------------------------------------------
    // Return updated profile
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,

        role: user.role,
        organizationId: user.organizationId,

        status: user.status,

        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    // MongoDB duplicate-key protection
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email is already in use",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// ============================================================
// CHANGE PASSWORD
// ============================================================

const changePassword = async (req, res) => {
  try {
    // --------------------------------------------------------
    // Authentication check
    // --------------------------------------------------------

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { userId, organizationId } = req.user;

    // --------------------------------------------------------
    // Get password fields
    // --------------------------------------------------------

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // --------------------------------------------------------
    // Required fields
    // --------------------------------------------------------

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    // --------------------------------------------------------
    // Confirm new password
    // --------------------------------------------------------

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    // --------------------------------------------------------
    // Password length
    // --------------------------------------------------------

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    // --------------------------------------------------------
    // Prevent same password
    // --------------------------------------------------------

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from your current password",
      });
    }

    // --------------------------------------------------------
    // IMPORTANT:
    // password has select:false in your authentication setup,
    // so explicitly select it here.
    // --------------------------------------------------------

    const user = await User.findOne({
      _id: userId,
      organizationId,
    }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    // --------------------------------------------------------
    // Verify current password
    // --------------------------------------------------------

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // --------------------------------------------------------
    // Hash new password
    // --------------------------------------------------------

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    await user.save();

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};