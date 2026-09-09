const AuditLog = require("../models/AuditLog");

const getAuditLogs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            action,
            search,
        } = req.query;

        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

        const filter = {};

        if (action) {
            filter.action = action;
        }

        const skip = (pageNumber - 1) * limitNumber;

        const [logs, total] = await Promise.all([
            AuditLog.find(filter)
                .populate("performedBy", "name email role")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber)
                .lean(),

            AuditLog.countDocuments(filter),
        ]);

        let filteredLogs = logs;

        if (search) {
            const searchText = search.toLowerCase();

            filteredLogs = logs.filter((log) => {
                return (
                    log.description?.toLowerCase().includes(searchText) ||
                    log.performedBy?.name
                        ?.toLowerCase()
                        .includes(searchText) ||
                    log.performedBy?.email
                        ?.toLowerCase()
                        .includes(searchText)
                );
            });
        }

        res.status(200).json({
            success: true,
            logs: filteredLogs,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(total / limitNumber),
            },
        });
    } catch (error) {
        console.error("Get audit logs error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch activity logs",
        });
    }
};

module.exports = {
    getAuditLogs,
};