const Role = require("../models/rolemodel");

const authorizePermissions = (...requiredPermissions) => {
  return async (req, res, next) => {
    try {
      // User must already be authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      // ==========================================
      // SUPER ADMIN
      // ==========================================

      // Super Admin always has full access.
      // This prevents accidentally locking
      // yourself out of Roles & Permissions.
      if (req.user.role === "SUPER_ADMIN") {
        return next();
      }

      // ==========================================
      // VALIDATE ORGANIZATION
      // ==========================================

      if (!req.user.organizationId) {
        return res.status(403).json({
          success: false,
          message: "Organization information missing",
        });
      }

      // ==========================================
      // FIND ROLE
      // ==========================================

      const role = await Role.findOne({
        organizationId: req.user.organizationId,
        name: req.user.role,
      }).lean();

      if (!role) {
        return res.status(403).json({
          success: false,
          message:
            "Role configuration not found",
        });
      }

      const userPermissions = role.permissions || [];

      // ==========================================
      // WILDCARD
      // ==========================================

      if (userPermissions.includes("*")) {
        return next();
      }

      // ==========================================
      // CHECK PERMISSIONS
      // ==========================================

      const hasAllPermissions =
        requiredPermissions.every((permission) =>
          userPermissions.includes(permission)
        );

      if (!hasAllPermissions) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied. Required permission missing.",
          requiredPermissions,
        });
      }

      next();
    } catch (error) {
      console.error(
        "Permission middleware error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Permission check failed",
      });
    }
  };
};

module.exports = authorizePermissions;