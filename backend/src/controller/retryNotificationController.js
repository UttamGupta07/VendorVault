const Notification = require("../models/Notification");

const {
    sendEmailWithRetry,
} = require("../services/emailService");

// =====================================================
// RESEND FAILED NOTIFICATION EMAIL
// =====================================================

/**
 * Manually resend a failed notification email.
 *
 * Rules:
 *
 * 1. Notification must exist.
 * 2. Notification must belong to the logged-in user's
 *    organization.
 * 3. Only FAILED notifications can be resent.
 * 4. Same notification is updated.
 * 5. New notification is NOT created.
 * 6. One resend cycle can make up to 3 email attempts.
 * 7. resendCount increases by 1 for every manual resend.
 * 8. attemptCount represents attempts in the latest
 *    delivery cycle.
 */
const resendNotificationEmail = async (
    req,
    res
) => {
    try {
        const {
            notificationId,
        } = req.params;

        // =================================================
        // 1. VALIDATE NOTIFICATION ID
        // =================================================

        if (!notificationId) {
            return res.status(400).json({
                success: false,
                message:
                    "Notification ID is required",
            });
        }

        // =================================================
        // 2. VALIDATE ORGANIZATION
        // =================================================

        if (!req.user?.organizationId) {
            return res.status(403).json({
                success: false,
                message:
                    "Organization information is missing",
            });
        }

        // =================================================
        // 3. FIND NOTIFICATION
        // =================================================

        const notification =
            await Notification.findOne({
                _id: notificationId,

                organizationId:
                    req.user.organizationId,
            });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message:
                    "Notification not found",
            });
        }

        // =================================================
        // 4. ONLY FAILED NOTIFICATIONS
        // =================================================

        if (
            notification.emailStatus !==
            "FAILED"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Only failed email notifications can be resent",
            });
        }

        // =================================================
        // 5. CHECK EMAIL
        // =================================================

        if (!notification.email) {
            return res.status(400).json({
                success: false,
                message:
                    "No email address is available for this notification",
            });
        }

        // =================================================
        // 6. START RESEND CYCLE
        // =================================================

        console.log("");
        console.log("============================================");
        console.log("🔄 MANUAL EMAIL RESEND STARTED");
        console.log("============================================");

        console.log(
            "Notification ID:",
            notification._id
        );

        console.log(
            "Email:",
            notification.email
        );

        console.log(
            "Previous Email Status:",
            notification.emailStatus
        );

        console.log(
            "Previous Attempt Count:",
            notification.attemptCount
        );

        console.log(
            "Previous Resend Count:",
            notification.resendCount
        );

        console.log("============================================");

        // =================================================
        // 7. INCREASE RESEND COUNT
        // =================================================
        //
        // resendCount means:
        //
        // 0 = automatic notification
        // 1 = first manual resend
        // 2 = second manual resend
        // etc.
        //
        // =================================================

        notification.resendCount =
            (notification.resendCount || 0) + 1;

        // Reset the latest delivery-cycle fields
        // before sending.
        notification.attemptCount = 0;

        notification.lastAttemptAt = null;

        // Keep status FAILED until the email
        // is actually successful.
        notification.emailStatus =
            "FAILED";

        notification.emailMessageId =
            null;

        notification.emailError =
            null;

        notification.emailSentAt =
            null;

        await notification.save();

        // =================================================
        // 8. SEND EMAIL WITH 3 ATTEMPTS
        // =================================================

        const emailResult =
            await sendEmailWithRetry({
                to: notification.email,

                subject:
                    notification.title,

                text:
                    notification.message,
            });

        // =================================================
        // 9. UPDATE ATTEMPT INFORMATION
        // =================================================

        notification.attemptCount =
            emailResult.attemptCount;

        notification.lastAttemptAt =
            new Date();

        // =================================================
        // 10. SUCCESS
        // =================================================

        if (emailResult.success) {
            notification.emailStatus =
                "SENT";

            notification.emailMessageId =
                emailResult.messageId;

            notification.emailError =
                null;

            notification.emailSentAt =
                new Date();

            await notification.save();

            console.log("");
            console.log("============================================");
            console.log("✅ MANUAL RESEND SUCCESSFUL");
            console.log("============================================");

            console.log(
                "Notification ID:",
                notification._id
            );

            console.log(
                "Email:",
                notification.email
            );

            console.log(
                "Email Status:",
                notification.emailStatus
            );

            console.log(
                "Message ID:",
                notification.emailMessageId
            );

            console.log(
                "Attempt Count:",
                notification.attemptCount
            );

            console.log(
                "Resend Count:",
                notification.resendCount
            );

            console.log(
                "Email Sent At:",
                notification.emailSentAt
            );

            console.log("============================================");

            return res.status(200).json({
                success: true,

                message:
                    "Notification email resent successfully",

                data: {
                    notificationId:
                        notification._id,

                    email:
                        notification.email,

                    emailStatus:
                        notification.emailStatus,

                    emailMessageId:
                        notification.emailMessageId,

                    attemptCount:
                        notification.attemptCount,

                    resendCount:
                        notification.resendCount,

                    emailError:
                        notification.emailError,

                    emailSentAt:
                        notification.emailSentAt,

                    lastAttemptAt:
                        notification.lastAttemptAt,
                },
            });
        }

        // =================================================
        // 11. FAILURE AFTER ALL 3 ATTEMPTS
        // =================================================

        notification.emailStatus =
            "FAILED";

        notification.emailMessageId =
            null;

        notification.emailError =
            emailResult.error;

        notification.emailSentAt =
            null;

        await notification.save();

        console.error("");
        console.error("============================================");
        console.error("❌ MANUAL RESEND FAILED");
        console.error("============================================");

        console.error(
            "Notification ID:",
            notification._id
        );

        console.error(
            "Email:",
            notification.email
        );

        console.error(
            "Email Status:",
            notification.emailStatus
        );

        console.error(
            "Error:",
            notification.emailError
        );

        console.error(
            "Attempt Count:",
            notification.attemptCount
        );

        console.error(
            "Resend Count:",
            notification.resendCount
        );

        console.error("============================================");

        return res.status(500).json({
            success: false,

            message:
                "Email resend failed after 3 attempts",

            data: {
                notificationId:
                    notification._id,

                email:
                    notification.email,

                emailStatus:
                    notification.emailStatus,

                emailMessageId:
                    notification.emailMessageId,

                attemptCount:
                    notification.attemptCount,

                resendCount:
                    notification.resendCount,

                emailError:
                    notification.emailError,

                emailSentAt:
                    notification.emailSentAt,

                lastAttemptAt:
                    notification.lastAttemptAt,
            },
        });
    } catch (error) {
        console.error("");
        console.error("============================================");
        console.error("❌ RESEND CONTROLLER ERROR");
        console.error("============================================");

        console.error(
            error?.message || error
        );

        console.error("============================================");

        return res.status(500).json({
            success: false,

            message:
                "Failed to resend notification email",

            error:
                error?.message ||
                "Internal server error",
        });
    }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    resendNotificationEmail,
};

