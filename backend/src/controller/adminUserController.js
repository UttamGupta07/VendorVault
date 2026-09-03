const bcrypt = require("bcryptjs");

const User = require("../models/User");

// ======================================================
// GET ALL USERS
// GET /api/admin/users
// ======================================================

const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 1,
      search = "",
      role = "All",
      status = "All",
    } = req.query;

    const organizationId = req.user.organizationId;

    // ----------------------------------------
    // Build query
    // ----------------------------------------

    const query = {
      organizationId,
    };

    // Search by name or email
    if (search.trim()) {
      query.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          email: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    // Filter by role
    if (role !== "All") {
      query.role = role;
    }

    // Filter by active/inactive status
    if (status !== "All") {
      query.isActive = status === "Active";
    }

    // ----------------------------------------
    // Pagination
    // ----------------------------------------

    const currentPage = Math.max(parseInt(page, 10) || 10, 1);

    const perPage = Math.min(
      Math.max(parseInt(limit, 1) || 1, 1),
      100
    );

    const skip = (currentPage - 1) * perPage;

    // ----------------------------------------
    // Get users
    // ----------------------------------------

    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage),

      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalUsers / perPage);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage,
        perPage,
        totalUsers,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// GET USER BY ID
// GET /api/admin/users/:id
// ======================================================

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      _id: id,
      organizationId: req.user.organizationId,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// CREATE USER
// POST /api/admin/users
// ======================================================

const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    // ----------------------------------------
    // Validate required fields
    // ----------------------------------------

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required",
      });
    }

    // ----------------------------------------
    // Validate role
    // ----------------------------------------

    const allowedRoles = [
      "SUPER_ADMIN",
      "COMPLIANCE_OFFICER",
      "AUDITOR",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // ----------------------------------------
    // Normalize email
    // ----------------------------------------

    const normalizedEmail = email.toLowerCase().trim();

    // ----------------------------------------
    // Check existing user
    // ----------------------------------------

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // ----------------------------------------
    // Hash password
    // ----------------------------------------

    const hashedPassword = await bcrypt.hash(password, 10);

    // ----------------------------------------
    // Create user
    // IMPORTANT:
    // organizationId comes from authenticated
    // SUPER_ADMIN, not from req.body
    // ----------------------------------------

    const user = await User.create({
      organizationId: req.user.organizationId,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    // ----------------------------------------
    // Remove password from response
    // ----------------------------------------

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Create user error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// UPDATE USER
// PUT /api/admin/users/:id
// ======================================================

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      password,
      role,
    } = req.body;

    // ----------------------------------------
    // Find user inside same organization
    // ----------------------------------------

    const user = await User.findOne({
      _id: id,
      organizationId: req.user.organizationId,
    }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ----------------------------------------
    // Prevent SUPER_ADMIN from accidentally
    // changing their own role
    // ----------------------------------------

    if (
      user._id.toString() === req.user.userId.toString() &&
      role &&
      role !== "SUPER_ADMIN"
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own SUPER_ADMIN role",
      });
    }

    // ----------------------------------------
    // Validate role if provided
    // ----------------------------------------

    const allowedRoles = [
      "SUPER_ADMIN",
      "COMPLIANCE_OFFICER",
      "AUDITOR",
      "VENDOR",
    ];

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // ----------------------------------------
    // Update name
    // ----------------------------------------

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }

      user.name = name.trim();
    }

    // ----------------------------------------
    // Update email
    // ----------------------------------------

    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();

      if (!normalizedEmail) {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty",
        });
      }

      const emailExists = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email is already being used by another user",
        });
      }

      user.email = normalizedEmail;

      // Email should be verified again after changing it
      user.isEmailVerified = false;
    }

    // ----------------------------------------
    // Update role
    // ----------------------------------------

    if (role !== undefined) {
      user.role = role;
    }

    // ----------------------------------------
    // Update password if provided
    // ----------------------------------------

    if (password !== undefined && password.trim()) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    // ----------------------------------------
    // Remove password from response
    // ----------------------------------------

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// TOGGLE USER STATUS
// PATCH /api/admin/users/:id/status
// ======================================================

const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // ----------------------------------------
    // Prevent SUPER_ADMIN from deactivating
    // their own account
    // ----------------------------------------

    if (id === req.user.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account",
      });
    }

    // ----------------------------------------
    // Find user in same organization
    // ----------------------------------------

    const user = await User.findOne({
      _id: id,
      organizationId: req.user.organizationId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Toggle status
    user.isActive = !user.isActive;

    await user.save();

    return res.status(200).json({
      success: true,
      message: user.isActive
        ? "User activated successfully"
        : "User deactivated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (error) {
    console.error("Toggle user status error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// DELETE USER
// DELETE /api/admin/users/:id
// ======================================================

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // ----------------------------------------
    // Prevent deleting own account
    // ----------------------------------------

    if (id === req.user.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    // ----------------------------------------
    // Find user in same organization
    // ----------------------------------------

    const user = await User.findOne({
      _id: id,
      organizationId: req.user.organizationId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.deleteOne({
      _id: id,
      organizationId: req.user.organizationId,
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
};