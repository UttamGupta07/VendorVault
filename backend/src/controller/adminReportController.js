const VendorDocument = require("../models/VendorDocument");
const User = require("../models/User");

const getAdminReports = async (req, res) => {
    try {
        // Get the organization of the logged-in Super Admin.
        // All report data must be limited to this organization.
        const organizationId = req.user.organizationId;

        // Stop the request if organization information is missing.
        if (!organizationId) {
            return res.status(400).json({
                success: false,
                message: "Organization ID is missing",
            });
        }

        // Fetch all report statistics only for the
        // organization of the logged-in Super Admin.
        const [
            totalDocuments,
            approvedDocuments,
            rejectedDocuments,
            pendingDocuments,
            totalVendors,
            totalComplianceOfficers,
        ] = await Promise.all([
            // Total documents of current organization
            VendorDocument.countDocuments({
                organizationId,
            }),

            // Approved documents of current organization
            VendorDocument.countDocuments({
                organizationId,
                status: "APPROVED",
            }),

            // Rejected documents of current organization
            VendorDocument.countDocuments({
                organizationId,
                status: "REJECTED",
            }),

            // Pending documents of current organization
            VendorDocument.countDocuments({
                organizationId,
                status: {
                    $nin: ["APPROVED", "REJECTED"],
                },
            }),

            // Vendors of current organization
            User.countDocuments({
                organizationId,
                role: "VENDOR",
            }),

            // Compliance Officers of current organization
            User.countDocuments({
                organizationId,
                role: "COMPLIANCE_OFFICER",
            }),
        ]);

        // Calculate approval percentage.
        const approvalRate =
            totalDocuments > 0
                ? Math.round((approvedDocuments / totalDocuments) * 100)
                : 0;

        // Calculate rejection percentage.
        const rejectionRate =
            totalDocuments > 0
                ? Math.round((rejectedDocuments / totalDocuments) * 100)
                : 0;

        // Send report data to frontend.
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