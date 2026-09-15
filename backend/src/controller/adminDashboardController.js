const Vendor = require("../models/Vendor");
const VendorDocument = require("../models/VendorDocument");
const User = require("../models/User");
// const Notification = require("../models/Notification");





const getSuperAdminDashboard = async (req, res) => {

    try {

        // console.log("SUPER ADMIN USER:", req.user);
        // console.log("ORGANIZATION ID:", req.user.organizationId);
        const organizationId = req.user.organizationId;

        if (!organizationId) {
            return res.status(400).json({
                success: false,
                message: "Organization ID is missing",
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const thirtyDaysLater = new Date(today);
        thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

        // =========================
        // BASIC COUNTS
        // =========================

        const [
            totalUsers,
            activeUsers,
            totalVendors,
            activeVendors,
            pendingVendors,
            suspendedVendors,
            inactiveVendors,
            totalDocuments,
            pendingDocuments,
            approvedDocuments,
            rejectedDocuments,
            expiredDocuments,
            expiringSoon,
        ] = await Promise.all([
            User.countDocuments({
                organizationId,
            }),

            User.countDocuments({
                organizationId,
                isActive: true,
            }),

            Vendor.countDocuments({
                organizationId,
            }),

            Vendor.countDocuments({
                organizationId,
                status: "active",
            }),

            Vendor.countDocuments({
                organizationId,
                status: "pending",
            }),

            Vendor.countDocuments({
                organizationId,
                status: "suspended",
            }),

            Vendor.countDocuments({
                organizationId,
                status: "inactive",
            }),

            VendorDocument.countDocuments({
                organizationId,
            }),

            VendorDocument.countDocuments({
                organizationId,
                status: "PENDING_REVIEW",
            }),

            VendorDocument.countDocuments({
                organizationId,
                status: "APPROVED",
            }),

            VendorDocument.countDocuments({
                organizationId,
                status: "REJECTED",
            }),

            VendorDocument.countDocuments({
                organizationId,
                expiryDate: {
                    $lt: today,
                },
            }),

            VendorDocument.countDocuments({
                organizationId,
                expiryDate: {
                    $gte: today,
                    $lte: thirtyDaysLater,
                },
            }),
        ]);

        // =========================
        // COMPLIANCE
        // =========================

        const complianceResult = await Vendor.aggregate([
            {
                $match: {
                    organizationId,
                },
            },
            {
                $group: {
                    _id: null,
                    averageScore: {
                        $avg: "$complianceScore",
                    },
                },
            },
        ]);

        const averageComplianceScore =
            complianceResult.length > 0
                ? Math.round(
                    complianceResult[0].averageScore || 0
                )
                : 0;

        const [
            compliantVendors,
            attentionVendors,
        ] = await Promise.all([
            Vendor.countDocuments({
                organizationId,
                complianceScore: {
                    $gte: 80,
                },
            }),

            Vendor.countDocuments({
                organizationId,
                complianceScore: {
                    $lt: 60,
                },
            }),
        ]);

        // =========================
        // EXPIRY OVERVIEW
        // =========================

        const [
            expiredCount,
            expiring30Count,
            expiring60Count,
        ] = await Promise.all([
            VendorDocument.countDocuments({
                organizationId,
                expiryDate: {
                    $lt: today,
                },
            }),

            VendorDocument.countDocuments({
                organizationId,
                expiryDate: {
                    $gte: today,
                    $lte: thirtyDaysLater,
                },
            }),

            VendorDocument.countDocuments({
                organizationId,
                expiryDate: {
                    $gt: thirtyDaysLater,
                    $lte: new Date(
                        today.getTime() +
                        60 * 24 * 60 * 60 * 1000
                    ),
                },
            }),
        ]);

        const validDocuments = Math.max(
            totalDocuments -
            expiredCount -
            expiring30Count -
            expiring60Count,
            0
        );

        // =========================
        // RECENT VENDORS
        // =========================

        const vendors = await Vendor.find({
            organizationId,
        })
            .select(
                "name companyName email status complianceScore createdAt"
            )
            .sort({
                createdAt: -1,
            })
            .limit(8)
            .lean();

        // =========================
        // RECENT NOTIFICATIONS
        // =========================

        // Fetch only notifications belonging to the logged-in Super Admin's organization
        // const notifications = await Notification.find({
        //     organizationId,
        // })
        //     .populate(
        //         "vendorId",
        //         "name companyName"
        //     )
        //     .populate(
        //         "documentId",
        //         "originalFileName expiryDate"
        //     )
        //     .sort({
        //         createdAt: -1,
        //     })
        //     .limit(8)
        //     .lean();

        // =========================
        // RESPONSE
        // =========================

        return res.status(200).json({
            success: true,

            data: {
                // =========================
                // DASHBOARD STATS
                // =========================

                stats: {
                    users: totalUsers,
                    activeUsers,

                    vendors: totalVendors,

                    documents: totalDocuments,

                    expiringSoon,

                    expired: expiredDocuments,
                },

                // =========================
                // VENDOR DATA
                // =========================

                vendors: {
                    total: totalVendors,

                    active: activeVendors,

                    pending: pendingVendors,

                    suspended: suspendedVendors,

                    inactive: inactiveVendors,

                    compliant: compliantVendors,

                    needingAttention: attentionVendors,

                    recent: vendors,
                },

                // =========================
                // DOCUMENT DATA
                // =========================

                documents: {
                    total: totalDocuments,

                    pendingReview: pendingDocuments,

                    approved: approvedDocuments,

                    rejected: rejectedDocuments,

                    expired: expiredDocuments,

                    expiringSoon,
                },

                // =========================
                // EXPIRY OVERVIEW
                // =========================

                expiryOverview: {
                    expired: expiredCount,

                    expiring30Days: expiring30Count,

                    expiring60Days: expiring60Count,

                    valid: validDocuments,

                    total: totalDocuments,
                },

                // =========================
                // COMPLIANCE
                // =========================

                compliance: {
                    averageScore:
                        averageComplianceScore,

                    compliant: compliantVendors,

                    needingAttention:
                        attentionVendors,
                },

                // =========================
                // NOTIFICATIONS
                // =========================

                // notifications,
            },
        });
    } catch (error) {
        console.error(
            "Super Admin Dashboard Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load Super Admin dashboard",
        });
    }
};

module.exports = {
    getSuperAdminDashboard,
};