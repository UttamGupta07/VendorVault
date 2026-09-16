const AuditLog = require("../models/AuditLog");
const User = require("../models/User");

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

module.exports = {
    getAuditLogs,
};