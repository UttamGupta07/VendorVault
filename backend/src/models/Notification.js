const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
            index: true,
        },

        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "VendorDocument",
            required: true,
            index: true,
        },

        reminderType: {
            type: String,
            enum: ["15_DAY", "7_DAY", "1_DAY"],
            required: true,
            index: true,
        },

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

// MongoDB automatically deletes notifications
// after 60 days.
notificationSchema.index(
    { createdAt: 1 },
    {
        expireAfterSeconds: 60 * 24 * 60 * 60,
    }
);

// Fast query for vendor's unread notifications.
notificationSchema.index({
    vendorId: 1,
    isRead: 1,
    createdAt: -1,
});

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);