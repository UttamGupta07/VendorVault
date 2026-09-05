const bcrypt = require("bcryptjs");

const Vendor = require("../models/Vendor");
const VendorDocument = require("../models/VendorDocument");
const ServiceType=require("../models/ServiceType")

const generateToken = require("../utills/generatetoken");
const setAuthCookie = require("../utills/setAuthCookie");

// ============================================================
// Vendor Registration
// ============================================================

const registerVendor = async (req, res) => {
  try {
    const {
      name,
      companyName,
      email,
      password,
      phone,
      serviceTypeId,
      address,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !companyName ||
      !email ||
      !password ||
      !serviceTypeId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, company name, email, password and service type are required",
      });
    }

    // Only Super Admin and Compliance Officer can register vendors
    if (
      req.user.role !== "SUPER_ADMIN" &&
      req.user.role !== "COMPLIANCE_OFFICER"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to register a vendor",
      });
    }

    // Check duplicate vendor email within organization
    const existingVendor = await Vendor.findOne({
      organizationId: req.user.organizationId,
      email: email.toLowerCase().trim(),
    });

    if (existingVendor) {
      return res.status(409).json({
        success: false,
        message: "Vendor with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create vendor
    const vendor = await Vendor.create({
      organizationId: req.user.organizationId,
      name: name.trim(),
      companyName: companyName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "VENDOR",
      phone,
      serviceTypeId,
      address,
      status: "active",
      createdBy: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Vendor registered successfully",

      vendor: {
        id: vendor._id,
        name: vendor.name,
        companyName: vendor.companyName,
        email: vendor.email,
        phone: vendor.phone,
        role: vendor.role,
        organizationId: vendor.organizationId,
        serviceTypeId: vendor.serviceTypeId,
        address: vendor.address,
        status: vendor.status,
        complianceScore: vendor.complianceScore,
      },
    });
  } catch (error) {
    console.error("Vendor registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ============================================================
// Vendor Login
// ============================================================

const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find vendor
    // +password because password has select:false
    const vendor = await Vendor.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check vendor status
    if (vendor.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your vendor account has been suspended",
      });
    }

    if (vendor.status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "Your vendor account is inactive",
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      vendor.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(vendor);

    // Set authentication cookie
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Vendor login successful",

      vendor: {
        id: vendor._id,
        name: vendor.name,
        companyName: vendor.companyName,
        email: vendor.email,
        phone: vendor.phone,
        role: vendor.role,
        organizationId: vendor.organizationId,
        serviceTypeId: vendor.serviceTypeId,
        address: vendor.address,
        status: vendor.status,
        complianceScore: vendor.complianceScore,
      },
    });
  } catch (error) {
    console.error("Vendor login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ============================================================
// Get Current Vendor
// ============================================================

const getCurrentVendor = async (req, res) => {
  try {
    // Make sure the token belongs to a vendor
    if (req.user.role !== "VENDOR") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Vendor account required.",
      });
    }

    // Find vendor using ID stored in JWT
    const vendor = await Vendor.findById(req.user.userId)
      .populate("serviceTypeId", "name description")
      .select("-password");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,

      vendor: {
        id: vendor._id,
        name: vendor.name,
        companyName: vendor.companyName,
        email: vendor.email,
        phone: vendor.phone,
        role: vendor.role,
        organizationId: vendor.organizationId,
        serviceTypeId: vendor.serviceTypeId,
        address: vendor.address,
        status: vendor.status,
        complianceScore: vendor.complianceScore,
      },
    });
  } catch (error) {
    console.error("Get current vendor error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ============================================================
// Vendor Dashboard
// ============================================================

const getVendorDashboard = async (req, res) => {
  try {
    // --------------------------------------------------------
    // 1. Find logged-in vendor
    // --------------------------------------------------------

    const vendor = await Vendor.findById(req.user.userId)
      .select("-password")
      .populate("serviceTypeId", "name requiredDocuments");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // --------------------------------------------------------
    // 2. Get all documents uploaded by this vendor
    // --------------------------------------------------------

    const documents = await VendorDocument.find({
      vendorId: vendor._id,
    })
      .populate("documentTypeId", "name")
      .sort({ createdAt: -1 });

    // --------------------------------------------------------
    // 3. Required documents for vendor's service type
    // --------------------------------------------------------

    const requiredDocuments =
      vendor.serviceTypeId?.requiredDocuments || [];

    const totalRequiredDocuments = requiredDocuments.length;

    // --------------------------------------------------------
    // 4. Get uploaded document type IDs
    // --------------------------------------------------------

    const uploadedDocumentTypeIds = new Set(
      documents
        .filter((doc) => doc.documentTypeId)
        .map((doc) => doc.documentTypeId._id.toString())
    );

    // --------------------------------------------------------
    // 5. Find missing documents
    // --------------------------------------------------------

    const missingDocuments = requiredDocuments
      .filter((requiredDoc) => {
        const requiredDocumentTypeId =
          requiredDoc.documentTypeId?._id ||
          requiredDoc.documentTypeId;

        if (!requiredDocumentTypeId) {
          return false;
        }

        return !uploadedDocumentTypeIds.has(
          requiredDocumentTypeId.toString()
        );
      })
      .map((requiredDoc) => {
        const documentTypeId =
          requiredDoc.documentTypeId?._id ||
          requiredDoc.documentTypeId;

        const documentName =
          requiredDoc.documentTypeId?.name ||
          requiredDoc.name ||
          "Unknown Document";

        return {
          documentTypeId,
          name: documentName,
          status: "Missing",
        };
      });

    // --------------------------------------------------------
    // 6. Document statistics
    // --------------------------------------------------------

    const approvedDocuments = documents.filter(
      (doc) => doc.status === "APPROVED"
    ).length;

    const pendingReview = documents.filter(
      (doc) => doc.status === "PENDING_REVIEW"
    ).length;

    const rejectedDocuments = documents.filter(
      (doc) => doc.status === "REJECTED"
    ).length;

    // --------------------------------------------------------
    // 7. Expiring documents
    // --------------------------------------------------------

    const today = new Date();

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(
      thirtyDaysFromNow.getDate() + 30
    );

    const expiringDocuments = documents.filter((doc) => {
      if (!doc.expiryDate) {
        return false;
      }

      const expiryDate = new Date(doc.expiryDate);

      return (
        expiryDate >= today &&
        expiryDate <= thirtyDaysFromNow
      );
    });

    // --------------------------------------------------------
    // 8. Expired documents
    // --------------------------------------------------------

    const expiredDocuments = documents.filter((doc) => {
      if (!doc.expiryDate) {
        return false;
      }

      return new Date(doc.expiryDate) < today;
    });

    // --------------------------------------------------------
    // 9. Action required documents
    // --------------------------------------------------------

    const actionDocuments = [];

    // --------------------------------------------------------
    // Missing documents
    // --------------------------------------------------------

    for (const missing of missingDocuments) {
      actionDocuments.push({
        id: null,

        documentTypeId: missing.documentTypeId,

        name: missing.name,

        type: "Required",

        status: "Missing",

        action: "Upload",
      });
    }

    // --------------------------------------------------------
    // Expiring documents
    // --------------------------------------------------------

    for (const document of expiringDocuments) {
      actionDocuments.push({
        id: document._id,

        documentTypeId: document.documentTypeId?._id,

        name:
          document.documentTypeId?.name ||
          document.originalFileName,

        type: "Document",

        status: "Expiring Soon",

        action: "Renew",

        expiryDate: document.expiryDate,
      });
    }

    // --------------------------------------------------------
    // Rejected documents
    // --------------------------------------------------------

    const rejected = documents.filter(
      (doc) => doc.status === "REJECTED"
    );

    for (const document of rejected) {
      actionDocuments.push({
        id: document._id,

        documentTypeId: document.documentTypeId?._id,

        name:
          document.documentTypeId?.name ||
          document.originalFileName,

        type: "Document",

        status: "Rejected",

        action: "Replace",

        rejectionReason: document.rejectionReason,
      });
    }

    // --------------------------------------------------------
    // 10. Compliance score
    // --------------------------------------------------------

    let complianceScore = 0;

    if (totalRequiredDocuments > 0) {
      complianceScore = Math.round(
        (approvedDocuments / totalRequiredDocuments) * 100
      );

      // Prevent score above 100
      complianceScore = Math.min(
        complianceScore,
        100
      );
    }

    // --------------------------------------------------------
    // 11. Return dashboard
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,

      data: {
        // ----------------------------------------------------
        // Vendor information
        // ----------------------------------------------------

        vendor: {
          id: vendor._id,

          name: vendor.name,

          companyName: vendor.companyName,

          email: vendor.email,

          phone: vendor.phone,

          status: vendor.status,

          serviceType:
            vendor.serviceTypeId?.name || null,
        },

        // ----------------------------------------------------
        // Compliance
        // ----------------------------------------------------

        complianceScore,

        // ----------------------------------------------------
        // Document statistics
        // ----------------------------------------------------

        totalDocuments: totalRequiredDocuments,

        uploadedDocuments: documents.length,

        approvedDocuments,

        underReview: pendingReview,

        rejectedDocuments,

        expiringSoon: expiringDocuments.length,

        expiredDocuments: expiredDocuments.length,

        // ----------------------------------------------------
        // Missing document count
        // ----------------------------------------------------

        missingDocuments: missingDocuments.length,

        // ----------------------------------------------------
        // Total action required
        // ----------------------------------------------------

        actionRequired:
          missingDocuments.length +
          expiringDocuments.length +
          rejectedDocuments.length,

        // ----------------------------------------------------
        // Action required list
        // ----------------------------------------------------

        actionDocuments: actionDocuments.slice(0, 5),

        // ----------------------------------------------------
        // Missing document details
        // ----------------------------------------------------

        missingDocumentDetails: missingDocuments,
      },
    });
  } catch (error) {
    console.error(
      "Vendor dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load vendor dashboard",
    });
  }
};




 


