require("dotenv").config();

const { Worker } = require("bullmq");

const connectDB = require("../db/db");
const redisConnection = require("../config/redis");

const VendorDocument = require("../models/VendorDocument");
const Vendor = require("../models/Vendor");
const Notification = require("../models/Notification");

const {
    sendEmailWithRetry,
} = require("../services/emailService");

// =====================================================
// CONFIGURATION
// =====================================================

const QUEUE_NAME = "expiry-reminder";

const MAX_EMAIL_ATTEMPTS = 3;

const CONCURRENCY = 5;

// =====================================================
// BUILD NOTIFICATION CONTENT
// =====================================================

const buildNotificationContent = ({
    reminderType,
    document,
    vendor,
}) => {
    const expiryDate = new Date(
        document.expiryDate
    );

    const formattedExpiryDate =
        expiryDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    let title;
    let message;

    switch (reminderType) {
        // =============================================
        // 15 DAYS
        // =============================================

        case "15_DAY":
            title = "Document Expiring in 15 Days";

            message =
                `The document "${document.documentType}" ` +
                `for vendor "${vendor.companyName}" ` +
                `will expire on ${formattedExpiryDate}. ` +
                `Please renew the document before expiry.`;

            break;

        // =============================================
        // 7 DAYS
        // =============================================

        case "7_DAY":
            title = "Document Expiring in 7 Days";

            message =
                `The document "${document.documentType}" ` +
                `for vendor "${vendor.companyName}" ` +
                `will expire on ${formattedExpiryDate}. ` +
                `Only 7 days remain. Please take action immediately.`;

            break;

        // =============================================
        // 1 DAY
        // =============================================

        case "1_DAY":
            title = "Document Expiring Tomorrow";

            message =
                `The document "${document.documentType}" ` +
                `for vendor "${vendor.companyName}" ` +
                `will expire on ${formattedExpiryDate}. ` +
                `Please renew the document immediately.`;

            break;

        // =============================================
        // EXPIRED 1 DAY
        // =============================================

        case "EXPIRED_1_DAY":
            title = "Document Expired";

            message =
                `The document "${document.documentType}" ` +
                `for vendor "${vendor.companyName}" ` +
                `expired on ${formattedExpiryDate}. ` +
                `Please upload a renewed document immediately.`;

            break;

        // =============================================
        // EXPIRED 3 DAYS
        // =============================================

        case "EXPIRED_3_DAY":
            title = "Document Expired for 3 Days";

            message =
                `The document "${document.documentType}" ` +
                `for vendor "${vendor.companyName}" ` +
                `has been expired for 3 days. ` +
                `Immediate action is required.`;

            break;

        // =============================================
        // EXPIRED 7 DAYS
        // =============================================

        case "EXPIRED_7_DAY":
            title = "Document Expired for 7 Days";

            message =
                `The document "${document.documentType}" ` +
                `for vendor "${vendor.companyName}" ` +
                `has been expired for 7 days. ` +
                `Please upload a valid document immediately ` +
                `to restore compliance.`;

            break;

        // =============================================
        // DEFAULT
        // =============================================

        default:
            title = "Document Expiry Notification";

            message =
                `The document "${document.documentType}" ` +
                `for vendor "${vendor.companyName}" ` +
                `requires attention.`;

            break;
    }

    return {
        title,
        message,
    };
};

// =====================================================
// BULLMQ WORKER
// =====================================================

