 const VendorDocument = require("../models/VendorDocument");
const Vendor = require("../models/Vendor");
const DocumentType = require("../models/DocumentType");

const expiryReminderQueue = require("../queues/expiryReminderQueue");

const UserNotification = require("../models/UserNotification");
const User = require("../models/User");

// =====================================================
// Get the start of a particular day
// =====================================================

const startOfDay = (date) => {
    const result = new Date(date);

    result.setHours(0, 0, 0, 0);

    return result;
};

// =====================================================
// Get the start of the next day
// =====================================================

const startOfNextDay = (date) => {
    const result = startOfDay(date);

    result.setDate(result.getDate() + 1);

    return result;
};

// =====================================================
// Find documents expiring in a specific number of days
// =====================================================
//
// 15 → 15 days remaining
// 7  → 7 days remaining
// 1  → 1 day remaining
//
// =====================================================

const findDocumentsExpiringIn = async (daysBeforeExpiry) => {
    const today = new Date();

    const targetDate = new Date(today);

    targetDate.setDate(
        targetDate.getDate() + daysBeforeExpiry
    );

    const startDate = startOfDay(targetDate);
    const endDate = startOfNextDay(targetDate);

    const documents = await VendorDocument.find({
        expiryDate: {
            $gte: startDate,
            $lt: endDate,
        },
    });

    return documents;
};

// =====================================================
// Find documents that expired a specific number of days ago
// =====================================================
//
// 1 → expired yesterday
// 3 → expired 3 days ago
// 7 → expired 7 days ago
//
// =====================================================

const findDocumentsExpiredFor = async (daysAfterExpiry) => {
    const today = new Date();

    const targetDate = new Date(today);

    targetDate.setDate(
        targetDate.getDate() - daysAfterExpiry
    );

    const startDate = startOfDay(targetDate);
    const endDate = startOfNextDay(targetDate);

    const documents = await VendorDocument.find({
        expiryDate: {
            $gte: startDate,
            $lt: endDate,
        },
    });

    return documents;
};

// =====================================================
// Add Reminder Job to BullMQ
// =====================================================
//
// The worker handles the 3 email attempts.
//
// Therefore we DO NOT use:
//
// attempts: 3
//
// here.
//
// =====================================================

const addReminderJob = async (
    document,
    reminderType
) => {
    const jobId = `${document._id}_${reminderType}`;

    await expiryReminderQueue.add(
        "document-expiry-reminder",
        {
            documentId: document._id.toString(),

            vendorId: document.vendorId.toString(),

            reminderType,
        },
        {
            jobId,

            removeOnComplete: {
                age: 60 * 60 * 24,
            },

            removeOnFail: {
                age: 60 * 60 * 24 * 7,
            },
        }
    );

    console.log(
        `📋 Reminder job added: ${jobId}`
    );
};

// =====================================================
// Get document information for notification
// =====================================================

const getDocumentNotificationData = async (document) => {
    const vendor = await Vendor.findById(
        document.vendorId
    ).select("_id organizationId name email");

    const documentType = await DocumentType.findById(
        document.documentType
    ).select("_id name");

    return {
        vendor,
        documentType,
    };
};

// =====================================================
// Create Compliance Officer Notification
// =====================================================

