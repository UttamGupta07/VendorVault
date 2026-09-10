const User = require("../models/User");
const VendorDocument = require("../models/VendorDocument");

const getComplianceTeam = async (req, res) => {
    try {
        // ==========================================
        // 1. GET ALL COMPLIANCE OFFICERS
        // ==========================================

        const officers = await User.find({
            role: "COMPLIANCE_OFFICER",
        })
            .select("name email isActive createdAt lastLoginAt")
            .sort({ createdAt: -1 })
            .lean();

        // ==========================================
        // 2. GET DOCUMENT REVIEW STATISTICS
        // ==========================================

        const reviewStats = await VendorDocument.aggregate([
            {
                $match: {
                    reviewedBy: { $ne: null },
                    reviewedAt: { $ne: null },
                },
            },
            {
                $group: {
                    _id: "$reviewedBy",

                    totalReviewed: {
                        $sum: 1,
                    },

                    approved: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "APPROVED"] },
                                1,
                                0,
                            ],
                        },
                    },

                    rejected: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "REJECTED"] },
                                1,
                                0,
                            ],
                        },
                    },

                    vendors: {
                        $addToSet: "$vendorId",
                    },

                    lastActivityAt: {
                        $max: "$reviewedAt",
                    },
                },
            },
        ]);

        // ==========================================
        // 3. MAP STATS BY OFFICER
        // ==========================================

        const statsMap = new Map();

        reviewStats.forEach((item) => {
            statsMap.set(item._id.toString(), {
                totalReviewed: item.totalReviewed || 0,
                approved: item.approved || 0,
                rejected: item.rejected || 0,
                vendorsVerified: item.vendors?.length || 0,
                lastActivityAt: item.lastActivityAt || null,
            });
        });

        // ==========================================
        // 4. GET RECENT ACTIVITY
        // ==========================================

        const activities = await VendorDocument.find({
            reviewedBy: { $ne: null },
            reviewedAt: { $ne: null },
        })
            .populate(
                "reviewedBy",
                "name email"
            )
            .populate(
                "vendorId",
                "name companyName email"
            )
            .populate(
                "documentTypeId",
                "name"
            )
            .select(
                "reviewedBy vendorId documentTypeId originalFileName status rejectionReason reviewedAt"
            )
            .sort({ reviewedAt: -1 })
            .limit(100)
            .lean();

        // ==========================================
        // 5. BUILD OFFICER RESPONSE
        // ==========================================

        const team = officers.map((officer) => {
            const stats =
                statsMap.get(
                    officer._id.toString()
                ) || {
                    totalReviewed: 0,
                    approved: 0,
                    rejected: 0,
                    vendorsVerified: 0,
                    lastActivityAt: null,
                };

            return {
                ...officer,
                stats,
            };
        });

        // ==========================================
        // 6. OVERALL TEAM STATS
        // ==========================================

        const totalReviewed = reviewStats.reduce(
            (total, item) =>
                total + (item.totalReviewed || 0),
            0
        );

        const totalApproved = reviewStats.reduce(
            (total, item) =>
                total + (item.approved || 0),
            0
        );

        const totalRejected = reviewStats.reduce(
            (total, item) =>
                total + (item.rejected || 0),
            0
        );

        const activeOfficers = officers.filter(
            (officer) => officer.isActive
        ).length;

        // ==========================================
        // 7. RESPONSE
        // ==========================================

        return res.status(200).json({
            success: true,

            data: {
                overview: {
                    totalOfficers: officers.length,
                    activeOfficers,
                    inactiveOfficers:
                        officers.length -
                        activeOfficers,
                    totalReviewed,
                    totalApproved,
                    totalRejected,
                },

                team,

                activities,
            },
        });
    } catch (error) {
        console.error(
            "Compliance Team Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load compliance team",
        });
    }
};

module.exports = {
    getComplianceTeam,
};