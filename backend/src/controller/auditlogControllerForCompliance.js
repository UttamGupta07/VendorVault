 const AuditLog = require("../models/AuditLog");
const User = require("../models/User");

// =====================================================
// GET COMPLIANCE AUDIT LOGS
// GET /api/audit-logs/compliance
// =====================================================
const getComplianceAuditLogs = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;

        // -------------------------------------------------
        // Pagination
        // -------------------------------------------------
        const page = Math.max(parseInt(req.query.page) || 1, 1);

        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 10, 1),
            100
        );

        const skip = (page - 1) * limit;

        // -------------------------------------------------
        // Filters
        // -------------------------------------------------
        const {
            search = "",
            action = "ALL",
            actorType = "ALL",
            dateRange = "ALL",
            startDate,
            endDate,
        } = req.query;

        // -------------------------------------------------
        // Find Compliance Officers belonging to
        // the current organization
        // -------------------------------------------------
        const complianceOfficers = await User.find({
            organizationId,
            role: "COMPLIANCE_OFFICER",
        }).select("_id");

        const complianceOfficerIds = complianceOfficers.map(
            (user) => user._id
        );

        // -------------------------------------------------
        // Base query
        //
        // USER logs -> only COMPLIANCE_OFFICER
        // VENDOR logs -> allowed
        //
        // Therefore SUPER_ADMIN and AUDITOR logs are
        // automatically excluded.
        // -------------------------------------------------
        const query = {
            organizationId,

            $or: [
                {
                    actorType: "USER",
                    performedBy: {
                        $in: complianceOfficerIds,
                    },
                },
                {
                    actorType: "VENDOR",
                },
            ],
        };

        // -------------------------------------------------
        // Action filter
        // -------------------------------------------------
        if (action && action !== "ALL") {
            query.action = action;
        }

        // -------------------------------------------------
        // Actor filter
        // -------------------------------------------------
        if (actorType && actorType !== "ALL") {
            if (actorType === "USER") {
                query.$or = [
                    {
                        actorType: "USER",
                        performedBy: {
                            $in: complianceOfficerIds,
                        },
                    },
                ];
            }

            if (actorType === "VENDOR") {
                query.$or = [
                    {
                        actorType: "VENDOR",
                    },
                ];
            }
        }

        // -------------------------------------------------
        // Date filters
        // -------------------------------------------------
        if (dateRange !== "ALL") {
            const now = new Date();

            let fromDate = null;

            if (dateRange === "TODAY") {
                fromDate = new Date();

                fromDate.setHours(0, 0, 0, 0);
            }

            if (dateRange === "7_DAYS") {
                fromDate = new Date(
                    now.getTime() -
                        7 * 24 * 60 * 60 * 1000
                );
            }

            if (dateRange === "30_DAYS") {
                fromDate = new Date(
                    now.getTime() -
                        30 * 24 * 60 * 60 * 1000
                );
            }

            if (fromDate) {
                query.createdAt = {
                    $gte: fromDate,
                    $lte: now,
                };
            }
        }

        // -------------------------------------------------
        // Custom date range
        // -------------------------------------------------
        if (startDate || endDate) {
            query.createdAt = {};

            if (startDate) {
                const start = new Date(startDate);

                start.setHours(0, 0, 0, 0);

                query.createdAt.$gte = start;
            }

            if (endDate) {
                const end = new Date(endDate);

                end.setHours(23, 59, 59, 999);

                query.createdAt.$lte = end;
            }
        }

        // -------------------------------------------------
        // Search
        // -------------------------------------------------
        if (search.trim()) {
            const searchRegex = new RegExp(
                search
                    .trim()
                    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                "i"
            );

            query.$and = [
                {
                    $or: [
                        {
                            description: searchRegex,
                        },
                        {
                            action: searchRegex,
                        },
                        {
                            targetType: searchRegex,
                        },
                    ],
                },
            ];
        }

        // -------------------------------------------------
        // Fetch audit logs
        // -------------------------------------------------
        const [auditLogs, totalLogs] = await Promise.all([
            AuditLog.find(query)
                .populate(
                    "performedBy",
                    "name email role"
                )
                .populate(
                    "performedByVendor",
                    "name email companyName role"
                )
                .sort({
                    createdAt: -1,
                })
                .skip(skip)
                .limit(limit)
                .lean(),

            AuditLog.countDocuments(query),
        ]);

        // -------------------------------------------------
        // Format logs
        // -------------------------------------------------
        const formattedLogs = auditLogs.map((log) => {
            const actor =
                log.actorType === "VENDOR"
                    ? log.performedByVendor
                    : log.performedBy;

            return {
                _id: log._id,

                action: log.action,

                actorType: log.actorType,

                actor: actor
                    ? {
                          _id: actor._id,

                          name:
                              actor.name ||
                              actor.companyName ||
                              "Unknown",

                          email: actor.email || "",

                          role: actor.role || null,

                          companyName:
                              actor.companyName || null,
                      }
                    : null,

                targetType: log.targetType,

                targetId: log.targetId,

                description: log.description,

                metadata: log.metadata || {},

                createdAt: log.createdAt,

                updatedAt: log.updatedAt,
            };
        });

        // -------------------------------------------------
        // Pagination
        // -------------------------------------------------
        const totalPages = Math.ceil(
            totalLogs / limit
        );

        return res.status(200).json({
            success: true,

            message:
                "Compliance audit logs fetched successfully",

            data: formattedLogs,

            pagination: {
                currentPage: page,

                totalPages,

                totalLogs,

                limit,

                hasNextPage:
                    page < totalPages,

                hasPreviousPage:
                    page > 1,
            },
        });
    } catch (error) {
        console.error(
            "Get compliance audit logs error:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                "Failed to fetch compliance audit logs",

            error: error.message,
        });
    }
};

module.exports = {
    getComplianceAuditLogs,
};