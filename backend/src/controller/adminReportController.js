const VendorDocument = require("../models/VendorDocument");
const User = require("../models/User");

const getAdminReports = async (req, res) => {
    try {
        const [
            totalDocuments,
            approvedDocuments,
            rejectedDocuments,
            pendingDocuments,
            totalVendors,
            totalComplianceOfficers,
        ] = await Promise.all([
            VendorDocument.countDocuments(),
            VendorDocument.countDocuments({ status: "APPROVED" }),
            VendorDocument.countDocuments({ status: "REJECTED" }),
            VendorDocument.countDocuments({
                status: { $nin: ["APPROVED", "REJECTED"] },
            }),
            User.countDocuments({ role: "VENDOR" }),
            User.countDocuments({ role: "COMPLIANCE_OFFICER" }),
        ]);

        const approvalRate =
            totalDocuments > 0
                ? Math.round((approvedDocuments / totalDocuments) * 100)
                : 0;

        const rejectionRate =
            totalDocuments > 0
                ? Math.round((rejectedDocuments / totalDocuments) * 100)
                : 0;

        res.status(200).json({
            success: true,
            reports: {
                totalDocuments,
                approvedDocuments,
                rejectedDocuments,
                pendingDocuments,
                totalVendors,
                totalComplianceOfficers,
                approvalRate,
                rejectionRate,
            },
        });
    } catch (error) {
        console.error("Admin reports error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch admin reports",
        });
    }
};

module.exports = {
    getAdminReports,
};