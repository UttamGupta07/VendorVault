const AuditLog = require("../models/AuditLog");
const User = require("../models/User");
const mongoose = require("mongoose");

const getAuditLogs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            action,
            search,
        } = req.query;

        // Get the organization of the logged-in Super Admin.
        const organizationId = req.user.organizationId;

        // Organization is required for tenant isolation.
        if (!organizationId) {
            return res.status(400).json({
                success: false,
                message: "Organization ID is missing",
            });
        }

        const pageNumber = Math.max(Number(page), 1);

        const limitNumber = Math.min(
            Math.max(Number(limit), 1),
            100
        );

        // Always restrict logs to the current organization.
        const filter = {
            organizationId,
        };

        // Filter by action when selected.
        if (action) {
            filter.action = action;
        }

        // Search logs by description, action, user name or email.
        if (search) {
            const searchRegex = new RegExp(search, "i");

            const matchingUsers = await User.find(
                {
                    organizationId,
                    $or: [
                        { name: searchRegex },
                        { email: searchRegex },
                    ],
                },
                "_id"
            ).lean();

            const userIds = matchingUsers.map(
                (user) => user._id
            );

            filter.$or = [
                { description: searchRegex },
                { action: searchRegex },
                {
                    performedBy: {
                        $in: userIds,
                    },
                },
            ];
        }

        const skip = (pageNumber - 1) * limitNumber;

        const [logs, total] = await Promise.all([
            AuditLog.find(filter)
                .populate(
                    "performedBy",
                    "name email role"
                )
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber)
                .lean(),

            AuditLog.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            logs,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(
                    total / limitNumber
                ),
            },
        });
    } catch (error) {
        console.error(
            "Get audit logs error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch audit logs",
        });
    }
};
 

