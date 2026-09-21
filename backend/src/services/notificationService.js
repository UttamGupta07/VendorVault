const UserNotification = require("../models/UserNotification");
const User = require("../models/User");
const Vendor = require("../models/Vendor");

/**
 * ============================================================
 * CREATE NOTIFICATION FOR A USER
 * ============================================================
 *
 * Used for:
 * - SUPER_ADMIN
 * - COMPLIANCE_OFFICER
 * - AUDITOR
 */
const notifyUser = async ({
  organizationId,
  recipientUserId,
  type,
  title,
  message,
  relatedId = null,
  relatedType = null,
  metadata = {},
}) => {
  try {
    if (!organizationId) {
      throw new Error("organizationId is required");
    }

    if (!recipientUserId) {
      throw new Error("recipientUserId is required");
    }

    if (!type) {
      throw new Error("Notification type is required");
    }

    if (!title) {
      throw new Error("Notification title is required");
    }

    if (!message) {
      throw new Error("Notification message is required");
    }

    const notification = await UserNotification.create({
      organizationId,
      recipientUserId,
      recipientVendorId: null,

      type,
      title,
      message,

      relatedId,
      relatedType,

      metadata,

      isRead: false,
    });

    return notification;
  } catch (error) {
    console.error("notifyUser error:", error);
    throw error;
  }
};


/**
 * ============================================================
 * CREATE NOTIFICATION FOR A VENDOR
 * ============================================================
 */
const notifyVendor = async ({
  organizationId,
  recipientVendorId,
  type,
  title,
  message,
  relatedId = null,
  relatedType = null,
  metadata = {},
}) => {
  try {
    if (!organizationId) {
      throw new Error("organizationId is required");
    }

    if (!recipientVendorId) {
      throw new Error("recipientVendorId is required");
    }

    if (!type) {
      throw new Error("Notification type is required");
    }

    if (!title) {
      throw new Error("Notification title is required");
    }

    if (!message) {
      throw new Error("Notification message is required");
    }

    const notification = await UserNotification.create({
      organizationId,

      recipientUserId: null,
      recipientVendorId,

      type,
      title,
      message,

      relatedId,
      relatedType,

      metadata,

      isRead: false,
    });

    return notification;
  } catch (error) {
    console.error("notifyVendor error:", error);
    throw error;
  }
};


/**
 * ============================================================
 * NOTIFY USERS BY ROLE
 * ============================================================
 *
 * Example:
 *
 * await notifyUsersByRole({
 *   organizationId,
 *   roles: ["SUPER_ADMIN", "COMPLIANCE_OFFICER"],
 *   type: "DOCUMENT_UPLOADED",
 *   title: "New document uploaded",
 *   message: "ABC Fooding uploaded a GST certificate."
 * });
 */
const notifyUsersByRole = async ({
  organizationId,
  roles,
  type,
  title,
  message,
  relatedId = null,
  relatedType = null,
  metadata = {},
}) => {
  try {
    if (!organizationId) {
      throw new Error("organizationId is required");
    }

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error("roles must be a non-empty array");
    }

    const users = await User.find({
      organizationId,
      role: { $in: roles },
    }).select("_id role");

    if (!users.length) {
      return [];
    }

    const notifications = users.map((user) => ({
      organizationId,

      recipientUserId: user._id,
      recipientVendorId: null,

      type,
      title,
      message,

      relatedId,
      relatedType,

      metadata,

      isRead: false,
    }));

    return await UserNotification.insertMany(notifications);
  } catch (error) {
    console.error("notifyUsersByRole error:", error);
    throw error;
  }
};


/**
 * ============================================================
 * NOTIFY MULTIPLE USERS
 * ============================================================
 *
 * Useful when exact User IDs are already available.
 */
const notifyUsers = async ({
  organizationId,
  recipientUserIds,
  type,
  title,
  message,
  relatedId = null,
  relatedType = null,
  metadata = {},
}) => {
  try {
    if (!organizationId) {
      throw new Error("organizationId is required");
    }

    if (
      !recipientUserIds ||
      !Array.isArray(recipientUserIds) ||
      recipientUserIds.length === 0
    ) {
      throw new Error("recipientUserIds must be a non-empty array");
    }

    const notifications = recipientUserIds.map((userId) => ({
      organizationId,

      recipientUserId: userId,
      recipientVendorId: null,

      type,
      title,
      message,

      relatedId,
      relatedType,

      metadata,

      isRead: false,
    }));

    return await UserNotification.insertMany(notifications);
  } catch (error) {
    console.error("notifyUsers error:", error);
    throw error;
  }
};


/**
 * ============================================================
 * NOTIFY MULTIPLE VENDORS
 * ============================================================
 */
const notifyVendors = async ({
  organizationId,
  recipientVendorIds,
  type,
  title,
  message,
  relatedId = null,
  relatedType = null,
  metadata = {},
}) => {
  try {
    if (!organizationId) {
      throw new Error("organizationId is required");
    }

    if (
      !recipientVendorIds ||
      !Array.isArray(recipientVendorIds) ||
      recipientVendorIds.length === 0
    ) {
      throw new Error("recipientVendorIds must be a non-empty array");
    }

    const notifications = recipientVendorIds.map((vendorId) => ({
      organizationId,

      recipientUserId: null,
      recipientVendorId: vendorId,

      type,
      title,
      message,

      relatedId,
      relatedType,

      metadata,

      isRead: false,
    }));

    return await UserNotification.insertMany(notifications);
  } catch (error) {
    console.error("notifyVendors error:", error);
    throw error;
  }
};


/**
 * ============================================================
 * EXPORT
 * ============================================================
 */
module.exports = {
  notifyUser,
  notifyVendor,
  notifyUsers,
  notifyVendors,
  notifyUsersByRole,
};