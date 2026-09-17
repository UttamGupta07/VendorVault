 const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        // =====================================================
        // Organization
        // =====================================================

        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true,
        },

        // =====================================================
        // Vendor
        // =====================================================

        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
            index: true,
        },

        // =====================================================
        // Document
        // =====================================================

        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "VendorDocument",
            required: true,
            index: true,
        },

        // =====================================================
        // Reminder Type
        // =====================================================

        reminderType: {
            type: String,
            enum: [
                "15_DAY",
                "7_DAY",
                "1_DAY",
                "EXPIRED_1_DAY",
                "EXPIRED_3_DAY",
                "EXPIRED_7_DAY",
            ],
            required: true,
        },

        // =====================================================
        // Notification Content
        // =====================================================

        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        // =====================================================
        // Email Information
        // =====================================================

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        // Current email delivery status
        emailStatus: {
            type: String,
            enum: ["SENT", "FAILED"],
            required: true,
            default: "FAILED",
            index: true,
        },

        // Gmail/Nodemailer message ID
        emailMessageId: {
            type: String,
            default: null,
        },

        // Error from the last failed attempt
        emailError: {
            type: String,
            default: null,
        },

        // Time when email was successfully sent
        emailSentAt: {
            type: Date,
            default: null,
        },

        // =====================================================
        // Retry / Resend Information
        // =====================================================

        // Number of manual resend cycles
        //
        // Example:
        //
        // Initial delivery:
        // resendCount = 0
        //
        // Compliance Officer clicks Resend:
        // resendCount = 1
        //
        // Clicks Resend again:
        // resendCount = 2
        //
        resendCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Number of email attempts made
        // during the current/latest delivery cycle.
        //
        // Maximum = 3
        //
        attemptCount: {
            type: Number,
            default: 0,
            min: 0,
            max: 3,
        },

        // Last time an email attempt was made
        lastAttemptAt: {
            type: Date,
            default: null,
        },

        // =====================================================
        // Read / Unread
        // =====================================================

        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// =====================================================
// Automatically delete notifications after 60 days
// =====================================================

notificationSchema.index(
    { createdAt: 1 },
    {
        expireAfterSeconds: 60 * 24 * 60 * 60,
    }
);

// =====================================================
// Vendor notification queries
// =====================================================

notificationSchema.index({
    organizationId: 1,
    vendorId: 1,
    isRead: 1,
    createdAt: -1,
});

// =====================================================
// Compliance Officer notification queries
// =====================================================

notificationSchema.index({
    organizationId: 1,
    emailStatus: 1,
    createdAt: -1,
});

// =====================================================
// Prevent duplicate reminder notifications
//
// One notification per:
// organization + vendor + document + reminder type
//
// Example:
// GST + Vendor A + 7_DAY
//
// cannot create another notification for the same reminder.
// =====================================================

notificationSchema.index(
    {
        organizationId: 1,
        vendorId: 1,
        documentId: 1,
        reminderType: 1,
    },
    {
        unique: true,
    }
);

// =====================================================
// Export Model
// =====================================================

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);