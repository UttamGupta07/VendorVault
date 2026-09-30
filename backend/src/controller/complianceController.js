 const Vendor = require("../models/Vendor");
const VendorDocument = require("../models/VendorDocument");
const ServiceType = require("../models/ServiceType");
const User = require("../models/User");
 const bcrypt = require("bcryptjs");
const Organization = require("../models/Organization");

const getDateOnly = (date) => {
  if (!date) return null;

  const d = new Date(date);

  return `${d.getUTCFullYear()}-${String(
    d.getUTCMonth() + 1
  ).padStart(2, "0")}-${String(
    d.getUTCDate()
  ).padStart(2, "0")}`;
};

const getComplianceOverview = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    const vendors = await Vendor.find({
      organizationId,
      status: { $ne: "inactive" },
    }).lean();

    const serviceTypes = await ServiceType.find({
      organizationId,
      isActive: true,
    })
      .populate("requiredDocuments.documentTypeId", "name")
      .lean();

    const documents = await VendorDocument.find({
      organizationId,
    }).lean();

    const serviceTypeMap = new Map();

    serviceTypes.forEach((service) => {
      serviceTypeMap.set(
        service._id.toString(),
        service
      );
    });

    const vendorDocumentsMap = new Map();

    documents.forEach((document) => {
      const vendorId = document.vendorId.toString();

      if (!vendorDocumentsMap.has(vendorId)) {
        vendorDocumentsMap.set(vendorId, []);
      }

      vendorDocumentsMap.get(vendorId).push(document);
    });

    const today = getDateOnly(new Date());

    const vendorCompliance = vendors.map((vendor) => {
      const vendorId = vendor._id.toString();

      const serviceType = serviceTypeMap.get(
        vendor.serviceTypeId?.toString()
      );

      const vendorDocuments =
        vendorDocumentsMap.get(vendorId) || [];

      if (!serviceType) {
        return {
          vendorId: vendor._id,
          vendorName:
            vendor.companyName ||
            vendor.name ||
            "Unknown Vendor",
          vendorEmail: vendor.email || null,
          vendorStatus: vendor.status,
          serviceType: "Not Assigned",
          score: 0,
          status: "NON_COMPLIANT",
          totalRequirements: 0,
          satisfiedRequirements: 0,
          requirements: [],
          issues: [
            {
              type: "SERVICE_TYPE_MISSING",
              message:
                "No active service type is assigned to this vendor.",
            },
          ],
        };
      }

      const requiredDocuments =
        serviceType.requiredDocuments || [];

      const mandatoryDocuments =
        requiredDocuments.filter(
          (requirement) =>
            requirement.isRequired !== false
        );

      const totalRequirements =
        mandatoryDocuments.length;

      let satisfiedRequirements = 0;
      let hasPendingReview = false;
      let hasRisk = false;
      let hasCriticalIssue = false;

      const requirements = [];
      const issues = [];

      requiredDocuments.forEach((requirement) => {
        const documentTypeId =
          requirement.documentTypeId?._id ||
          requirement.documentTypeId;

        const documentTypeName =
          requirement.documentTypeId?.name ||
          "Unknown Document";

        const matchingDocuments =
          vendorDocuments
            .filter(
              (document) =>
                document.documentTypeId &&
                document.documentTypeId.toString() ===
                  documentTypeId.toString()
            )
            .sort(
              (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
            );

        const document = matchingDocuments[0];

        // ==============================================
        // MISSING
        // ==============================================

        if (!document) {
          requirements.push({
            documentTypeId,
            documentTypeName,
            isRequired:
              requirement.isRequired !== false,
            expiryRequired:
              requirement.expiryRequired === true,
            status: "MISSING",
            documentId: null,
            expiryDate: null,
          });

          if (requirement.isRequired !== false) {
            hasCriticalIssue = true;

            issues.push({
              type: "MISSING_DOCUMENT",
              documentType: documentTypeName,
              message:
                `${documentTypeName} is missing.`,
            });
          }

          return;
        }

        // ==============================================
        // REJECTED
        // ==============================================

        if (document.status === "REJECTED") {
          requirements.push({
            documentTypeId,
            documentTypeName,
            isRequired:
              requirement.isRequired !== false,
            expiryRequired:
              requirement.expiryRequired === true,
            status: "REJECTED",
            documentId: document._id,
            expiryDate:
              document.expiryDate || null,
          });

          if (requirement.isRequired !== false) {
            hasCriticalIssue = true;

            issues.push({
              type: "REJECTED_DOCUMENT",
              documentType: documentTypeName,
              message:
                `${documentTypeName} has been rejected.`,
            });
          }

          return;
        }

        // ==============================================
        // PENDING REVIEW
        // ==============================================

        if (document.status === "PENDING_REVIEW") {
          hasPendingReview = true;

          requirements.push({
            documentTypeId,
            documentTypeName,
            isRequired:
              requirement.isRequired !== false,
            expiryRequired:
              requirement.expiryRequired === true,
            status: "PENDING_REVIEW",
            documentId: document._id,
            expiryDate:
              document.expiryDate || null,
          });

          if (requirement.isRequired !== false) {
            issues.push({
              type: "PENDING_REVIEW",
              documentType: documentTypeName,
              message:
                `${documentTypeName} is waiting for review.`,
            });
          }

          return;
        }

        // ==============================================
        // INVALID STATUS
        // ==============================================

        if (document.status !== "APPROVED") {
          requirements.push({
            documentTypeId,
            documentTypeName,
            isRequired:
              requirement.isRequired !== false,
            expiryRequired:
              requirement.expiryRequired === true,
            status: "INVALID",
            documentId: document._id,
            expiryDate:
              document.expiryDate || null,
          });

          if (requirement.isRequired !== false) {
            hasCriticalIssue = true;

            issues.push({
              type: "INVALID_STATUS",
              documentType: documentTypeName,
              message:
                `${documentTypeName} has an invalid status.`,
            });
          }

          return;
        }

        // ==============================================
        // EXPIRY REQUIRED BUT MISSING
        // ==============================================

        if (
          requirement.expiryRequired === true &&
          !document.expiryDate
        ) {
          requirements.push({
            documentTypeId,
            documentTypeName,
            isRequired:
              requirement.isRequired !== false,
            expiryRequired: true,
            status: "EXPIRY_MISSING",
            documentId: document._id,
            expiryDate: null,
          });

          if (requirement.isRequired !== false) {
            hasCriticalIssue = true;

            issues.push({
              type: "EXPIRY_MISSING",
              documentType: documentTypeName,
              message:
                `${documentTypeName} does not have an expiry date.`,
            });
          }

          return;
        }

        // ==============================================
        // EXPIRY CHECK
        // ==============================================

        const expiryDate = getDateOnly(
          document.expiryDate
        );

        // Expiry date TODAY is considered expired
        if (
          expiryDate &&
          expiryDate <= today
        ) {
          requirements.push({
            documentTypeId,
            documentTypeName,
            isRequired:
              requirement.isRequired !== false,
            expiryRequired:
              requirement.expiryRequired === true,
            status: "EXPIRED",
            documentId: document._id,
            expiryDate: document.expiryDate,
            daysRemaining: 0,
          });

          if (requirement.isRequired !== false) {
            hasCriticalIssue = true;

            issues.push({
              type: "EXPIRED_DOCUMENT",
              documentType: documentTypeName,
              message:
                `${documentTypeName} has expired.`,
            });
          }

          return;
        }

        // ==============================================
        // EXPIRING SOON
        // ==============================================

        let daysRemaining = null;
        let isExpiringSoon = false;

        if (expiryDate) {
          const todayDate = new Date(
            `${today}T00:00:00Z`
          );

          const expiry = new Date(
            `${expiryDate}T00:00:00Z`
          );

          daysRemaining = Math.ceil(
            (expiry - todayDate) /
              (1000 * 60 * 60 * 24)
          );

          if (
            daysRemaining > 0 &&
            daysRemaining <= 30
          ) {
            isExpiringSoon = true;
            hasRisk = true;

            issues.push({
              type: "EXPIRING_SOON",
              documentType: documentTypeName,
              message:
                `${documentTypeName} expires in ${daysRemaining} day${
                  daysRemaining === 1
                    ? ""
                    : "s"
                }.`,
            });
          }
        }

        // ==============================================
        // APPROVED + VALID
        // ==============================================

        requirements.push({
          documentTypeId,
          documentTypeName,
          isRequired:
            requirement.isRequired !== false,
          expiryRequired:
            requirement.expiryRequired === true,
          status: isExpiringSoon
            ? "EXPIRING_SOON"
            : "APPROVED",
          documentId: document._id,
          expiryDate:
            document.expiryDate || null,
          daysRemaining,
        });

        // Only approved + valid mandatory documents
        // increase the compliance score.
        if (requirement.isRequired !== false) {
          satisfiedRequirements++;
        }
      });

      // ==============================================
      // SCORE
      // ==============================================

      const score =
        totalRequirements > 0
          ? Math.round(
              (satisfiedRequirements /
                totalRequirements) *
                100
            )
          : 0;

      // ==============================================
      // STATUS
      // ==============================================

      let status;

      if (hasCriticalIssue) {
        status = "NON_COMPLIANT";
      } else if (hasPendingReview) {
        status = "PENDING_REVIEW";
      } else if (hasRisk) {
        status = "AT_RISK";
      } else {
        status = "COMPLIANT";
      }

      return {
        vendorId: vendor._id,
        vendorName:
          vendor.companyName ||
          vendor.name ||
          "Unknown Vendor",
        vendorEmail: vendor.email || null,
        vendorStatus: vendor.status,
        serviceType: serviceType.name,
        score,
        status,
        totalRequirements,
        satisfiedRequirements,
        requirements,
        issues,
      };
    });

    // ==============================================
    // SUMMARY
    // ==============================================

    const summary = {
      totalVendors: vendorCompliance.length,

      compliant:
        vendorCompliance.filter(
          (vendor) =>
            vendor.status === "COMPLIANT"
        ).length,

      atRisk:
        vendorCompliance.filter(
          (vendor) =>
            vendor.status === "AT_RISK"
        ).length,

      nonCompliant:
        vendorCompliance.filter(
          (vendor) =>
            vendor.status === "NON_COMPLIANT"
        ).length,

      pendingReview:
        vendorCompliance.filter(
          (vendor) =>
            vendor.status === "PENDING_REVIEW"
        ).length,

      averageScore: 0,
    };

    if (vendorCompliance.length > 0) {
      const totalScore =
        vendorCompliance.reduce(
          (sum, vendor) =>
            sum + vendor.score,
          0
        );

      summary.averageScore =
        Math.round(
          totalScore /
            vendorCompliance.length
        );
    }

    return res.status(200).json({
      success: true,
      summary,
      vendors: vendorCompliance,
    });
  } catch (error) {
    console.error(
      "Get compliance overview error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load compliance overview",
      error: error.message,
    });
  }
};
const getProfile = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");

    // Get logged-in user
    const user = await User.findById(req.user.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    // Get organization
    const organization = await Organization.findById(
      user.organizationId
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    if (!organization.isActive) {
      return res.status(403).json({
        success: false,
        message: "Organization is inactive",
      });
    }

    return res.status(200).json({
      success: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        organizationId: user.organizationId,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      },

      organization: {
        id: organization._id,
        name: organization.name,
        officialEmail: organization.officialEmail,
        phone: organization.phone || "",
        industry: organization.industry || "",
        companySize: organization.companySize || "",
        country: organization.country || "",
        state: organization.state || "",
        city: organization.city || "",
        website: organization.website || "",
        isActive: organization.isActive,
        createdAt: organization.createdAt,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // ============================================================
    // VALIDATION
    // ============================================================

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone =
      phone !== undefined && phone !== null
        ? phone.trim()
        : "";

    // ============================================================
    // GET LOGGED-IN USER
    // ============================================================

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ============================================================
    // CHECK USER STATUS
    // ============================================================

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    // ============================================================
    // CHECK EMAIL DUPLICATE
    // ============================================================

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: user._id },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered with another user",
      });
    }

    // ============================================================
    // UPDATE USER
    // ============================================================

    user.name = normalizedName;
    user.email = normalizedEmail;
    user.phone = normalizedPhone;

    await user.save();

    // ============================================================
    // RESPONSE
    // ============================================================

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        organizationId: user.organizationId,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    // MongoDB duplicate-key protection
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// =====================================================
// CHANGE PASSWORD - LOGGED IN USER
// =====================================================
const changePassword = async (req, res) => {
  try {
    const {
      oldPassword,
      newPassword,
      confirmPassword,
    } = req.body;
    console.log(req.body);
    

    console.log("🔐 CHANGE PASSWORD CONTROLLER HIT");

    // ==========================================
    // 1. VALIDATE INPUT
    // ==========================================

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Old password, new password and confirm password are required",
      });
    }

    // ==========================================
    // 2. CHECK PASSWORD MATCH
    // ==========================================

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // ==========================================
    // 3. PASSWORD LENGTH
    // ==========================================

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long",
      });
    }

    // ==========================================
    // 4. CHECK OLD AND NEW PASSWORD
    // ==========================================

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from old password",
      });
    }

    // ==========================================
    // 5. FIND LOGGED-IN USER
    // ==========================================

    const user = await User.findById(req.user.userId)
      .select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================================
    // 6. CHECK ACCOUNT STATUS
    // ==========================================

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    console.log(
      `👤 Password change requested for: ${user.email}`
    );

    // ==========================================
    // 7. VERIFY OLD PASSWORD
    // ==========================================

    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // ==========================================
    // 8. HASH NEW PASSWORD
    // ==========================================

    const hashedPassword = await bcrypt.hash(
      newPassword,
      12
    );

    user.password = hashedPassword;

    // ==========================================
    // 9. SAVE PASSWORD
    // ==========================================

    await user.save();

    console.log(
      "🔑 Password changed successfully"
    );

    // ==========================================
    // 10. SUCCESS RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error(
      "❌ Change password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong. Please try again later.",
    });
  }
};

module.exports = {
  getComplianceOverview,
  getProfile,
  updateProfile,
  changePassword,
};