const worker = new Worker(
    QUEUE_NAME,

    async (job) => {
        console.log("");
        console.log("============================================");
        console.log("🚀 EXPIRY REMINDER JOB STARTED");
        console.log("============================================");

        console.log("Job ID:", job.id);
        console.log("Job Name:", job.name);
        console.log("Job Data:", job.data);

        console.log("============================================");

        const {
            documentId,
            vendorId,
            reminderType,
        } = job.data;

        // =================================================
        // 1. VALIDATE JOB DATA
        // =================================================

        if (
            !documentId ||
            !vendorId ||
            !reminderType
        ) {
            console.error(
                "❌ Invalid expiry reminder job data"
            );

            return {
                success: false,
                reason: "INVALID_JOB_DATA",
            };
        }

        // =================================================
        // 2. FIND DOCUMENT
        // =================================================

        const document =
            await VendorDocument.findById(
                documentId
            );

        if (!document) {
            console.log(
                `⚠️ Document not found: ${documentId}`
            );

            return {
                success: false,
                reason: "DOCUMENT_NOT_FOUND",
            };
        }

        // =================================================
        // 3. VERIFY DOCUMENT BELONGS TO VENDOR
        // =================================================

        if (
            !document.vendorId ||
            document.vendorId.toString() !==
                vendorId.toString()
        ) {
            console.error(
                `❌ Document ${documentId} does not belong to vendor ${vendorId}`
            );

            return {
                success: false,
                reason:
                    "VENDOR_DOCUMENT_MISMATCH",
            };
        }

        // =================================================
        // 4. FIND VENDOR
        // =================================================

        const vendor =
            await Vendor.findById(vendorId);

        if (!vendor) {
            console.log(
                `⚠️ Vendor not found: ${vendorId}`
            );

            return {
                success: false,
                reason: "VENDOR_NOT_FOUND",
            };
        }

        // =================================================
        // 5. ORGANIZATION VALIDATION
        // =================================================

        if (!vendor.organizationId) {
            console.error(
                `❌ Vendor ${vendorId} has no organizationId`
            );

            return {
                success: false,
                reason:
                    "ORGANIZATION_NOT_FOUND",
            };
        }

        // =================================================
        // 6. EMAIL VALIDATION
        // =================================================

        if (!vendor.email) {
            console.error(
                `❌ Vendor ${vendorId} has no email`
            );

            return {
                success: false,
                reason:
                    "VENDOR_EMAIL_NOT_FOUND",
            };
        }

        // =================================================
        // 7. EXPIRY DATE VALIDATION
        // =================================================

        if (!document.expiryDate) {
            console.log(
                `⚠️ Document ${documentId} has no expiry date`
            );

            return {
                success: false,
                reason:
                    "EXPIRY_DATE_NOT_FOUND",
            };
        }

        // =================================================
        // 8. CHECK DUPLICATE NOTIFICATION
        // =================================================

        const existingNotification =
            await Notification.findOne({
                organizationId:
                    vendor.organizationId,

                vendorId: vendor._id,

                documentId: document._id,

                reminderType,
            });

        if (existingNotification) {
            console.log("");
            console.log(
                "ℹ️ NOTIFICATION ALREADY EXISTS"
            );

            console.log(
                "Notification ID:",
                existingNotification._id
            );

            console.log(
                "Email Status:",
                existingNotification.emailStatus
            );

            console.log(
                "Attempt Count:",
                existingNotification.attemptCount
            );

            console.log(
                "Resend Count:",
                existingNotification.resendCount
            );

            return {
                success: true,

                skipped: true,

                reason:
                    "NOTIFICATION_ALREADY_EXISTS",

                notificationId:
                    existingNotification._id,

                emailStatus:
                    existingNotification.emailStatus,
            };
        }

        // =================================================
        // 9. BUILD CONTENT
        // =================================================

        const {
            title,
            message,
        } = buildNotificationContent({
            reminderType,
            document,
            vendor,
        });

        // =================================================
        // 10. CREATE NOTIFICATION FIRST
        // =================================================
        //
        // IMPORTANT:
        //
        // We create the MongoDB notification BEFORE
        // sending the email.
        //
        // This guarantees that even if email sending
        // fails, the notification exists.
        //
        // Initial values:
        //
        // emailStatus     = FAILED
        // emailMessageId  = null
        // emailError      = null
        // emailSentAt     = null
        // attemptCount    = 0
        // resendCount     = 0
        // lastAttemptAt   = null
        //
        // Once email succeeds, these fields are updated.
        //
        // =================================================

        let notification;

        try {
            notification =
                await Notification.create({
                    organizationId:
                        vendor.organizationId,

                    vendorId:
                        vendor._id,

                    documentId:
                        document._id,

                    reminderType,

                    title,

                    message,

                    email:
                        vendor.email,

                    // Initial state
                    emailStatus: "FAILED",

                    emailMessageId: null,

                    emailError: null,

                    emailSentAt: null,

                    // Automatic delivery
                    resendCount: 0,

                    // No attempt made yet
                    attemptCount: 0,

                    lastAttemptAt: null,

                    isRead: false,
                });
        } catch (error) {
            // =============================================
            // Duplicate race condition
            // =============================================

            if (
                error?.code === 11000
            ) {
                const duplicate =
                    await Notification.findOne({
                        organizationId:
                            vendor.organizationId,

                        vendorId: vendor._id,

                        documentId: document._id,

                        reminderType,
                    });

                console.log(
                    "ℹ️ Duplicate notification detected"
                );

                return {
                    success: true,

                    skipped: true,

                    reason:
                        "NOTIFICATION_ALREADY_EXISTS",

                    notificationId:
                        duplicate?._id || null,
                };
            }

            throw error;
        }

        console.log("");
        console.log("============================================");
        console.log("🔔 NOTIFICATION CREATED");
        console.log("============================================");

        console.log(
            "Notification ID:",
            notification._id
        );

        console.log(
            "Organization ID:",
            notification.organizationId
        );

        console.log(
            "Vendor ID:",
            notification.vendorId
        );

        console.log(
            "Document ID:",
            notification.documentId
        );

        console.log(
            "Reminder Type:",
            notification.reminderType
        );

        console.log(
            "Email:",
            notification.email
        );

        console.log(
            "Initial Email Status:",
            notification.emailStatus
        );

        console.log(
            "Initial Attempt Count:",
            notification.attemptCount
        );

        console.log(
            "Initial Resend Count:",
            notification.resendCount
        );

        console.log("============================================");

        // =================================================
        // 11. SEND EMAIL
        // =================================================

        console.log("");
        console.log(
            "📨 STARTING EMAIL DELIVERY..."
        );

        const emailStartedAt = new Date();

        const emailResult =
            await sendEmailWithRetry({
                to: vendor.email,

                subject: title,

                text: message,
            });

        // =================================================
        // 12. UPDATE LAST ATTEMPT
        // =================================================

        notification.attemptCount =
            emailResult.attemptCount;

        notification.lastAttemptAt =
            new Date();

        // =================================================
        // 13. EMAIL SUCCESS
        // =================================================

        if (emailResult.success) {
            notification.emailStatus =
                "SENT";

            notification.emailMessageId =
                emailResult.messageId;

            notification.emailError = null;

            notification.emailSentAt =
                new Date();

            await notification.save();

            console.log("");
            console.log("============================================");
            console.log("✅ EMAIL DELIVERY SUCCESSFUL");
            console.log("============================================");

            console.log(
                "Notification ID:",
                notification._id
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

            console.log(
                "Delivery Started At:",
                emailStartedAt
            );

            console.log("============================================");

            return {
                success: true,

                notificationId:
                    notification._id,

                emailStatus:
                    notification.emailStatus,

                emailMessageId:
                    notification.emailMessageId,

                attemptCount:
                    notification.attemptCount,

                resendCount:
                    notification.resendCount,
            };
        }

        // =================================================
        // 14. EMAIL FAILED
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
        console.error("❌ EMAIL DELIVERY FAILED");
        console.error("============================================");

        console.error(
            "Notification ID:",
            notification._id
        );

        console.error(
            "Email Status:",
            notification.emailStatus
        );

        console.error(
            "Email Error:",
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

        // IMPORTANT:
        //
        // Do NOT throw the email error here.
        //
        // The email service has already performed all
        // 3 attempts.
        //
        // The notification has been stored as FAILED.
        //
        // Compliance Officer can manually resend it.
        //
        return {
            success: false,

            notificationId:
                notification._id,

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
        };
    },

    {
        connection: redisConnection,

        concurrency: CONCURRENCY,
    }
);

// =====================================================
// BULLMQ COMPLETED
// =====================================================

worker.on(
    "completed",
    (job, result) => {
        console.log("");
        console.log("============================================");
        console.log("✅ BULLMQ JOB COMPLETED");
        console.log("============================================");

        console.log(
            "Job ID:",
            job?.id
        );

        console.log(
            "Result:",
            result
        );

        console.log("============================================");
    }
);

// =====================================================
// BULLMQ FAILED
// =====================================================

worker.on(
    "failed",
    (job, error) => {
        console.error("");
        console.error("============================================");
        console.error("❌ BULLMQ JOB FAILED");
        console.error("============================================");

        console.error(
            "Job ID:",
            job?.id
        );

        console.error(
            "Error:",
            error?.message
        );

        console.error("============================================");
    }
);

// =====================================================
// WORKER ERROR
// =====================================================

worker.on(
    "error",
    (error) => {
        console.error("");
        console.error("============================================");
        console.error("❌ BULLMQ WORKER ERROR");
        console.error("============================================");

        console.error(
            error?.message || error
        );

        console.error("============================================");
    }
);

// =====================================================
// START WORKER
// =====================================================

const startWorker = async () => {
    try {
        await connectDB();

        console.log("");
        console.log("============================================");
        console.log("🚀 EXPIRY REMINDER WORKER STARTED");
        console.log("============================================");

        console.log(
            "Queue:",
            QUEUE_NAME
        );

        console.log(
            "Maximum Email Attempts:",
            MAX_EMAIL_ATTEMPTS
        );

        console.log(
            "Retry Delay:",
            "5 seconds"
        );

        console.log(
            "Concurrency:",
            CONCURRENCY
        );

        console.log("============================================");
        console.log("");
    } catch (error) {
        console.error("");
        console.error(
            "❌ FAILED TO START EXPIRY REMINDER WORKER"
        );

        console.error(
            error
        );

        process.exit(1);
    }
};

// =====================================================
// START
// =====================================================

startWorker();

