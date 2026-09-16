const VendorDocument = require("../models/VendorDocument");

const expiryReminderQueue = require("../queues/expiryReminderQueue");

// =====================================================
// Get the start of a particular day
// =====================================================
//
// Example:
// Target date = 18 September
// Start = 18 September 00:00:00
//
const startOfDay = (date) => {
    const result = new Date(date);

    result.setHours(0, 0, 0, 0);

    return result;
};

// =====================================================
// Get the start of the next day
// =====================================================
//
// Example:
// 18 September → 19 September 00:00:00
//
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
const findDocumentsExpiringIn = async (daysBeforeExpiry) => {

    // Get today's date
    const today = new Date();

    // Calculate the target expiry date
    const targetDate = new Date(today);

    targetDate.setDate(
        targetDate.getDate() + daysBeforeExpiry
    );

    // Get start and end of the target date
    const startDate = startOfDay(targetDate);

    const endDate = startOfNextDay(targetDate);

    // Find documents expiring on the target date
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
const findDocumentsExpiredFor = async (daysAfterExpiry) => {

    // Get today's date
    const today = new Date();

    // Calculate the date on which the document expired
    const targetDate = new Date(today);

    targetDate.setDate(
        targetDate.getDate() - daysAfterExpiry
    );

    // Get start and end of the expiry date
    const startDate = startOfDay(targetDate);

    const endDate = startOfNextDay(targetDate);

    // Find documents whose expiry date matches the target date
    const documents = await VendorDocument.find({
        expiryDate: {
            $gte: startDate,
            $lt: endDate,
        },
    });

    return documents;
};

// =====================================================
// Add a reminder job to BullMQ
// =====================================================
//
// reminderType:
//
// 15_DAY
// 7_DAY
// 1_DAY
// EXPIRED_1_DAY
// EXPIRED_3_DAY
// EXPIRED_7_DAY
//
const addReminderJob = async (
    document,
    reminderType
) => {

    // Create a unique job ID.
    //
    // This prevents the same document from getting
    // the same reminder job multiple times.
    //
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

            // Try sending the reminder email up to 3 times.
            //
            // If the email fails, BullMQ will retry the job.
            attempts: 3,

            // Use exponential backoff between retries.
            //
            // First retry  -> 5 minutes
            // Second retry -> 10 minutes
            //
            backoff: {
                type: "exponential",
                delay: 5 * 60 * 1000,
            },

            // Keep completed jobs in Redis for 24 hours.
            //
            // Successful jobs are not needed forever.
            //
            removeOnComplete: {
                age: 60 * 60 * 24,
            },

            // Keep failed jobs in Redis for 7 days.
            //
            // This allows the Super Admin to inspect
            // failed reminder jobs from Activity Logs.
            //
            removeOnFail: {
                age: 60 * 60 * 24 * 7,
            },
        }
    );

    console.log(
        `Reminder job added: ${jobId}`
    );
};

// =====================================================
// Find expiry reminders and add them to the queue
// =====================================================

const processExpiryReminders = async () => {

    try {

        // =================================================
        // 1. Find documents expiring in 15 days
        // =================================================

        const documents15Days =
            await findDocumentsExpiringIn(15);

        // Add each document to the BullMQ queue
        for (const document of documents15Days) {

            await addReminderJob(
                document,
                "15_DAY"
            );
        }

        // =================================================
        // 2. Find documents expiring in 7 days
        // =================================================

        const documents7Days =
            await findDocumentsExpiringIn(7);

        // Add each document to the BullMQ queue
        for (const document of documents7Days) {

            await addReminderJob(
                document,
                "7_DAY"
            );
        }

        // =================================================
        // 3. Find documents expiring in 1 day
        // =================================================

        const documents1Day =
            await findDocumentsExpiringIn(1);

        // Add each document to the BullMQ queue
        for (const document of documents1Day) {

            await addReminderJob(
                document,
                "1_DAY"
            );
        }

        // =================================================
        // 4. Find documents expired 1 day ago
        // =================================================
        //
        // This reminder is sent one day after
        // the document has expired.
        //
        const documentsExpired1Day =
            await findDocumentsExpiredFor(1);

        for (const document of documentsExpired1Day) {

            await addReminderJob(
                document,
                "EXPIRED_1_DAY"
            );
        }

        // =================================================
        // 5. Find documents expired 3 days ago
        // =================================================
        //
        // This reminder is sent three days after
        // the document has expired.
        //
        const documentsExpired3Days =
            await findDocumentsExpiredFor(3);

        for (const document of documentsExpired3Days) {

            await addReminderJob(
                document,
                "EXPIRED_3_DAY"
            );
        }

        // =================================================
        // 6. Find documents expired 7 days ago
        // =================================================
        //
        // This is the final expired reminder.
        // No reminder will be scheduled after this.
        //
        const documentsExpired7Days =
            await findDocumentsExpiredFor(7);

        for (const document of documentsExpired7Days) {

            await addReminderJob(
                document,
                "EXPIRED_7_DAY"
            );
        }

        // =================================================
        // Log reminder scan summary
        // =================================================

        console.log(
            "Expiry reminder scan completed."
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
            "Process expiry reminders error:",
            error.message
        );

        // Throw the error so the scheduler knows
        // that the reminder scan failed.
        throw error;
    }
};

module.exports = {

    findDocumentsExpiringIn,

    findDocumentsExpiredFor,

    processExpiryReminders,
};