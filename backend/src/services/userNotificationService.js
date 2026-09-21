const UserNotification = require("../models/UserNotification");

const createUserNotification = async ({
  organizationId,
  recipientUserId = null,
  recipientVendorId = null,
  type,
  title,
  message,
  relatedId = null,
  relatedType = null,
  metadata = {},
}) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }

  if (!recipientUserId && !recipientVendorId) {
    throw new Error("Notification recipient is required");
  }

  const notification = await UserNotification.create({
    organizationId,
    recipientUserId,
    recipientVendorId,
    type,
    title,
    message,
    relatedId,
    relatedType,
    metadata,
  });

  return notification;
};

module.exports = {
  createUserNotification,
};