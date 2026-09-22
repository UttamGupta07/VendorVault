 const fs = require("fs");
const os = require("os");
const axios = require("axios");
const path = require("path");

const { createAuditLog } = require("../services/auditLogService");

const cloudinary = require("../config/cloudinary");
const VendorDocument = require("../models/VendorDocument");

const {
  extractDocumentData,
} = require("../services/geminiExtractionServices");

const {
  notifyUsersByRole,
} = require("../services/notificationService");

// =====================================================
// Upload / Replace Vendor Document
// =====================================================

const uploadVendorDocument = async (req, res) => {
  let uploadedFilePath = null;
  let cloudinaryPublicId = null;

  try {
    // -----------------------------------------
    // 1. Check file
    // -----------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF document",
      });
    }

    uploadedFilePath = req.file.path;

    // -----------------------------------------
    // 2. Get required data
    // -----------------------------------------

    const {
      serviceTypeId,
      documentTypeId,
    } = req.body;

    if (!serviceTypeId || !documentTypeId) {
      return res.status(400).json({
        success: false,
        message:
          "serviceTypeId and documentTypeId are required",
      });
    }

    // -----------------------------------------
    // 3. Get vendor information
    // -----------------------------------------

    console.log(req.user);
    const vendorId = req.user.userId;
    const organizationId = req.user.organizationId;

    if (!vendorId || !organizationId) {
      return res.status(400).json({
        success: false,
        message:
          "Vendor or organization information is missing",
      });
    }

    // -----------------------------------------
    // 4. Find existing document
    // -----------------------------------------

    const existingDocument =
      await VendorDocument.findOne({
        vendorId,
        organizationId,
        serviceTypeId,
        documentTypeId,
      });

    // -----------------------------------------
    // 5. Determine version
    // -----------------------------------------

    const newVersion = existingDocument
      ? (existingDocument.version || 1) + 1
      : 1;

    // -----------------------------------------
    // 6. Upload NEW file to Cloudinary
    // -----------------------------------------

    const cloudinaryResult =
      await cloudinary.uploader.upload(
        uploadedFilePath,
        {
          folder: `vendorvault/${organizationId}/documents`,
          resource_type: "raw",
        }
      );

    cloudinaryPublicId =
      cloudinaryResult.public_id;

    // -----------------------------------------
    // 7. Extract data
    //
    // IMPORTANT:
    // Extraction failure does NOT delete the
    // uploaded Cloudinary file.
    //
    // The document will still be saved in
    // MongoDB with extractionStatus = FAILED.
    // -----------------------------------------

    let extractedData = {};
    let extractionStatus = "PROCESSING";
    let extractionFailed = false;

    try {
      console.log(
        "Starting Gemini extraction for new document..."
      );

      extractedData =
        await extractDocumentData(
          uploadedFilePath
        );

      console.log(
        "Extracted data:",
        extractedData
      );

      extractionStatus = "COMPLETED";
    } catch (extractionError) {
      console.error(
        "Gemini extraction failed:",
        extractionError
      );

      // -----------------------------------------
      // DO NOT DELETE CLOUDINARY FILE
      // DO NOT RETURN HERE
      //
      // Continue and save the document so that
      // extraction can be retried later.
      // -----------------------------------------

      extractedData = {};
      extractionStatus = "FAILED";
      extractionFailed = true;

      console.log(
        "Document will be saved with FAILED extraction status."
      );
    }

    // -----------------------------------------
    // 8. Prepare expiry date
    // -----------------------------------------

    let expiryDate = undefined;

    if (extractedData?.expiryDate) {
      const parsedExpiryDate =
        new Date(
          extractedData.expiryDate
        );

      if (
        !isNaN(
          parsedExpiryDate.getTime()
        )
      ) {
        expiryDate = parsedExpiryDate;
      }
    }

    // -----------------------------------------
    // 9. Create COMPLETELY NEW document
    //
    // This happens even when extraction fails.
    // -----------------------------------------

    const document =
      await VendorDocument.create({
        vendorId,
        organizationId,
        serviceTypeId,
        documentTypeId,

        originalFileName:
          req.file.originalname,

        fileUrl:
          cloudinaryResult.secure_url,

        cloudinaryPublicId:
          cloudinaryResult.public_id,

        mimeType:
          req.file.mimetype,

        fileSize:
          req.file.size,

        extractionStatus,

        extractedData,

        expiryDate,

        // Every new upload/replacement
        // requires fresh review.
        status: "PENDING_REVIEW",

        version: newVersion,
      });

    console.log(
      `New document created: ${document._id}, version: ${newVersion}, extractionStatus: ${extractionStatus}`
    );

    // -----------------------------------------
    // 10. Delete OLD MongoDB document
    //
    // We delete the old document only after
    // the new document has been successfully
    // created.
    // -----------------------------------------

    if (existingDocument) {
      try {
        await VendorDocument.deleteOne({
          _id: existingDocument._id,
        });

        console.log(
          `Old document deleted: ${existingDocument._id}`
        );
      } catch (deleteError) {
        console.error(
          "Failed to delete old MongoDB document:",
          deleteError.message
        );
      }
    }

    // -----------------------------------------
    // 11. CREATE NOTIFICATION
    //
    // IMPORTANT:
    // Notification depends on whether this is
    // a NEW upload or a REPLACEMENT.
    //
    // Extraction success/failure does NOT
    // prevent notification.
    // -----------------------------------------

    // =========================================
    // NEW DOCUMENT UPLOADED
    // =========================================

    if (!existingDocument) {
      try {
        await notifyUsersByRole({
          organizationId,

          roles: ["COMPLIANCE_OFFICER"],

          type: "DOCUMENT_UPLOADED",

          title: extractionFailed
            ? "New Document Uploaded - Extraction Failed"
            : "New Document Uploaded",

          message: extractionFailed
            ? `${document.originalFileName} has been uploaded by the vendor, but automatic data extraction failed. Please retry extraction.`
            : `${document.originalFileName} has been uploaded by the vendor and is waiting for your review.`,

          relatedId: document._id,

          relatedType: "VendorDocument",

          metadata: {
            documentId: document._id,

            vendorId,

            documentTypeId,

            serviceTypeId,

            fileName:
              document.originalFileName,

            status:
              document.status,

            extractionStatus:
              document.extractionStatus,

            extractionFailed,
          },
        });

        console.log(
          "DOCUMENT_UPLOADED notification sent to Compliance Officers"
        );
      } catch (notificationError) {
        // Notification failure must NOT
        // break document upload.

        console.error(
          "Document upload notification error:",
          notificationError.message
        );
      }
    }

    // =========================================
    // DOCUMENT REPLACED
    // =========================================

    else {
      try {
        await notifyUsersByRole({
          organizationId,

          roles: ["COMPLIANCE_OFFICER"],

          type: "DOCUMENT_REPLACED",

          title: extractionFailed
            ? "Document Replaced - Extraction Failed"
            : "Document Replaced",

          message: extractionFailed
            ? `${document.originalFileName} has been replaced by the vendor, but automatic data extraction failed. Please retry extraction.`
            : `${document.originalFileName} has been replaced by the vendor and is waiting for your review.`,

          relatedId: document._id,

          relatedType: "VendorDocument",

          metadata: {
            documentId: document._id,

            vendorId,

            documentTypeId,

            serviceTypeId,

            fileName:
              document.originalFileName,

            version:
              document.version,

            status:
              document.status,

            extractionStatus:
              document.extractionStatus,

            extractionFailed,
          },
        });

        console.log(
          "DOCUMENT_REPLACED notification sent to Compliance Officers"
        );
      } catch (notificationError) {
        // Notification failure must NOT
        // break document replacement.

        console.error(
          "Document replacement notification error:",
          notificationError.message
        );
      }
    }

    // -----------------------------------------
    // 12. Create audit log
    // -----------------------------------------

    try {
      await createAuditLog({
        organizationId,

        actorType: "VENDOR",

        performedByVendor: vendorId,

        action: existingDocument
          ? "DOCUMENT_REPLACED"
          : "DOCUMENT_UPLOADED",

        targetType: "Document",

        targetId: document._id,

        description: existingDocument
          ? `Document "${document.originalFileName}" was replaced`
          : `Document "${document.originalFileName}" was uploaded`,

        metadata: {
          vendorId,

          documentTypeId,

          serviceTypeId,

          fileName:
            document.originalFileName,

          version:
            document.version,

          status:
            document.status,

          extractionStatus:
            document.extractionStatus,

          extractionFailed,
        },
      });
    } catch (auditError) {
      // Audit failure should not break
      // successful document upload.

      console.error(
        "Failed to create document upload audit log:",
        auditError.message
      );
    }

    // -----------------------------------------
    // 13. Delete temporary local file
    // -----------------------------------------

    if (uploadedFilePath) {
      fs.unlink(
        uploadedFilePath,
        (err) => {
          if (err) {
            console.error(
              "Failed to delete temporary file:",
              err.message
            );
          }
        }
      );
    }

    uploadedFilePath = null;

    // -----------------------------------------
    // 14. Delete OLD Cloudinary file
    //
    // IMPORTANT:
    // This is the OLD file.
    //
    // The NEW Cloudinary file is preserved,
    // including when extraction failed.
    // -----------------------------------------

    if (
      existingDocument?.cloudinaryPublicId
    ) {
      try {
        await cloudinary.uploader.destroy(
          existingDocument.cloudinaryPublicId,
          {
            resource_type: "raw",
          }
        );

        console.log(
          `Old Cloudinary file deleted: ${existingDocument.cloudinaryPublicId}`
        );
      } catch (cloudinaryDeleteError) {
        // Do not fail upload if old Cloudinary
        // deletion fails.

        console.error(
          "Failed to delete old Cloudinary file:",
          cloudinaryDeleteError.message
        );
      }
    }

    // -----------------------------------------
    // 15. Response
    // -----------------------------------------

    // Extraction failed
    // -----------------------------------------

    if (extractionFailed) {
      return res.status(201).json({
        success: true,

        message:
          existingDocument
            ? "Document replaced successfully, but data extraction failed. You can retry extraction."
            : "Document uploaded successfully, but data extraction failed. You can retry extraction.",

        extractionStatus:
          "FAILED",

        canRetryExtraction:
          true,

        document: {
          id:
            document._id,

          fileName:
            document.originalFileName,

          fileUrl:
            document.fileUrl,

          mimeType:
            document.mimeType,

          fileSize:
            document.fileSize,

          extractionStatus:
            document.extractionStatus,

          extractedData:
            document.extractedData,

          expiryDate:
            document.expiryDate,

          status:
            document.status,

          version:
            document.version,

          createdAt:
            document.createdAt,
        },
      });
    }

    // Extraction successful
    // -----------------------------------------

    return res.status(201).json({
      success: true,

      message: existingDocument
        ? "Document replaced and data extracted successfully"
        : "Document uploaded and data extracted successfully",

      document: {
        id:
          document._id,

        fileName:
          document.originalFileName,

        fileUrl:
          document.fileUrl,

        mimeType:
          document.mimeType,

        fileSize:
          document.fileSize,

        extractionStatus:
          document.extractionStatus,

        extractedData:
          document.extractedData,

        expiryDate:
          document.expiryDate,

        status:
          document.status,

        version:
          document.version,

        createdAt:
          document.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Upload vendor document error:",
      error
    );

    // -----------------------------------------
    // Delete temporary file
    // -----------------------------------------

    if (uploadedFilePath) {
      fs.unlink(
        uploadedFilePath,
        (err) => {
          if (err) {
            console.error(
              "Failed to delete temporary file:",
              err.message
            );
          }
        }
      );
    }

    // -----------------------------------------
    // Delete NEW Cloudinary file only if the
    // OVERALL upload operation failed.
    //
    // Extraction failure does NOT reach here
    // because it is handled above.
    // -----------------------------------------

    if (cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(
          cloudinaryPublicId,
          {
            resource_type: "raw",
          }
        );

        console.log(
          `New Cloudinary file deleted because upload operation failed: ${cloudinaryPublicId}`
        );
      } catch (
        cloudinaryDeleteError
      ) {
        console.error(
          "Failed to delete Cloudinary file:",
          cloudinaryDeleteError.message
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload document",
      error: error.message,
    });
  }
};

