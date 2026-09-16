const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        // Organization to which this audit log belongs.
        // This keeps audit logs isolated between organizations.
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },

        // Action performed by the user.
        action: {
            type: String,
            required: true,
            trim: true,
        },

        // User who performed the action.
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Type of entity affected by the action.
        targetType: {
            type: String,
            required: true,
            trim: true,
        },

        // ID of the affected entity.
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        // Human-readable description of the action.
        description: {
            type: String,
            required: true,
            trim: true,
        },

        // Additional information related to the action.
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

// Index for fetching latest logs quickly.
auditLogSchema.index({ createdAt: -1 });

// Index for filtering logs by organization.
auditLogSchema.index({ organizationId: 1 });

// Index for filtering logs by action.
auditLogSchema.index({ action: 1 });

// Index for finding logs performed by a specific user.
auditLogSchema.index({ performedBy: 1 });

// Compound index for organization-wise latest logs.
auditLogSchema.index({
    organizationId: 1,
    createdAt: -1,
});

module.exports = mongoose.model("AuditLog", auditLogSchema);