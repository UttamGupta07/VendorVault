const { Queue } = require("bullmq");
const redis = require("../config/redis");

const expiryReminderQueue = new Queue("expiry-reminder", {
    connection: redis,
});

expiryReminderQueue.on("error", (error) => {
    console.error(
        "Expiry reminder queue error:",
        error.message
    );
});

module.exports = expiryReminderQueue;