// =====================================================
// Get Pending Review Documents
// =====================================================

const getPendingReviewDocuments = async (
  req,
  res
) => {
  try {
    const organizationId =
      req.user.organizationId;

    const documents =
      await VendorDocument.find({
        organizationId,

        // Only successfully extracted
        // documents should enter normal
        // Compliance review.
        extractionStatus: "COMPLETED",

        status: "PENDING_REVIEW",
      })
        .populate(
          "vendorId",
          "name email companyName"
        )
        .populate(
          "documentTypeId",
          "name"
        )
        .populate(
          "serviceTypeId",
          "name"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error(
      "Get pending review documents error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
      error: error.message,
    });
  }
};

// =====================================================
// Get Single Document For Compliance Officer Review
// =====================================================

const getDocumentForReview = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const organizationId =
      req.user.organizationId;

    const document =
      await VendorDocument.findOne({
        _id: id,
        organizationId,
      })
        .populate(
          "vendorId",
          "name email companyName"
        )
        .populate(
          "documentTypeId",
          "name description"
        )
        .populate(
          "serviceTypeId",
          "name description"
        );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    console.error(
      "Get document for review error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch document",
      error: error.message,
    });
  }
};

// =====================================================
// Approve / Reject Document
// =====================================================

const reviewDocument = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      action,
      rejectionReason,
    } = req.body;

    const organizationId =
      req.user.organizationId;

    const complianceOfficerId =
      req.user.userId;

    // -----------------------------------------
    // 1. Validate action
    // -----------------------------------------

    if (!action) {
      return res.status(400).json({
        success: false,
        message:
          "Review action is required",
      });
    }

    if (
      !["APPROVE", "REJECT"].includes(
        action
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Action must be either APPROVE or REJECT",
      });
    }

    // -----------------------------------------
    // 2. Rejection reason required
    // -----------------------------------------

    if (
      action === "REJECT" &&
      (!rejectionReason ||
        rejectionReason.trim() === "")
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rejection reason is required when rejecting a document",
      });
    }

    // -----------------------------------------
    // 3. Find document
    // -----------------------------------------

    const document =
      await VendorDocument.findOne({
        _id: id,
        organizationId,
      });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // -----------------------------------------
    // 4. Make sure extraction is completed
    // -----------------------------------------

    if (
      document.extractionStatus !==
      "COMPLETED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Document cannot be reviewed until extraction is completed",
      });
    }

    // -----------------------------------------
    // 5. Approve
    // -----------------------------------------

    if (action === "APPROVE") {
      document.status = "APPROVED";
      document.rejectionReason = null;
    }

    // -----------------------------------------
    // 6. Reject
    // -----------------------------------------

    if (action === "REJECT") {
      document.status = "REJECTED";

      document.rejectionReason =
        rejectionReason.trim();
    }

    // -----------------------------------------
    // 7. Review information
    // -----------------------------------------

    document.reviewedBy =
      complianceOfficerId;

    document.reviewedAt = new Date();

    await document.save();

    // -----------------------------------------
    // 8. Create audit log
    // -----------------------------------------

    try {
      await createAuditLog({
        organizationId,

        actorType: "USER",

        performedBy:
          complianceOfficerId,

        action:
          action === "APPROVE"
            ? "DOCUMENT_APPROVED"
            : "DOCUMENT_REJECTED",

        targetType: "Document",

        targetId: document._id,

        description:
          action === "APPROVE"
            ? `Document "${document.originalFileName}" was approved`
            : `Document "${document.originalFileName}" was rejected`,

        metadata: {
          documentTypeId:
            document.documentTypeId,

          vendorId:
            document.vendorId,

          status:
            document.status,

          rejectionReason:
            action === "REJECT"
              ? document.rejectionReason
              : null,

          reviewedAt:
            document.reviewedAt,
        },
      });
    } catch (auditError) {
      console.error(
        "Failed to create document review audit log:",
        auditError.message
      );
    }

    // -----------------------------------------
    // 9. Response
    // -----------------------------------------

    return res.status(200).json({
      success: true,

      message:
        action === "APPROVE"
          ? "Document approved successfully"
          : "Document rejected successfully",

      document: {
        id:
          document._id,

        status:
          document.status,

        reviewedBy:
          document.reviewedBy,

        reviewedAt:
          document.reviewedAt,

        rejectionReason:
          document.rejectionReason,
      },
    });
  } catch (error) {
    console.error(
      "Review document error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to review document",
      error: error.message,
    });
  }
};

