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

    // ==========================================
    // CURRENT LOGGED-IN USER
    // ==========================================

    const organizationId = req.user.organizationId;
    const performedBy = req.user.userId;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!organizationId || !performedBy) {
      return res.status(400).json({
        success: false,
        message:
          "User or organization information is missing",
      });
    }

    // ==========================================
    // PAGINATION
    // ==========================================

    const pageNumber = Math.max(
      Number(page) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(Number(limit) || 20, 1),
      100
    );

    const skip =
      (pageNumber - 1) * limitNumber;

    // ==========================================
    // BASE FILTER
    // ==========================================
    // IMPORTANT:
    // organizationId = tenant isolation
    // performedBy = only current user's actions
    //
    // Therefore:
    // Super Admin sees ONLY their own logs.
    // ==========================================

    const filter = {
      organizationId,
      performedBy,
    };

    // ==========================================
    // ACTION FILTER
    // ==========================================

    if (action) {
      filter.action = action;
    }

    // ==========================================
    // SEARCH FILTER
    // ==========================================

    if (search && search.trim()) {
      const searchRegex = new RegExp(
        search.trim(),
        "i"
      );

      filter.$or = [
        {
          description: searchRegex,
        },
        {
          action: searchRegex,
        },
      ];
    }

    // ==========================================
    // FETCH LOGS
    // ==========================================

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

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
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

    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
    });
  }
};

module.exports = {
  getAuditLogs,
};