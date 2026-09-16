require("dotenv").config();

const cron = require("node-cron");

const connectdb = require("../db/db");

const {
    processExpiryReminders,
} = require("../services/expiryReminderService");

const startExpiryReminderScheduler = async () => {
    try {

        // =====================================================
        // Connect scheduler with MongoDB
        // =====================================================

        await connectdb();

        console.log(
            "Expiry scheduler MongoDB connection ready"
        );

        // =====================================================
        // Run reminder scan immediately when scheduler starts
        // =====================================================
        //
        // This is useful for testing and also makes sure
        // documents are not missed when the server starts.
        //

        console.log(
            "Starting expiry reminder scan..."
        );

        try {

            await processExpiryReminders();

            console.log(
                "Expiry reminder scan completed."
            );

        } catch (error) {

            console.error(
                "Expiry reminder scan failed:",
                error.message
            );
        }

        // =====================================================
        // Schedule automatic expiry reminder scan
        // =====================================================
        //
        // Testing:
        // * * * * * = Every minute
        //
        // Production:
        // 0 0 * * * = Every day at 12:00 AM
        //

        cron.schedule(
            "* * * * *",
            async () => {

                console.log(
                    "Starting scheduled expiry reminder scan..."
                );

                try {

                    await processExpiryReminders();

                    console.log(
                        "Scheduled expiry reminder scan completed."
                    );

                } catch (error) {

                    console.error(
                        "Scheduled expiry reminder scan failed:",
                        error.message
                    );
                }
            }
        );

        console.log(
            "Expiry Reminder Scheduler is running..."
        );

    } catch (error) {

        console.error(
            "Expiry scheduler startup failed:",
            error.message
        );

        process.exit(1);
    }
};

startExpiryReminderScheduler();