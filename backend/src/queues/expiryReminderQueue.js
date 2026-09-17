 const { Queue } = require("bullmq");

const redis = require("../config/redis");

const expiryReminderQueue = new Queue(
    "expiry-reminder",
    {
        connection: redis,

        defaultJobOptions: {
            removeOnComplete: {   
                age: 60 * 60 * 24,
            },

            removeOnFail: {
                age: 60 * 60 * 24 * 7,
            },
        },
    }
);

expiryReminderQueue.on("error", (error) => {
    console.error(
        "Expiry reminder queue error:",
        error.message
    );
});

module.exports = expiryReminderQueue;