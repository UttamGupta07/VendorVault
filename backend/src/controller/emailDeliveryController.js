const Notification = require("../models/Notification");
const {
  sendEmailWithRetry,
} = require("../services/emailService");
const VendorDocument = require("../models/VendorDocument");

// =====================================================
// GET EMAIL DELIVERY RECORDS
// COMPLIANCE OFFICER ONLY
// =====================================================

const getEmailDeliveryRecords = async (req, res) => {
    try {
        // ---------------------------------------------
        // Authentication
        // ---------------------------------------------

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        // ---------------------------------------------
        // Role protection
        // ---------------------------------------------

        if (req.user.role !== "COMPLIANCE_OFFICER") {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        // ---------------------------------------------
        // Organization protection
        // ---------------------------------------------

        if (!req.user.organizationId) {
            return res.status(400).json({
                success: false,
                message: "Organization information missing",
            });
        }

        // ---------------------------------------------
        // Query filters
        // ---------------------------------------------

        const {
            status,
            reminderType,
            search,
        } = req.query;

        const filter = {
            organizationId: req.user.organizationId,
        };

        // ---------------------------------------------
        // Status filter
        // ---------------------------------------------

        if (
            status === "SENT" ||
            status === "FAILED"
        ) {
            filter.emailStatus = status;
        }

        // ---------------------------------------------
        // Reminder type filter
        // ---------------------------------------------

        const allowedReminderTypes = [
            "15_DAY",
            "7_DAY",
            "1_DAY",
            "EXPIRED_1_DAY",
            "EXPIRED_3_DAY",
            "EXPIRED_7_DAY",
        ];

        if (
            reminderType &&
            allowedReminderTypes.includes(
                reminderType
            )
        ) {
            filter.reminderType = reminderType;
        }

        // ---------------------------------------------
        // Search
        // ---------------------------------------------

        if (search && search.trim()) {
            const regex = new RegExp(
                search.trim(),
                "i"
            );

            filter.$or = [
                {
                    email: regex,
                },
                {
                    title: regex,
                },
                {
                    message: regex,
                },
            ];
        }

        // ---------------------------------------------
        // Fetch notifications
        // ---------------------------------------------

        const notifications =
            await Notification.find(filter)
                .populate(
                    "vendorId",
                    "name companyName email"
                )
                .populate({
                    path: "documentId",
                    select:
                        "documentTypeId expiryDate status",
                    populate: {
                        path: "documentTypeId",
                        select: "name",
                    },
                })
                .sort({
                    createdAt: -1,
                });

        // ---------------------------------------------
        // Statistics
        // ---------------------------------------------

        const allNotifications =
            await Notification.find({
                organizationId:
                    req.user.organizationId,
            }).select(
                "emailStatus isRead"
            );

        const stats = {
            total: allNotifications.length,

            sent: allNotifications.filter(
                (item) =>
                    item.emailStatus === "SENT"
            ).length,

            failed: allNotifications.filter(
                (item) =>
                    item.emailStatus === "FAILED"
            ).length,

            unread: allNotifications.filter(
                (item) =>
                    item.isRead === false
            ).length,
        };

        // ---------------------------------------------
        // Response
        // ---------------------------------------------

        return res.status(200).json({
            success: true,
            count: notifications.length,
            stats,
            notifications,
        });

    } catch (error) {
        console.error(
            "Get email delivery records error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch email delivery records",
            error: error.message,
        });
    }
};



const resendNotificationEmail = async (req, res) => {
  try {
    const { notificationId } = req.params;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!req.user.organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization information missing",
      });
    }

    const notification = await Notification.findOne({
      _id: notificationId,
      organizationId: req.user.organizationId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Only failed emails can be resent
    if (notification.emailStatus !== "FAILED") {
      return res.status(400).json({
        success: false,
        message: "Only failed emails can be resent",
      });
    }

    if (!notification.email) {
      return res.status(400).json({
        success: false,
        message: "Recipient email address is missing",
      });
    }

    // =====================================================
    // START NEW RESEND CYCLE
    // =====================================================

    notification.resendCount =
      (notification.resendCount || 0) + 1;

    notification.attemptCount = 0;
    notification.lastAttemptAt = null;

    notification.emailStatus = "FAILED";
    notification.emailMessageId = null;
    notification.emailError = null;
    notification.emailSentAt = null;

    await notification.save();

    console.log(
      `RESEND STARTED | Notification: ${notification._id}`
    );

    console.log(
      `Resend Count: ${notification.resendCount}`
    );

    // =====================================================
    // SEND EMAIL WITH MAX 3 ATTEMPTS
    // =====================================================

    const result = await sendEmailWithRetry({
      to: notification.email,
      subject: notification.title,
      text: notification.message,
    });

    // Record final attempt count
    notification.attemptCount = result.attemptCount;
    notification.lastAttemptAt = new Date();

    // =====================================================
    // SUCCESS
    // =====================================================

    if (result.success) {
      notification.emailStatus = "SENT";
      notification.emailMessageId = result.messageId;
      notification.emailError = null;
      notification.emailSentAt = new Date();

      await notification.save();

      console.log(
        `RESEND SUCCESS | Notification: ${notification._id}`
      );

      return res.status(200).json({
        success: true,
        message: "Email resent successfully",
        notification: {
          _id: notification._id,
          emailStatus: notification.emailStatus,
          emailMessageId: notification.emailMessageId,
          emailSentAt: notification.emailSentAt,
          emailError: notification.emailError,
          attemptCount: notification.attemptCount,
          resendCount: notification.resendCount,
          lastAttemptAt: notification.lastAttemptAt,
        },
      });
    }

    // =====================================================
    // FAILURE
    // =====================================================

    notification.emailStatus = "FAILED";
    notification.emailMessageId = null;
    notification.emailError = result.error;
    notification.emailSentAt = null;

    await notification.save();

    console.log(
      `RESEND FAILED | Notification: ${notification._id}`
    );

    return res.status(500).json({
      success: false,
      message: "Email resend failed after 3 attempts",
      notification: {
        _id: notification._id,
        emailStatus: notification.emailStatus,
        emailMessageId: notification.emailMessageId,
        emailSentAt: notification.emailSentAt,
        emailError: notification.emailError,
        attemptCount: notification.attemptCount,
        resendCount: notification.resendCount,
        lastAttemptAt: notification.lastAttemptAt,
      },
    });
  } catch (error) {
    console.error(
      "Resend notification email error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to resend notification email",
      error: error.message,
    });
  }
};
const deleteAllSentEmails = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!req.user.organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization information missing",
      });
    }

    // Delete ONLY successfully sent notifications
    // belonging to the logged-in user's organization.
    const result = await Notification.deleteMany({
      organizationId: req.user.organizationId,
      emailStatus: "SENT",
    });

    console.log(
      `DELETED SENT EMAILS | Organization: ${req.user.organizationId} | Count: ${result.deletedCount}`
    );

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} successfully sent notification${
        result.deletedCount === 1 ? "" : "s"
      } deleted successfully.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(
      "Delete all sent emails error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete sent notifications",
      error: error.message,
    });
  }
};
module.exports = {
    getEmailDeliveryRecords,
    resendNotificationEmail,
    deleteAllSentEmails,
};