// =====================================================
// Get All Documents
// =====================================================

const getAllDocuments = async (
  req,
  res
) => {
  try {
    const organizationId =
      req.user.organizationId;

    const documents =
      await VendorDocument.find({
        organizationId,
      })
        .populate(
          "vendorId",
          "name email companyName"
        )
        .populate(
          "documentTypeId",
          "name description"
        )
        .populate(
          "serviceTypeId",
          "name description"
        )
        .populate(
          "reviewedBy",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error(
      "Get all documents error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch documents",
      error: error.message,
    });
  }
};

// =====================================================
// Get Expiry Tracker Data
// =====================================================

const getExpiryTracker = async (
  req,
  res
) => {
  try {
    const organizationId =
      req.user.organizationId;

    // -------------------------------------------------
    // Current date
    // -------------------------------------------------

    const now = new Date();

    // -------------------------------------------------
    // Start of today
    // -------------------------------------------------

    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // -------------------------------------------------
    // Date boundaries
    // -------------------------------------------------

    const sevenDays =
      new Date(today);

    sevenDays.setDate(
      today.getDate() + 7
    );

    const fifteenDays =
      new Date(today);

    fifteenDays.setDate(
      today.getDate() + 15
    );

    const thirtyDays =
      new Date(today);

    thirtyDays.setDate(
      today.getDate() + 30
    );

    // -------------------------------------------------
    // Get documents
    // -------------------------------------------------

    const documents =
      await VendorDocument.find({
        organizationId,
        expiryDate: {
          $ne: null,
        },
      })
        .populate(
          "vendorId",
          "name email companyName"
        )
        .populate(
          "documentTypeId",
          "name description"
        )
        .populate(
          "serviceTypeId",
          "name description"
        )
        .populate(
          "reviewedBy",
          "name email"
        )
        .sort({
          expiryDate: 1,
        });

    // -------------------------------------------------
    // Categorize documents
    // -------------------------------------------------

    const categorizedDocuments =
      documents.map(
        (document) => {
          const expiry =
            new Date(
              document.expiryDate
            );

          const difference =
            expiry.getTime() -
            today.getTime();

          const daysRemaining =
            Math.ceil(
              difference /
                (1000 * 60 * 60 * 24)
            );

          let expiryStatus =
            "VALID";

          if (expiry < today) {
            expiryStatus =
              "EXPIRED";
          } else if (
            expiry <= sevenDays
          ) {
            expiryStatus =
              "CRITICAL";
          } else if (
            expiry <= fifteenDays
          ) {
            expiryStatus =
              "EXPIRING_15_DAYS";
          } else if (
            expiry <= thirtyDays
          ) {
            expiryStatus =
              "EXPIRING_30_DAYS";
          }

          return {
            id:
              document._id,

            vendor:
              document.vendorId
                ? {
                    id:
                      document.vendorId
                        ._id,

                    name:
                      document.vendorId
                        .name,

                    email:
                      document.vendorId
                        .email,

                    companyName:
                      document.vendorId
                        .companyName,
                  }
                : null,

            documentType:
              document.documentTypeId
                ? {
                    id:
                      document
                        .documentTypeId
                        ._id,

                    name:
                      document
                        .documentTypeId
                        .name,
                  }
                : null,

            serviceType:
              document.serviceTypeId
                ? {
                    id:
                      document
                        .serviceTypeId
                        ._id,

                    name:
                      document
                        .serviceTypeId
                        .name,
                  }
                : null,

            fileName:
              document.originalFileName,

            fileUrl:
              document.fileUrl,

            expiryDate:
              document.expiryDate,

            daysRemaining,

            expiryStatus,

            reviewStatus:
              document.status,

            extractionStatus:
              document.extractionStatus,

            rejectionReason:
              document.rejectionReason,

            reviewedAt:
              document.reviewedAt,

            createdAt:
              document.createdAt,
          };
        }
      );

    // -------------------------------------------------
    // Summary
    // -------------------------------------------------

    const summary = {
      expired:
        categorizedDocuments.filter(
          (doc) =>
            doc.expiryStatus ===
            "EXPIRED"
        ).length,

      expiring7Days:
        categorizedDocuments.filter(
          (doc) =>
            doc.expiryStatus ===
            "CRITICAL"
        ).length,

      expiring15Days:
        categorizedDocuments.filter(
          (doc) =>
            doc.expiryStatus ===
            "EXPIRING_15_DAYS"
        ).length,

      expiring30Days:
        categorizedDocuments.filter(
          (doc) =>
            doc.expiryStatus ===
            "EXPIRING_30_DAYS"
        ).length,

      valid:
        categorizedDocuments.filter(
          (doc) =>
            doc.expiryStatus ===
            "VALID"
        ).length,

      total:
        categorizedDocuments.length,
    };

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      summary,
      count:
        categorizedDocuments.length,
      documents:
        categorizedDocuments,
    });
  } catch (error) {
    console.error(
      "Get expiry tracker error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch expiry tracker data",
      error: error.message,
    });
  }
};