const getAuditLogsForCompliance = async (req, res) => {
    try {
        // =====================================================
        // 1. Validate authenticated user
        // =====================================================

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        // IMPORTANT:
        // Your JWT contains:
        // {
        //     userId,
        //     organizationId,
        //     role
        // }
        //
        // Therefore use req.user.userId, NOT req.user._id.

        const currentUserId = req.user.userId;
        const organizationId = req.user.organizationId;
        const role = req.user.role;

        // =====================================================
        // 2. Validate authentication data
        // =====================================================

        if (!currentUserId || !organizationId || !role) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication data",
            });
        }

        // =====================================================
        // 3. Only Compliance Officers can access this endpoint
        // =====================================================

        if (role !== "COMPLIANCE_OFFICER") {
            return res.status(403).json({
                success: false,
                message:
                    "Only Compliance Officers can access these audit logs",
            });
        }

        // =====================================================
        // 4. Validate MongoDB ObjectIds
        // =====================================================

        if (
            !mongoose.Types.ObjectId.isValid(currentUserId) ||
            !mongoose.Types.ObjectId.isValid(organizationId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid user or organization ID",
            });
        }

        // =====================================================
        // 5. Pagination
        // =====================================================

        const page = Math.max(
            parseInt(req.query.page, 10) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                parseInt(req.query.limit, 10) || 10,
                1
            ),
            100
        );

        const skip = (page - 1) * limit;

        // =====================================================
        // 6. Filters
        // =====================================================

        const {
            search = "",
            action = "ALL",
            actorType = "ALL",
            dateRange = "ALL",
            startDate,
            endDate,
        } = req.query;

        // =====================================================
        // 7. BASE QUERY
        //
        // This is the most important part.
        //
        // It ensures that the logged-in Compliance Officer
        // can see ONLY audits performed by themselves.
        // =====================================================

        const query = {
            organizationId:
                new mongoose.Types.ObjectId(
                    organizationId
                ),

            actorType: "USER",

            performedBy:
                new mongoose.Types.ObjectId(
                    currentUserId
                ),
        };

        // =====================================================
        // 8. Action filter
        // =====================================================

        if (
            action &&
            action !== "ALL"
        ) {
            query.action = action;
        }

        // =====================================================
        // 9. Actor type filter
        //
        // This endpoint is specifically for Compliance
        // Officer audit logs, so only USER is valid.
        // =====================================================

        if (
            actorType &&
            actorType !== "ALL" &&
            actorType !== "USER"
        ) {
            return res.status(200).json({
                success: true,

                message:
                    "Compliance audit logs fetched successfully",

                data: [],

                pagination: {
                    currentPage: page,
                    totalPages: 0,
                    totalLogs: 0,
                    limit,
                    hasNextPage: false,
                    hasPreviousPage: page > 1,
                },
            });
        }

        // =====================================================
        // 10. Date filtering
        //
        // If custom startDate/endDate are provided,
        // they take priority over dateRange.
        // =====================================================

        let dateFilter = null;

        // -----------------------------------------------------
        // Custom date range
        // -----------------------------------------------------

        if (startDate || endDate) {
            dateFilter = {};

            if (startDate) {
                const start = new Date(startDate);

                if (Number.isNaN(start.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid startDate",
                    });
                }

                start.setHours(
                    0,
                    0,
                    0,
                    0
                );

                dateFilter.$gte = start;
            }

            if (endDate) {
                const end = new Date(endDate);

                if (Number.isNaN(end.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid endDate",
                    });
                }

                end.setHours(
                    23,
                    59,
                    59,
                    999
                );

                dateFilter.$lte = end;
            }
        }

        // -----------------------------------------------------
        // Predefined date range
        // -----------------------------------------------------

        else if (
            dateRange &&
            dateRange !== "ALL"
        ) {
            const now = new Date();

            let fromDate = null;

            switch (dateRange) {
                case "TODAY": {
                    fromDate = new Date(now);

                    fromDate.setHours(
                        0,
                        0,
                        0,
                        0
                    );

                    break;
                }

                case "7_DAYS": {
                    fromDate = new Date(
                        now.getTime() -
                            7 *
                                24 *
                                60 *
                                60 *
                                1000
                    );

                    break;
                }

                case "30_DAYS": {
                    fromDate = new Date(
                        now.getTime() -
                            30 *
                                24 *
                                60 *
                                60 *
                                1000
                    );

                    break;
                }

                default: {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Invalid dateRange. Allowed values are ALL, TODAY, 7_DAYS, or 30_DAYS",
                    });
                }
            }

            dateFilter = {
                $gte: fromDate,
                $lte: now,
            };
        }

        // Apply date filter
        if (dateFilter) {
            query.createdAt = dateFilter;
        }

        // =====================================================
        // 11. Search filter
        // =====================================================

        const trimmedSearch =
            typeof search === "string"
                ? search.trim()
                : "";

        if (trimmedSearch) {
            // Escape regex special characters
            // to safely handle user input.
            const escapedSearch =
                trimmedSearch.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                );

            const searchRegex = new RegExp(
                escapedSearch,
                "i"
            );

            query.$or = [
                {
                    description: searchRegex,
                },
                {
                    action: searchRegex,
                },
                {
                    targetType: searchRegex,
                },
            ];
        }

        // =====================================================
        // 12. Fetch audit logs and total count
        // =====================================================

        const [auditLogs, totalLogs] =
            await Promise.all([
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

        // =====================================================
        // 13. Format audit logs
        // =====================================================

        const formattedLogs = auditLogs.map(
            (log) => {
                const actor =
                    log.actorType === "VENDOR"
                        ? log.performedByVendor
                        : log.performedBy;

                return {
                    _id: log._id,

                    action: log.action,

                    actorType:
                        log.actorType,

                    actor: actor
                        ? {
                              _id:
                                  actor._id,

                              name:
                                  actor.name ||
                                  actor.companyName ||
                                  "Unknown",

                              email:
                                  actor.email ||
                                  "",

                              role:
                                  actor.role ||
                                  null,

                              companyName:
                                  actor.companyName ||
                                  null,
                          }
                        : null,

                    targetType:
                        log.targetType ||
                        null,

                    targetId:
                        log.targetId ||
                        null,

                    description:
                        log.description ||
                        "",

                    metadata:
                        log.metadata ||
                        {},

                    createdAt:
                        log.createdAt,

                    updatedAt:
                        log.updatedAt,
                };
            }
        );

        // =====================================================
        // 14. Pagination information
        // =====================================================

        const totalPages =
            totalLogs > 0
                ? Math.ceil(
                      totalLogs / limit
                  )
                : 0;

        // =====================================================
        // 15. Success response
        // =====================================================

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

            // Don't expose internal error details
            // in production.
            ...(process.env.NODE_ENV !==
                "production" && {
                error: error.message,
            }),
        });
    }
};

 


module.exports = {
    getAuditLogs,
    getAuditLogsForCompliance,
};