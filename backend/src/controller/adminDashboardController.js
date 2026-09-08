const Vendor = require("../models/Vendor");
const VendorDocument = require("../models/VendorDocument");
const User = require("../models/User");
const Notification = require("../models/Notification");

const getSuperAdminDashboard = async (req, res) => {
    try {
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
            User.countDocuments(),
            User.countDocuments({ isActive: true }),

            Vendor.countDocuments(),
            Vendor.countDocuments({ status: "active" }),
            Vendor.countDocuments({ status: "pending" }),
            Vendor.countDocuments({ status: "suspended" }),
            Vendor.countDocuments({ status: "inactive" }),

            VendorDocument.countDocuments(),
            VendorDocument.countDocuments({ status: "PENDING_REVIEW" }),
            VendorDocument.countDocuments({ status: "APPROVED" }),
            VendorDocument.countDocuments({ status: "REJECTED" }),

            VendorDocument.countDocuments({
                expiryDate: { $lt: today },
            }),

            VendorDocument.countDocuments({
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
                ? Math.round(complianceResult[0].averageScore || 0)
                : 0;

        const [compliantVendors, attentionVendors] =
            await Promise.all([
                Vendor.countDocuments({
                    complianceScore: { $gte: 80 },
                }),
                Vendor.countDocuments({
                    complianceScore: { $lt: 60 },
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
                expiryDate: { $lt: today },
            }),

            VendorDocument.countDocuments({
                expiryDate: {
                    $gte: today,
                    $lte: thirtyDaysLater,
                },
            }),

            VendorDocument.countDocuments({
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
        const vendors = await Vendor.find()
            .select(
                "name companyName email status complianceScore createdAt"
            )
            .sort({ createdAt: -1 })
            .limit(8)
            .lean();

        // =========================
        // RECENT NOTIFICATIONS
        // =========================
        const notifications = await Notification.find()
            .populate("vendorId", "name companyName")
            .populate(
                "documentId",
                "originalFileName expiryDate"
            )
            .sort({ createdAt: -1 })
            .limit(8)
            .lean();

        // =========================
        // RESPONSE
        // =========================
        res.status(200).json({
            success: true,

            data: {
                stats: {
                    users: totalUsers,
                    activeUsers,
                    vendors: totalVendors,
                    documents: totalDocuments,
                    expiringSoon: expiringSoon,
                    expired: expiredDocuments,
                },

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

                documents: {
                    total: totalDocuments,
                    pendingReview: pendingDocuments,
                    approved: approvedDocuments,
                    rejected: rejectedDocuments,
                    expired: expiredDocuments,
                    expiringSoon,
                },

                expiryOverview: {
                    expired: expiredCount,
                    expiring30Days: expiring30Count,
                    expiring60Days: expiring60Count,
                    valid: validDocuments,
                    total: totalDocuments,
                },

                compliance: {
                    averageScore: averageComplianceScore,
                    compliant: compliantVendors,
                    needingAttention: attentionVendors,
                },

                notifications,
            },
        });
    } catch (error) {
        console.error(
            "Super Admin Dashboard Error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to load Super Admin dashboard",
        });
    }
};

module.exports = {
    getSuperAdminDashboard,
};