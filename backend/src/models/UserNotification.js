const mongoose = require("mongoose");

const userNotificationSchema = new mongoose.Schema(
  {
    // Organization to which this notification belongs.
    // This keeps notifications isolated between organizations.
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    // User recipient.
    // Used for Super Admin, Compliance Officer and Auditor.
    recipientUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // Vendor recipient.
    // Vendor has a separate collection from User.
    recipientVendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
      index: true,
    },

    // Notification type.
    // This remains generic so other team members can use it later.
    type: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Whether the recipient has seen the notification.
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Optional entity related to the notification.
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // Example: Vendor, VendorDocument, User, Organization
    relatedType: {
      type: String,
      default: null,
      trim: true,
    },

    // Extra information if needed in future.
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Fast organization-wise notification queries.
userNotificationSchema.index({
  organizationId: 1,
  createdAt: -1,
});

// Fast unread notifications for User recipients.
userNotificationSchema.index({
  recipientUserId: 1,
  isRead: 1,
  createdAt: -1,
});

// Fast unread notifications for Vendor recipients.
userNotificationSchema.index({
  recipientVendorId: 1,
  isRead: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "UserNotification",
  userNotificationSchema
);