const createComplianceNotification = async ({
    document,
    vendor,
    documentType,
    daysRemaining,
}) => {
    if (!vendor) {
        console.warn(
            `⚠️ Vendor not found for document ${document._id}`
        );

        return;
    }

    if (!vendor.organizationId) {
        console.warn(
            `⚠️ Organization not found for vendor ${vendor._id}`
        );

        return;
    }

    // =================================================
    // Notification type
    // =================================================

    let notificationType;

    if (daysRemaining === 15) {
        notificationType =
            "DOCUMENT_EXPIRING_15_DAYS";
    } else if (daysRemaining === 7) {
        notificationType =
            "DOCUMENT_EXPIRING_7_DAYS";
    } else if (daysRemaining === 1) {
        notificationType =
            "DOCUMENT_EXPIRING_1_DAY";
    } else {
        return;
    }

    // =================================================
    // Prevent duplicate notification
    // =================================================

    const complianceOfficers = await User.find({
        organizationId: vendor.organizationId,
        role: "COMPLIANCE_OFFICER",
    }).select("_id");

    if (!complianceOfficers.length) {
        console.log(
            `ℹ️ No Compliance Officers found for organization ${vendor.organizationId}`
        );

        return;
    }

    const documentName =
        documentType?.name || "Document";

    for (const officer of complianceOfficers) {
        const existingNotification =
            await UserNotification.findOne({
                organizationId: vendor.organizationId,
                recipientUserId: officer._id,
                recipientVendorId: null,
                relatedId: document._id,
                relatedType: "VENDOR_DOCUMENT",
                type: notificationType,
            });

        if (existingNotification) {
            console.log(
                `ℹ️ Compliance notification already exists for ${document._id} → ${notificationType}`
            );

            continue;
        }

        let title;
        let message;

        if (daysRemaining === 1) {
            title = "Document Expires Tomorrow";

            message =
                `${documentName} for vendor "${vendor.name}" ` +
                `will expire tomorrow. Please review and take the necessary action.`;
        } else {
            title =
                `Document Expiring in ${daysRemaining} Days`;

            message =
                `${documentName} for vendor "${vendor.name}" ` +
                `will expire in ${daysRemaining} days. Please review and take the necessary action.`;
        }

        await UserNotification.create({
            organizationId: vendor.organizationId,

            recipientUserId: officer._id,

            recipientVendorId: null,

            type: notificationType,

            title,

            message,

            relatedId: document._id,

            relatedType: "VENDOR_DOCUMENT",

            metadata: {
                documentId: document._id,
                vendorId: vendor._id,
                vendorName: vendor.name,
                documentTypeId:
                    documentType?._id || null,
                documentTypeName:
                    documentName,
                expiryDate: document.expiryDate,
                daysRemaining,
            },

            isRead: false,
        });

        console.log(
            `🔔 Compliance notification created: ${notificationType}`
        );
    }
};

// =====================================================
// Create Vendor Notification
// =====================================================

const createVendorNotification = async ({
    document,
    vendor,
    documentType,
    daysRemaining,
}) => {
    if (!vendor) {
        return;
    }

    if (!vendor.organizationId) {
        return;
    }

    // =================================================
    // Notification type
    // =================================================

    let notificationType;

    if (daysRemaining === 15) {
        notificationType =
            "DOCUMENT_EXPIRING_15_DAYS";
    } else if (daysRemaining === 7) {
        notificationType =
            "DOCUMENT_EXPIRING_7_DAYS";
    } else if (daysRemaining === 1) {
        notificationType =
            "DOCUMENT_EXPIRING_1_DAY";
    } else {
        return;
    }

    // =================================================
    // Prevent duplicate notification
    // =================================================

    const existingNotification =
        await UserNotification.findOne({
            organizationId: vendor.organizationId,

            recipientUserId: null,

            recipientVendorId: vendor._id,

            relatedId: document._id,

            relatedType: "VENDOR_DOCUMENT",

            type: notificationType,
        });

    if (existingNotification) {
        console.log(
            `ℹ️ Vendor notification already exists for ${document._id} → ${notificationType}`
        );

        return;
    }

    const documentName =
        documentType?.name || "Document";

    let title;
    let message;

    if (daysRemaining === 1) {
        title = "Your Document Expires Tomorrow";

        message =
            `Your ${documentName} will expire tomorrow. ` +
            `Please upload a renewed document before it expires.`;
    } else {
        title =
            `Your Document Expires in ${daysRemaining} Days`;

        message =
            `Your ${documentName} will expire in ${daysRemaining} days. ` +
            `Please upload a renewed document before it expires.`;
    }

    await UserNotification.create({
        organizationId: vendor.organizationId,

        recipientUserId: null,

        recipientVendorId: vendor._id,

        type: notificationType,

        title,

        message,

        relatedId: document._id,

        relatedType: "VENDOR_DOCUMENT",

        metadata: {
            documentId: document._id,

            vendorId: vendor._id,

            vendorName: vendor.name,

            documentTypeId:
                documentType?._id || null,

            documentTypeName:
                documentName,

            expiryDate: document.expiryDate,

            daysRemaining,
        },

        isRead: false,
    });

    console.log(
        `🔔 Vendor notification created: ${notificationType}`
    );
};

// =====================================================
// Create In-App Expiry Notifications
// =====================================================
//
// Creates notifications for:
//
// Compliance Officer
// Vendor
//
// Supported:
//
// 15 days
// 7 days
// 1 day
//
// =====================================================

