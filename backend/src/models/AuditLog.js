 const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        // Organization to which this audit log belongs
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },

        // Type of actor who performed the action
        actorType: {
            type: String,
            enum: ["USER", "VENDOR"],
            required: true,
        },

        // Staff user who performed the action
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        // Vendor who performed the action
        performedByVendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            default: null,
        },

        // Action performed
        action: {
            type: String,
            required: true,
            trim: true,
        },

        // Type of entity affected
        targetType: {
            type: String,
            required: true,
            trim: true,
        },

        // ID of affected entity
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        // Human-readable description
        description: {
            type: String,
            required: true,
            trim: true,
        },

        // Additional information
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

// Latest logs
auditLogSchema.index({
    createdAt: -1,
});

// Organization filtering
auditLogSchema.index({
    organizationId: 1,
});

// Action filtering
auditLogSchema.index({
    action: 1,
});

// User filtering
auditLogSchema.index({
    performedBy: 1,
});

// Vendor filtering
auditLogSchema.index({
    performedByVendor: 1,
});

// Organization latest logs
auditLogSchema.index({
    organizationId: 1,
    createdAt: -1,
});

// Organization + action + date
auditLogSchema.index({
    organizationId: 1,
    action: 1,
    createdAt: -1,
});

module.exports = mongoose.model("AuditLog", auditLogSchema);