const Vendor = require("../models/Vendor");
const VendorDocument = require("../models/VendorDocument");
const ServiceType = require("../models/ServiceType");

const getComplianceDashboard = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    // --------------------------------------------------
    // 1. Get all vendors in organization
    // --------------------------------------------------
    const vendors = await Vendor.find({
      organizationId,
    }).select("_id name companyName email status serviceTypeId");

    const totalVendors = vendors.length;

    // --------------------------------------------------
    // 2. Get all service types
    // --------------------------------------------------
    const serviceTypes = await ServiceType.find({
      organizationId,
    }).lean();

    const serviceTypeMap = {};

    serviceTypes.forEach((service) => {
      serviceTypeMap[service._id.toString()] = service;
    });

    // --------------------------------------------------
    // 3. Get all documents
    // --------------------------------------------------
    const documents = await VendorDocument.find({
      organizationId,
    })
      .populate("vendorId", "name companyName email")
      .populate("documentTypeId", "name")
      .lean();

    // --------------------------------------------------
    // 4. Basic document statistics
    // --------------------------------------------------
    const pendingReviews = documents.filter(
      (doc) => doc.status === "PENDING_REVIEW"
    ).length;

    const rejectedDocuments = documents.filter(
      (doc) => doc.status === "REJECTED"
    ).length;

    const approvedDocuments = documents.filter(
      (doc) => doc.status === "APPROVED"
    ).length;

    // --------------------------------------------------
    // 5. Expiry statistics
    // --------------------------------------------------
    const today = new Date();

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    let expiredDocuments = 0;
    let expiringSoonDocuments = 0;

    documents.forEach((doc) => {
      if (!doc.expiryDate) return;

      const expiryDate = new Date(doc.expiryDate);

      if (expiryDate < today) {
        expiredDocuments++;
      } else if (expiryDate <= thirtyDaysFromNow) {
        expiringSoonDocuments++;
      }
    });

    // --------------------------------------------------
    // 6. Calculate vendor compliance
    // --------------------------------------------------
    const vendorCompliance = [];

    for (const vendor of vendors) {
      const serviceType = serviceTypeMap[
        vendor.serviceTypeId?.toString()
      ];

      if (!serviceType) {
        vendorCompliance.push({
          vendorId: vendor._id,
          vendorName: vendor.companyName || vendor.name,
          complianceScore: 0,
          status: "Non-Compliant",
        });

        continue;
      }

      const requiredDocuments = serviceType.requiredDocuments || [];

      const totalRequired = requiredDocuments.filter(
        (doc) => doc.isRequired !== false
      ).length;

      if (totalRequired === 0) {
        vendorCompliance.push({
          vendorId: vendor._id,
          vendorName: vendor.companyName || vendor.name,
          complianceScore: 100,
          status: "Compliant",
        });

        continue;
      }

      const vendorDocs = documents.filter(
        (doc) =>
          doc.vendorId &&
          doc.vendorId._id.toString() === vendor._id.toString()
      );

      let approvedRequired = 0;

      for (const requiredDoc of requiredDocuments) {
        if (requiredDoc.isRequired === false) continue;

        const uploadedDoc = vendorDocs.find(
          (doc) =>
            doc.documentTypeId &&
            doc.documentTypeId._id.toString() ===
              requiredDoc.documentTypeId.toString()
        );

        if (!uploadedDoc) continue;

        // Document must be approved
        if (uploadedDoc.status !== "approved") continue;

        // Expired document should not count
        if (uploadedDoc.expiryDate) {
          const expiryDate = new Date(uploadedDoc.expiryDate);

          if (expiryDate < today) continue;
        }

        approvedRequired++;
      }

      const complianceScore = Math.min(
        100,
        Math.round((approvedRequired / totalRequired) * 100)
      );

      let status = "Non-Compliant";

      if (complianceScore === 100) {
        status = "Compliant";
      } else if (complianceScore >= 70) {
        status = "Warning";
      }

      vendorCompliance.push({
        vendorId: vendor._id,
        vendorName: vendor.companyName || vendor.name,
        email: vendor.email,
        complianceScore,
        status,
      });
    }

    // --------------------------------------------------
    // 7. Vendor counts
    // --------------------------------------------------
    const compliantVendors = vendorCompliance.filter(
      (vendor) => vendor.status === "Compliant"
    ).length;

    const nonCompliantVendors = vendorCompliance.filter(
      (vendor) => vendor.status === "Non-Compliant"
    ).length;

    const warningVendors = vendorCompliance.filter(
      (vendor) => vendor.status === "Warning"
    ).length;

    // --------------------------------------------------
    // 8. Overall compliance
    // --------------------------------------------------
    let overallCompliance = 0;

    if (totalVendors > 0) {
      const totalScore = vendorCompliance.reduce(
        (sum, vendor) => sum + vendor.complianceScore,
        0
      );

      overallCompliance = Math.round(totalScore / totalVendors);
    }

    // --------------------------------------------------
    // 9. Vendors requiring attention
    // --------------------------------------------------
    const attentionVendors = vendorCompliance
      .filter(
        (vendor) =>
          vendor.status !== "Compliant" ||
          vendor.complianceScore < 100
      )
      .sort((a, b) => a.complianceScore - b.complianceScore)
      .slice(0, 10);

    // --------------------------------------------------
    // 10. Recent documents
    // --------------------------------------------------
    const recentDocuments = [...documents]
      .sort((a, b) => {
        return (
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
        );
      })
      .slice(0, 10)
      .map((doc) => ({
        _id: doc._id,
        vendorName:
          doc.vendorId?.companyName ||
          doc.vendorId?.name ||
          "Unknown Vendor",
        documentName:
          doc.documentTypeId?.name || "Document",
        status: doc.status,
        extractionStatus: doc.extractionStatus,
        createdAt: doc.createdAt,
      }));

    // --------------------------------------------------
    // 11. Response
    // --------------------------------------------------
    return res.status(200).json({
      success: true,

      stats: {
        totalVendors,
        compliantVendors,
        warningVendors,
        nonCompliantVendors,
        pendingReviews,
        approvedDocuments,
        rejectedDocuments,
        expiredDocuments,
        expiringSoonDocuments,
        overallCompliance,
      },

      vendorCompliance,

      attentionVendors,

      recentDocuments,
    });
  } catch (error) {
    console.error(
      "Compliance Dashboard Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load compliance dashboard",
      error: error.message,
    });
  }
};

module.exports = {
  getComplianceDashboard,
};