// =====================================================
// Retry Document Extraction
// =====================================================

const retryDocumentExtraction =
  async (req, res) => {
    let temporaryFilePath = null;

    try {
      const { id } = req.params;

      const organizationId =
        req.user.organizationId;

      // -----------------------------------------
      // 1. Find document
      // -----------------------------------------

      const document =
        await VendorDocument.findOne({
          _id: id,
          organizationId,
        });

      if (!document) {
        return res.status(404).json({
          success: false,
          message:
            "Document not found",
        });
      }

      // -----------------------------------------
      // 2. Make sure file URL exists
      // -----------------------------------------

      if (!document.fileUrl) {
        return res.status(400).json({
          success: false,
          message:
            "Document file is not available",
        });
      }

      // -----------------------------------------
      // 3. Only retry failed extraction
      // -----------------------------------------

      if (
        document.extractionStatus !==
        "FAILED"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Extraction retry is only available for failed documents",
        });
      }

      // -----------------------------------------
      // 4. Mark extraction as processing
      // -----------------------------------------

      document.extractionStatus =
        "PROCESSING";

      await document.save();

      // -----------------------------------------
      // 5. Create temporary file
      // -----------------------------------------

      const tempFileName =
        `vendor-document-${Date.now()}.pdf`;

      temporaryFilePath =
        path.join(
          os.tmpdir(),
          tempFileName
        );

      // -----------------------------------------
      // 6. Download PDF from Cloudinary
      // -----------------------------------------

      const response =
        await axios.get(
          document.fileUrl,
          {
            responseType:
              "arraybuffer",
          }
        );

      fs.writeFileSync(
        temporaryFilePath,
        response.data
      );

      // -----------------------------------------
      // 7. Run Gemini extraction
      // -----------------------------------------

      console.log(
        `Retrying Gemini extraction for document: ${document._id}`
      );

      const extractedData =
        await extractDocumentData(
          temporaryFilePath
        );

      console.log(
        "Retry extraction result:",
        extractedData
      );

      // -----------------------------------------
      // 8. Save extracted data
      // -----------------------------------------

      document.extractedData =
        extractedData || {};

      document.extractionStatus =
        "COMPLETED";

      // -----------------------------------------
      // 9. Save expiry date
      // -----------------------------------------

      if (
        extractedData?.expiryDate
      ) {
        const expiryDate =
          new Date(
            extractedData.expiryDate
          );

        if (
          !isNaN(
            expiryDate.getTime()
          )
        ) {
          document.expiryDate =
            expiryDate;
        }
      }

      await document.save();

      // -----------------------------------------
      // 10. Create audit log
      // -----------------------------------------

      try {
        await createAuditLog({
          organizationId,

          actorType: "VENDOR",

          performedByVendor:
            req.user.userId,

          action:
            "DOCUMENT_EXTRACTION_RETRIED",

          targetType:
            "Document",

          targetId:
            document._id,

          description:
            `Document extraction was retried successfully for "${document.originalFileName}"`,

          metadata: {
            documentTypeId:
              document.documentTypeId,

            vendorId:
              document.vendorId,

            extractionStatus:
              document.extractionStatus,

            expiryDate:
              document.expiryDate,
          },
        });
      } catch (auditError) {
        console.error(
          "Failed to create extraction retry audit log:",
          auditError.message
        );
      }

      // -----------------------------------------
      // 11. Delete temporary file
      // -----------------------------------------

      if (temporaryFilePath) {
        fs.unlink(
          temporaryFilePath,
          (err) => {
            if (err) {
              console.error(
                "Failed to delete temporary file:",
                err.message
              );
            }
          }
        );
      }

      temporaryFilePath = null;

      // -----------------------------------------
      // 12. Response
      // -----------------------------------------

      return res.status(200).json({
        success: true,

        message:
          "Document details extracted successfully",

        document: {
          id:
            document._id,

          extractionStatus:
            document.extractionStatus,

          extractedData:
            document.extractedData,

          expiryDate:
            document.expiryDate,

          status:
            document.status,

          version:
            document.version,
        },
      });
    } catch (error) {
      console.error(
        "Retry document extraction error:",
        error
      );

      // -----------------------------------------
      // Mark extraction as failed
      // -----------------------------------------

      if (req.params.id) {
        try {
          await VendorDocument.findOneAndUpdate(
            {
              _id: req.params.id,

              organizationId:
                req.user.organizationId,
            },
            {
              extractionStatus:
                "FAILED",
            }
          );
        } catch (updateError) {
          console.error(
            "Failed to update extraction status:",
            updateError.message
          );
        }
      }

      // -----------------------------------------
      // Delete temporary file
      // -----------------------------------------

      if (temporaryFilePath) {
        fs.unlink(
          temporaryFilePath,
          (err) => {
            if (err) {
              console.error(
                "Failed to delete temporary file:",
                err.message
              );
            }
          }
        );
      }

      return res.status(500).json({
        success: false,

        message:
          "Document extraction failed. Please try again.",

        error:
          error.message,
      });
    }
  };

// =====================================================
// Exports
// =====================================================

module.exports = {
  uploadVendorDocument,
  getPendingReviewDocuments,
  getDocumentForReview,
  reviewDocument,
  getAllDocuments,
  retryDocumentExtraction,
  getExpiryTracker,
};