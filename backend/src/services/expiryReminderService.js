const VendorDocument = require("../models/VendorDocument");
const expiryReminderQueue = require("../queues/expiryReminderQueue");

// =====================================================
// Get the start of a particular day
// =====================================================
// Example:
// Target date = 18 September
// Start = 18 September 00:00:00
const startOfDay = (date) => {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
};

// =====================================================
// Get the start of the next day
// =====================================================
// Example:
// 18 September → 19 September 00:00:00
const startOfNextDay = (date) => {
  const result = startOfDay(date);

  result.setDate(result.getDate() + 1);

  return result;
};

// =====================================================
// Find documents expiring in a specific number of days
// =====================================================
// daysBeforeExpiry:
// 15 → 15 days remaining
// 7  → 7 days remaining
// 1  → 1 day remaining
const findDocumentsExpiringIn = async (daysBeforeExpiry) => {
  // Get today's date
  const today = new Date();

  // Calculate target expiry date
  const targetDate = new Date(today);

  targetDate.setDate(
    targetDate.getDate() + daysBeforeExpiry
  );

  // Get start and end of target date
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
// Add a reminder job to BullMQ
// =====================================================
// reminderType:
// 15_DAY
// 7_DAY
// 1_DAY
const addReminderJob = async (
  document,
  reminderType
) => {
  // Create a unique job ID.
  //
  // This prevents the same document from getting
  // the same reminder job multiple times.
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

      // Keep completed jobs for a limited time.
      // We don't need them forever in Redis.
      removeOnComplete: {
        age: 60 * 60 * 24,
      },

      // Keep failed jobs for 7 days so we can debug them.
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
    // -----------------------------------------------
    // 1. Find documents expiring in 15 days
    // -----------------------------------------------
    const documents15Days =
      await findDocumentsExpiringIn(15);

    // Add each document to the queue
    for (const document of documents15Days) {
      await addReminderJob(
        document,
        "15_DAY"
      );
    }

    // -----------------------------------------------
    // 2. Find documents expiring in 7 days
    // -----------------------------------------------
    const documents7Days =
      await findDocumentsExpiringIn(7);

    for (const document of documents7Days) {
      await addReminderJob(
        document,
        "7_DAY"
      );
    }

    // -----------------------------------------------
    // 3. Find documents expiring in 1 day
    // -----------------------------------------------
    const documents1Day =
      await findDocumentsExpiringIn(1);

    for (const document of documents1Day) {
      await addReminderJob(
        document,
        "1_DAY"
      );
    }

    // -----------------------------------------------
    // Log summary
    // -----------------------------------------------
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

    return {
      documents15Days,
      documents7Days,
      documents1Day,
    };
  } catch (error) {
    console.error(
      "Process expiry reminders error:",
      error.message
    );

    throw error;
  }
};

module.exports = {
  findDocumentsExpiringIn,
  processExpiryReminders,
};