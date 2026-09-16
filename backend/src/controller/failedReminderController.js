const { Queue } = require("bullmq");

const redis = require("../config/redis");

// Create a connection to the expiry reminder queue.
// We only read failed jobs here; we do not create or process jobs.
const expiryReminderQueue = new Queue("expiry-reminder", {
    connection: redis,
});

// =====================================================
// Get failed expiry reminder jobs
// =====================================================

const getFailedReminderJobs = async (req, res) => {
    try {

        // Get failed jobs from BullMQ.
        // We fetch the latest 100 failed jobs.
        const jobs = await expiryReminderQueue.getJobs(
            ["failed"],
            0,
            99
        );

        // Convert BullMQ jobs into data required by Admin.
        const failedJobs = jobs.map((job) => ({
            jobId: job.id,

            // Document and vendor IDs are stored in job.data.
            documentId: job.data?.documentId,
            vendorId: job.data?.vendorId,

            // Example: 15_DAY, 7_DAY, 1_DAY
            reminderType: job.data?.reminderType,

            // Number of attempts already made.
            attempts: job.attemptsMade,

            // Reason why the job finally failed.
            reason: job.failedReason || "Unknown error",

            // Time when the job failed.
            failedAt: job.finishedOn
                ? new Date(job.finishedOn)
                : null,
        }));

        res.status(200).json({
            success: true,
            count: failedJobs.length,
            jobs: failedJobs,
        });

    } catch (error) {

        console.error(
            "Get failed reminder jobs error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch failed reminder jobs",
        });
    }
};

module.exports = {
    getFailedReminderJobs,
};