const getVendorDocumentRequirements = async (req, res) => {
  try {
    // --------------------------------------------------------
    // 1. Check authentication
    // --------------------------------------------------------

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Vendor authentication required.",
      });
    }

    // --------------------------------------------------------
    // 2. Get vendor information
    // --------------------------------------------------------

    const vendorId = req.user.userId;
    const organizationId = req.user.organizationId;

    const vendor = await Vendor.findOne({
      _id: vendorId,
      organizationId,
      role: "VENDOR",
    }).lean();

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }

    // --------------------------------------------------------
    // 3. Check vendor service type
    // --------------------------------------------------------

    if (!vendor.serviceTypeId) {
      return res.status(400).json({
        success: false,
        message: "No service type is assigned to this vendor.",
      });
    }

    // --------------------------------------------------------
    // 4. Get service type and required documents
    // --------------------------------------------------------

    const serviceType = await ServiceType.findOne({
      _id: vendor.serviceTypeId,
      organizationId,
      isActive: true,
    })
      .populate({
        path: "requiredDocuments.documentTypeId",
      })
      .lean();

    if (!serviceType) {
      return res.status(404).json({
        success: false,
        message: "Service type not found.",
      });
    }

    // --------------------------------------------------------
    // 5. Get uploaded documents of this vendor
    // --------------------------------------------------------

    const uploadedDocuments = await VendorDocument.find({
      vendorId,
      organizationId,
      serviceTypeId: vendor.serviceTypeId,
    })
      .sort({ createdAt: -1 })
      .lean();

    // --------------------------------------------------------
    // 6. Keep latest document for each document type
    // --------------------------------------------------------

    const latestDocuments = new Map();

    for (const document of uploadedDocuments) {
      const documentTypeId = document.documentTypeId.toString();

      if (!latestDocuments.has(documentTypeId)) {
        latestDocuments.set(documentTypeId, document);
      }
    }

    // --------------------------------------------------------
    // 7. Combine required + uploaded documents
    // --------------------------------------------------------

    const documents = serviceType.requiredDocuments
      .map((requiredDocument) => {
        const documentType = requiredDocument.documentTypeId;

        // Skip invalid document references
        if (!documentType) {
          return null;
        }

        const documentTypeId = documentType._id.toString();

        const uploadedDocument =
          latestDocuments.get(documentTypeId);

        return {
          // -----------------------------------------
          // IDs required by upload API
          // -----------------------------------------

          documentTypeId: documentType._id,
          serviceTypeId: serviceType._id,

          // -----------------------------------------
          // Document Type information
          // -----------------------------------------

          name: documentType.name,

          description: documentType.description || "",

          // -----------------------------------------
          // Requirement information
          // -----------------------------------------

          isRequired: requiredDocument.isRequired,

          expiryRequired: requiredDocument.expiryRequired,

          reminderDays: requiredDocument.reminderDays,

          // -----------------------------------------
          // Upload status
          // -----------------------------------------

          uploaded: !!uploadedDocument,

          // -----------------------------------------
          // Uploaded document information
          // -----------------------------------------

          documentId: uploadedDocument
            ? uploadedDocument._id
            : null,

          originalFileName: uploadedDocument
            ? uploadedDocument.originalFileName
            : null,

          fileUrl: uploadedDocument
            ? uploadedDocument.fileUrl
            : null,

          mimeType: uploadedDocument
            ? uploadedDocument.mimeType
            : null,

          fileSize: uploadedDocument
            ? uploadedDocument.fileSize
            : null,

          // -----------------------------------------
          // Extraction information
          // -----------------------------------------

          extractionStatus: uploadedDocument
            ? uploadedDocument.extractionStatus
            : null,

          // -----------------------------------------
          // Compliance information
          // -----------------------------------------

          status: uploadedDocument
            ? uploadedDocument.status
            : null,

          expiryDate: uploadedDocument
            ? uploadedDocument.expiryDate
            : null,

          rejectionReason: uploadedDocument
            ? uploadedDocument.rejectionReason
            : null,

          // -----------------------------------------
          // Version information
          // -----------------------------------------

          version: uploadedDocument
            ? uploadedDocument.version
            : null,
        };
      })
      .filter(Boolean);

    // --------------------------------------------------------
    // 8. Calculate summary
    // --------------------------------------------------------

    const totalRequired = documents.filter(
      (document) => document.isRequired
    ).length;

    const uploadedCount = documents.filter(
      (document) => document.uploaded
    ).length;

    const missingCount = documents.filter(
      (document) =>
        document.isRequired && !document.uploaded
    ).length;

    // --------------------------------------------------------
    // 9. Send response
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,

      vendor: {
        id: vendor._id,
        name: vendor.name,
        companyName: vendor.companyName,
        email: vendor.email,
      },

      serviceType: {
        id: serviceType._id,
        name: serviceType.name,
        description: serviceType.description,
      },

      summary: {
        totalRequired,
        uploaded: uploadedCount,
        missing: missingCount,
      },

      documents,
    });
  } catch (error) {
    console.error(
      "Get vendor document requirements error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch required documents.",
      error: error.message,
    });
  }
};

 



// ============================================================
// Exports
// ============================================================

module.exports = {
  registerVendor,
  loginVendor,
  getCurrentVendor,
  getVendorDashboard,
  getVendorDocumentRequirements,
};
 