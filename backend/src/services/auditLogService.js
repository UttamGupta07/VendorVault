 const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
    organizationId,
    actorType,
    performedBy = null,
    performedByVendor = null,
    action,
    targetType,
    targetId = null,
    description,
    metadata = {},
}) => {
    try {
        if (!organizationId || !actorType || !action || !targetType || !description) {
            console.error("Audit log data missing:", {
                organizationId,
                actorType,
                performedBy,
                performedByVendor,
                action,
                targetType,
            });

            return null;
        }

        // USER must have performedBy
        if (actorType === "USER" && !performedBy) {
            console.error(
                "Audit log requires performedBy for USER actor"
            );

            return null;
        }

        // VENDOR must have performedByVendor
        if (actorType === "VENDOR" && !performedByVendor) {
            console.error(
                "Audit log requires performedByVendor for VENDOR actor"
            );

            return null;
        }

        const auditLog = await AuditLog.create({
            organizationId,
            actorType,
            performedBy:
                actorType === "USER"
                    ? performedBy
                    : null,
            performedByVendor:
                actorType === "VENDOR"
                    ? performedByVendor
                    : null,
            action,
            targetType,
            targetId,
            description,
            metadata,
        });

        console.log(
            "Audit log created:",
            auditLog._id
        );

        return auditLog;
    } catch (error) {
        console.error(
            "Create audit log error:",
            error
        );

        throw error;
    }
};

module.exports = {
    createAuditLog,
};