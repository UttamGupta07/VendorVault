require("dotenv").config();

const { Worker } = require("bullmq");

// Redis connection
const redis = require("../config/redis");

// MongoDB connection
const connectdb = require("../db/db");

// Models
const VendorDocument = require("../models/VendorDocument");
const Vendor = require("../models/Vendor");
const Notification = require("../models/Notification");
const { sendEmail } = require("../services/emailService");


// =====================================================
// Start Worker
// =====================================================
// Pehle MongoDB connect hoga.
// MongoDB successfully connect hone ke baad hi
// BullMQ Worker start hoga.
//
// Isse ye problem nahi hogi ki Redis job aa gaya
// aur MongoDB abhi connect hi nahi hua.
// =====================================================

const startWorker = async () => {

    try {

        // -------------------------------------------------
        // 1. MongoDB connect karo
        // -------------------------------------------------

        await connectdb();

        console.log(
            "Worker MongoDB connection ready"
        );


        // -------------------------------------------------
        // 2. BullMQ Worker create karo
        // -------------------------------------------------

        const expiryReminderWorker = new Worker(
            "expiry-reminder",

            async (job) => {

                console.log(
                    `Processing reminder job: ${job.id}`
                );


                // =====================================================
                // Job se required information nikalo
                // =====================================================

                const {
                    documentId,
                    vendorId,
                    reminderType,
                } = job.data;


                // =====================================================
                // 3. Latest document MongoDB se find karo
                // =====================================================

                const document =
                    await VendorDocument.findById(
                        documentId
                    );


                // Agar document delete ho chuka hai
                // to reminder nahi bhejna.

                if (!document) {

                    console.log(
                        `Document not found: ${documentId}`
                    );

                    return;
                }


                // =====================================================
                // 4. Vendor ID verify karo
                // =====================================================

                if (
                    document.vendorId.toString() !==
                    vendorId.toString()
                ) {

                    console.log(
                        `Vendor mismatch for document: ${documentId}`
                    );

                    return;
                }


                // =====================================================
                // 5. Vendor find karo
                // =====================================================

                const vendor =
                    await Vendor.findById(
                        document.vendorId
                    );


                if (!vendor) {

                    console.log(
                        `Vendor not found: ${document.vendorId}`
                    );

                    return;
                }


                // =====================================================
                // 6. Expiry date check
                // =====================================================

                if (!document.expiryDate) {

                    console.log(
                        `Expiry date not found for document: ${documentId}`
                    );

                    return;
                }


                // =====================================================
                // 7. Duplicate notification check
                // =====================================================

                const existingNotification =
                    await Notification.findOne({

                        documentId: document._id,

                        vendorId: document.vendorId,

                        reminderType,
                    });


                if (existingNotification) {

                    console.log(
                        `Notification already exists: ${documentId} - ${reminderType}`
                    );

                    return;
                }


                // =====================================================
                // 8. Reminder message prepare karo
                // =====================================================

                let title;
                let message;


                if (reminderType === "15_DAY") {

                    title =
                        "Document Expiry Reminder";

                    message =
                        `${document.originalFileName} will expire in 15 days. Please upload an updated document.`;
                }


                if (reminderType === "7_DAY") {

                    title =
                        "Document Expiry Reminder";

                    message =
                        `${document.originalFileName} will expire in 7 days. Please upload an updated document.`;
                }


                if (reminderType === "1_DAY") {

                    title =
                        "Document Expiry Reminder";

                    message =
                        `${document.originalFileName} will expire tomorrow. Please upload an updated document.`;
                }


                // Invalid reminder type

                if (!title || !message) {

                    console.log(
                        `Invalid reminder type: ${reminderType}`
                    );

                    return;
                }


                // =====================================================
                // 9. Vendor ko actual email bhejo
                // =====================================================

                await sendEmail({
                    to: vendor.email,
                    subject: title,
                    text: message,
                });

                console.log(
                    `Expiry reminder email sent to: ${vendor.email}`
                );


                // =====================================================
                // 10. Email successful hone ke baad
                //     Notification MongoDB mein save karo
                // =====================================================

                const notification =
                    await Notification.create({
                        vendorId: vendor._id,
                        documentId: document._id,
                        reminderType,
                        title,
                        message,
                    });



                console.log(
                    `Notification created successfully: ${notification._id}`
                );


                // =====================================================
                // 10. Vendor email
                // =====================================================
                // Abhi actual email send nahi kar rahe.
                // Filhaal vendor email console mein dekh rahe hain.
                //
                // Next stage mein actual email service add karenge.

                console.log(
                    `Reminder recipient vendor email: ${vendor.email}`
                );


                console.log(
                    `Reminder processed successfully: ${reminderType}`
                );
            },


            // =====================================================
            // Worker Configuration
            // =====================================================

            {
                // Same Redis connection use kar rahe hain.

                connection: redis,

                // Ek time par maximum 5 jobs.

                concurrency: 5,
            }
        );


        // =====================================================
        // Job Completed
        // =====================================================

        expiryReminderWorker.on(
            "completed",
            (job) => {

                console.log(
                    `Job completed: ${job.id}`
                );
            }
        );


        // =====================================================
        // Job Failed
        // =====================================================

        expiryReminderWorker.on(
            "failed",
            (job, error) => {

                console.error(
                    `Job failed: ${job?.id}`,
                    error.message
                );
            }
        );


        // =====================================================
        // Worker Error
        // =====================================================

        expiryReminderWorker.on(
            "error",
            (error) => {

                console.error(
                    "Worker error:",
                    error.message
                );
            }
        );


        console.log(
            "Expiry Reminder Worker is running..."
        );

    } catch (error) {

        console.error(
            "Worker startup failed:",
            error.message
        );

        process.exit(1);
    }
};


// =====================================================
// Start
// =====================================================

startWorker();