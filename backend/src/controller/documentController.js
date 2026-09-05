 const fs = require("fs");

const cloudinary = require("../config/cloudinary");
const VendorDocument = require("../models/VendorDocument");
const {
  extractDocumentData,
} = require("../services/geminiExtractionServices");

const uploadVendorDocument = async (req, res) => {
  let uploadedFilePath = null;
  let document = null;

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
        message: "serviceTypeId and documentTypeId are required",
      });
    }

    // -----------------------------------------
    // 3. Get vendor information
    // -----------------------------------------

    const vendorId = req.user.userId;
    const organizationId = req.user.organizationId;

    // -----------------------------------------
    // 4. Upload file to Cloudinary
    // -----------------------------------------

    const cloudinaryResult = await cloudinary.uploader.upload(
      uploadedFilePath,
      {
        folder: `vendorvault/${organizationId}/documents`,
        resource_type: "raw",
      }
    );

    // -----------------------------------------
    // 5. Save document in MongoDB
    // -----------------------------------------

    document = await VendorDocument.create({
      vendorId,
      organizationId,
      serviceTypeId,
      documentTypeId,

      originalFileName: req.file.originalname,

      fileUrl: cloudinaryResult.secure_url,

      cloudinaryPublicId: cloudinaryResult.public_id,

      mimeType: req.file.mimetype,

      fileSize: req.file.size,

      // Extraction has not started yet
      extractionStatus: "PROCESSING",

      extractedData: {},

      status: "PENDING_REVIEW",

      version: 1,
    });

    // -----------------------------------------
    // 6. Extract data using Gemini
    // -----------------------------------------

    console.log(
      `Starting Gemini extraction for document: ${document._id}`
    );

    try {
      const extractedData = await extractDocumentData(
        uploadedFilePath
      );

      console.log("Extracted data:");
      console.log(extractedData);

      // -----------------------------------------
      // 7. Save extracted data
      // -----------------------------------------

      document.extractedData = extractedData;

      document.extractionStatus = "COMPLETED";

      // -----------------------------------------
      // 8. Save common expiryDate separately
      // -----------------------------------------

      if (extractedData.expiryDate) {
        const expiryDate = new Date(
          extractedData.expiryDate
        );

        if (!isNaN(expiryDate.getTime())) {
          document.expiryDate = expiryDate;
        }
      }

      await document.save();

      console.log(
        `Gemini extraction completed for document: ${document._id}`
      );

    } catch (extractionError) {
      console.error(
        "Gemini extraction failed:",
        extractionError
      );

      // -----------------------------------------
      // Extraction failed
      // -----------------------------------------

      document.extractionStatus = "FAILED";

      await document.save();
    }

    // -----------------------------------------
    // 9. Delete temporary local file
    // -----------------------------------------

    fs.unlink(uploadedFilePath, (err) => {
      if (err) {
        console.error(
          "Failed to delete temporary file:",
          err.message
        );
      }
    });

    uploadedFilePath = null;

    // -----------------------------------------
    // 10. Send response
    // -----------------------------------------

    return res.status(201).json({
      success: true,

      message:
        document.extractionStatus === "COMPLETED"
          ? "Document uploaded and data extracted successfully"
          : "Document uploaded successfully but data extraction failed",

      document: {
        id: document._id,

        fileName: document.originalFileName,

        fileUrl: document.fileUrl,

        mimeType: document.mimeType,

        fileSize: document.fileSize,

        extractionStatus:
          document.extractionStatus,

        extractedData:
          document.extractedData,

        expiryDate:
          document.expiryDate,

        status: document.status,

        createdAt: document.createdAt,
      },
    });

  } catch (error) {
    console.error(
      "Upload vendor document error:",
      error
    );

    // -----------------------------------------
    // Delete temporary file if something failed
    // -----------------------------------------

    if (uploadedFilePath) {
      fs.unlink(uploadedFilePath, (err) => {
        if (err) {
          console.error(
            "Failed to delete temporary file:",
            err.message
          );
        }
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload document",
      error: error.message,
    });
  }
};

const getPendingReviewDocuments = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    const documents = await VendorDocument.find({
      organizationId,
      extractionStatus: "COMPLETED",
      status: "PENDING_REVIEW",
    })
      .populate("vendorId", "name email companyName")
      .populate("documentTypeId", "name")
      .populate("serviceTypeId", "name")
      .sort({ createdAt: -1 });

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

// Get single document for Compliance Officer review
const getDocumentForReview = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    const document = await VendorDocument.findOne({
      _id: id,
      organizationId,
    })
      .populate("vendorId", "name email")
      .populate("documentTypeId", "name description")
      .populate("serviceTypeId", "name description");

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


// Approve or reject document
const reviewDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body;

    const organizationId = req.user.organizationId;
    const complianceOfficerId = req.user.userId;

    // -----------------------------------------
    // Validate action
    // -----------------------------------------

    if (!action) {
      return res.status(400).json({
        success: false,
        message: "Review action is required",
      });
    }

    if (!["APPROVE", "REJECT"].includes(action)) {
      return res.status(400).json({
        success: false,
        message:
          "Action must be either APPROVE or REJECT",
      });
    }

    // -----------------------------------------
    // Rejection reason required
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
    // Find document
    // -----------------------------------------

    const document = await VendorDocument.findOne({
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
    // Make sure extraction is completed
    // -----------------------------------------

    if (document.extractionStatus !== "COMPLETED") {
      return res.status(400).json({
        success: false,
        message:
          "Document cannot be reviewed until extraction is completed",
      });
    }

    // -----------------------------------------
    // Approve
    // -----------------------------------------

    if (action === "APPROVE") {
      document.status = "APPROVED";
      document.rejectionReason = null;
    }

    // -----------------------------------------
    // Reject
    // -----------------------------------------

    if (action === "REJECT") {
      document.status = "REJECTED";
      document.rejectionReason =
        rejectionReason.trim();
    }

    // -----------------------------------------
    // Review information
    // -----------------------------------------

    document.reviewedBy = complianceOfficerId;
    document.reviewedAt = new Date();

    await document.save();

    return res.status(200).json({
      success: true,
      message:
        action === "APPROVE"
          ? "Document approved successfully"
          : "Document rejected successfully",

      document: {
        id: document._id,
        status: document.status,
        reviewedBy: document.reviewedBy,
        reviewedAt: document.reviewedAt,
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
      message: "Failed to review document",
      error: error.message,
    });
  }
};

module.exports = {
  uploadVendorDocument,
  getPendingReviewDocuments,
  getDocumentForReview,
  reviewDocument,
};