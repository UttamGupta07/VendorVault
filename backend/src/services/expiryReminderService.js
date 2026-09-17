 const VendorDocument = require("../models/VendorDocument");
const expiryReminderQueue = require("../queues/expiryReminderQueue");

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
// daysBeforeExpiry:
//
// 15 → 15 days remaining
// 7  → 7 days remaining
// 1  → 1 day remaining
//
// =====================================================

const findDocumentsExpiringIn = async (
    daysBeforeExpiry
) => {
    // Today's date
    const today = new Date();

    // Calculate target expiry date
    const targetDate = new Date(today);

    targetDate.setDate(
        targetDate.getDate() + daysBeforeExpiry
    );

    // Start and end of target date
    const startDate = startOfDay(targetDate);

    const endDate = startOfNextDay(targetDate);

    // Find documents expiring on target date
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
// daysAfterExpiry:
//
// 1 → expired yesterday
// 3 → expired 3 days ago
// 7 → expired 7 days ago
//
// =====================================================

const findDocumentsExpiredFor = async (
    daysAfterExpiry
) => {
    // Today's date
    const today = new Date();

    // Calculate target expiry date
    const targetDate = new Date(today);

    targetDate.setDate(
        targetDate.getDate() - daysAfterExpiry
    );

    // Start and end of expiry date
    const startDate = startOfDay(targetDate);

    const endDate = startOfNextDay(targetDate);

    // Find documents whose expiry date
    // matches target date
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
// IMPORTANT:
//
// The worker itself handles the 3 email attempts.
//
// Therefore we DO NOT use:
//
// attempts: 3
//
// here.
//
// Otherwise BullMQ could execute the whole worker
// multiple times and cause unwanted duplicate
// processing.
//
// =====================================================

const addReminderJob = async (
    document,
    reminderType
) => {
    // =================================================
    // Unique Job ID
    // =================================================
    //
    // Example:
    //
    // 68abc123_7_DAY
    //
    // This prevents duplicate jobs for the same
    // document + reminder type.
    //
    const jobId =
        `${document._id}_${reminderType}`;

    // =================================================
    // Add job
    // =================================================

    await expiryReminderQueue.add(
        "document-expiry-reminder",
        {
            documentId:
                document._id.toString(),

            vendorId:
                document.vendorId.toString(),

            reminderType,
        },
        {
            jobId,

            // =================================================
            // IMPORTANT
            // =================================================
            //
            // Do not put attempts: 3 here.
            //
            // The worker handles exactly 3 email attempts.
            //
            // =================================================

            // Keep completed jobs in Redis for 24 hours
            removeOnComplete: {
                age: 60 * 60 * 24,
            },

            // Keep failed infrastructure jobs in Redis
            // for 7 days.
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
            await addReminderJob(
                document,
                "15_DAY"
            );
        }

        // =================================================
        // 2. Documents expiring in 7 days
        // =================================================

        const documents7Days =
            await findDocumentsExpiringIn(7);

        for (const document of documents7Days) {
            await addReminderJob(
                document,
                "7_DAY"
            );
        }

        // =================================================
        // 3. Documents expiring in 1 day
        // =================================================

        const documents1Day =
            await findDocumentsExpiringIn(1);

        for (const document of documents1Day) {
            await addReminderJob(
                document,
                "1_DAY"
            );
        }

        // =================================================
        // 4. Documents expired 1 day ago
        // =================================================

        const documentsExpired1Day =
            await findDocumentsExpiredFor(1);

        for (
            const document of documentsExpired1Day
        ) {
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

        for (
            const document of documentsExpired3Days
        ) {
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

        for (
            const document of documentsExpired7Days
        ) {
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

        // Let scheduler know the scan failed
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