const createExpiryNotifications = async ({
    document,
    daysRemaining,
}) => {
    try {
        if (!document?.vendorId) {
            console.warn(
                `⚠️ Document ${document?._id} does not have a vendor`
            );

            return;
        }

        const {
            vendor,
            documentType,
        } =
            await getDocumentNotificationData(
                document
            );

        if (!vendor) {
            console.warn(
                `⚠️ Vendor not found for document ${document._id}`
            );

            return;
        }

        // =================================================
        // Create Compliance Officer notification
        // =================================================

        await createComplianceNotification({
            document,
            vendor,
            documentType,
            daysRemaining,
        });

        // =================================================
        // Create Vendor notification
        // =================================================

        await createVendorNotification({
            document,
            vendor,
            documentType,
            daysRemaining,
        });
    } catch (error) {
        // =================================================
        // IMPORTANT
        // =================================================
        //
        // Notification failure should NOT stop the
        // email reminder system.
        //
        // =================================================

        console.error(
            `❌ Expiry in-app notification error for document ${document?._id}:`,
            error.message
        );
    }
};

// =====================================================
// Process Expiry Reminders
// =====================================================

const processExpiryReminders = async () => {
    try {
        console.log("");

        console.log(
            "============================================"
        );

        console.log(
            "🔍 STARTING EXPIRY REMINDER SCAN"
        );

        console.log(
            "============================================"
        );

        // =================================================
        // 1. Documents expiring in 15 days
        // =================================================

        const documents15Days =
            await findDocumentsExpiringIn(15);

        for (const document of documents15Days) {

            // =============================================
            // Existing email reminder
            // =============================================

            await addReminderJob(
                document,
                "15_DAY"
            );

            // =============================================
            // In-app notifications
            // =============================================

            await createExpiryNotifications({
                document,
                daysRemaining: 15,
            });
        }

        // =================================================
        // 2. Documents expiring in 7 days
        // =================================================

        const documents7Days =
            await findDocumentsExpiringIn(7);

        for (const document of documents7Days) {

            // Existing email reminder
            await addReminderJob(
                document,
                "7_DAY"
            );

            // In-app notifications
            await createExpiryNotifications({
                document,
                daysRemaining: 7,
            });
        }

        // =================================================
        // 3. Documents expiring in 1 day
        // =================================================

        const documents1Day =
            await findDocumentsExpiringIn(1);

        for (const document of documents1Day) {

            // Existing email reminder
            await addReminderJob(
                document,
                "1_DAY"
            );

            // In-app notifications
            await createExpiryNotifications({
                document,
                daysRemaining: 1,
            });
        }

        // =================================================
        // 4. Documents expired 1 day ago
        // =================================================

        const documentsExpired1Day =
            await findDocumentsExpiredFor(1);

        for (const document of documentsExpired1Day) {

            await addReminderJob(
                document,
                "EXPIRED_1_DAY"
            );
        }

        // =================================================
        // 5. Documents expired 3 days ago
        // =================================================

        const documentsExpired3Days =
            await findDocumentsExpiredFor(3);

        for (const document of documentsExpired3Days) {

            await addReminderJob(
                document,
                "EXPIRED_3_DAY"
            );
        }

        // =================================================
        // 6. Documents expired 7 days ago
        // =================================================

        const documentsExpired7Days =
            await findDocumentsExpiredFor(7);

        for (const document of documentsExpired7Days) {

            await addReminderJob(
                document,
                "EXPIRED_7_DAY"
            );
        }

        // =================================================
        // Scan Summary
        // =================================================

        console.log("");

        console.log(
            "============================================"
        );

        console.log(
            "✅ EXPIRY REMINDER SCAN COMPLETED"
        );

        console.log(
            "============================================"
        );

        console.log(
            `15-day reminders: ${documents15Days.length}`
        );

        console.log(
            `7-day reminders: ${documents7Days.length}`
        );

        console.log(
            `1-day reminders: ${documents1Day.length}`
        );

        console.log(
            `Expired 1-day reminders: ${documentsExpired1Day.length}`
        );

        console.log(
            `Expired 3-day reminders: ${documentsExpired3Days.length}`
        );

        console.log(
            `Expired 7-day reminders: ${documentsExpired7Days.length}`
        );

        console.log(
            "============================================"
        );

        console.log("");

        return {
            documents15Days,
            documents7Days,
            documents1Day,
            documentsExpired1Day,
            documentsExpired3Days,
            documentsExpired7Days,
        };
    } catch (error) {

        console.error(
            "❌ Process expiry reminders error:",
            error.message
        );

        throw error;
    }
};

// =====================================================
// Export
// =====================================================

module.exports = {
    findDocumentsExpiringIn,
    findDocumentsExpiredFor,
    processExpiryReminders,
};