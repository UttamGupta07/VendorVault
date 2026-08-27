const Role = require("../models/rolemodel");

const {
  PERMISSIONS,
  PERMISSION_KEYS,
} = require("../utills/permissionCatalog");

// ======================================================
// GET ALL ROLES
// GET /api/admin/roles
// ======================================================

const getRoles = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    const roles = await Role.find({
      organizationId,
    }).sort({
      name: 1,
    });

    return res.status(200).json({
      success: true,
      roles,
    });
  } catch (error) {
    console.error("Get roles error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch roles",
    });
  }
};

// ======================================================
// GET ROLE BY NAME
// GET /api/admin/roles/:role
// ======================================================

const getRoleByName = async (req, res) => {
  try {
    const { role } = req.params;

    const organizationId = req.user.organizationId;

    const roleData = await Role.findOne({
      organizationId,
      name: role.toUpperCase(),
    });

    if (!roleData) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    return res.status(200).json({
      success: true,
      role: roleData,
    });
  } catch (error) {
    console.error("Get role error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch role",
    });
  }
};

// ======================================================
// GET PERMISSION CATALOG
// GET /api/admin/roles/permissions/catalog
// ======================================================

const getPermissionCatalog = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      permissions: PERMISSIONS,
    });
  } catch (error) {
    console.error(
      "Get permission catalog error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch permissions",
    });
  }
};

// ======================================================
// UPDATE ROLE PERMISSIONS
// PATCH /api/admin/roles/:role/permissions
// ======================================================

const updateRolePermissions = async (req, res) => {
  try {
    const { role } = req.params;
    const { permissions } = req.body;

    const roleName = role.toUpperCase();

    // ==========================================
    // Validate role
    // ==========================================

    const allowedRoles = [
      "SUPER_ADMIN",
      "COMPLIANCE_OFFICER",
      "AUDITOR",
      "VENDOR",
    ];

    if (!allowedRoles.includes(roleName)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // ==========================================
    // SUPER ADMIN PROTECTION
    // ==========================================

    if (roleName === "SUPER_ADMIN") {
      return res.status(400).json({
        success: false,
        message:
          "SUPER_ADMIN permissions cannot be modified",
      });
    }

    // ==========================================
    // Validate request
    // ==========================================

    if (!Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message:
          "Permissions must be an array",
      });
    }

    // ==========================================
    // Remove duplicates
    // ==========================================

    const uniquePermissions = [
      ...new Set(permissions),
    ];

    // ==========================================
    // Validate permission names
    // ==========================================

    const invalidPermissions =
      uniquePermissions.filter(
        (permission) =>
          !PERMISSION_KEYS.includes(permission)
      );

    if (invalidPermissions.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid permissions provided",
        invalidPermissions,
      });
    }

    // ==========================================
    // Find role
    // ==========================================

    const organizationId =
      req.user.organizationId;

    const roleData = await Role.findOne({
      organizationId,
      name: roleName,
    });

    if (!roleData) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // ==========================================
    // Update permissions
    // ==========================================

    roleData.permissions = uniquePermissions;

    await roleData.save();

    return res.status(200).json({
      success: true,
      message:
        "Role permissions updated successfully",
      role: roleData,
    });
  } catch (error) {
    console.error(
      "Update role permissions error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update role permissions",
    });
  }
};

// ======================================================
// RESET ROLE TO DEFAULT
// PATCH /api/admin/roles/:role/reset
// ======================================================

const resetRolePermissions = async (req, res) => {
  try {
    const { role } = req.params;

    const roleName = role.toUpperCase();

    if (roleName === "SUPER_ADMIN") {
      return res.status(400).json({
        success: false,
        message:
          "SUPER_ADMIN cannot be reset",
      });
    }

    const defaultRoles = require("../utills/defaultRoles");

    const defaultRole =
      defaultRoles[roleName];

    if (!defaultRole) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const roleData = await Role.findOne({
      organizationId: req.user.organizationId,
      name: roleName,
    });

    if (!roleData) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    roleData.permissions =
      defaultRole.permissions;

    await roleData.save();

    return res.status(200).json({
      success: true,
      message:
        "Role permissions reset successfully",
      role: roleData,
    });
  } catch (error) {
    console.error(
      "Reset role permissions error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to reset permissions",
    });
  }
};

module.exports = {
  getRoles,
  getRoleByName,
  getPermissionCatalog,
  updateRolePermissions,
  resetRolePermissions,
};