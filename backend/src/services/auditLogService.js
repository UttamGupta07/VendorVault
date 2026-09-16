const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
    organizationId,
    performedBy,
    action,
    targetType,
    targetId = null,
    description,
    metadata = {},
}) => {
    try {
        if (!organizationId || !performedBy) {
            console.error("Audit log data missing:", {
                organizationId,
                performedBy,
                action,
            });

            return null;
        }

        const auditLog = await AuditLog.create({
            organizationId,
            performedBy,
            action,
            targetType,
            targetId,
            description,
            metadata,
        });

        console.log("Audit log created:", auditLog._id);

        return auditLog;
    } catch (error) {
        console.error("Create audit log error:", error);
        throw error;
    }
};

module.exports = {
    createAuditLog,
};