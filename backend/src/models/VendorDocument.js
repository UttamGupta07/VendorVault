const mongoose = require("mongoose");

const vendorDocumentSchema = new mongoose.Schema(
  {
    // --------------------------------------------------
    // Vendor who uploaded the document
    // --------------------------------------------------
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    // --------------------------------------------------
    // Organization the vendor belongs to
    // --------------------------------------------------
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    // --------------------------------------------------
    // Service type
    // Example: IT Services, Security Services, etc.
    // --------------------------------------------------
    serviceTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceType",
      required: true,
    },

    // --------------------------------------------------
    // Document type
    // Example: GST Certificate, Insurance, NDA
    // --------------------------------------------------
    documentTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocumentType",
      required: true,
    },

    // --------------------------------------------------
    // File information
    // --------------------------------------------------
    originalFileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      default: null,
    },

    fileSize: {
      type: Number,
      default: null,
    },

    // --------------------------------------------------
    // Gemini extraction status
    // --------------------------------------------------
    extractionStatus: {
      type: String,
      enum: [
        "PENDING",
        "PROCESSING",
        "COMPLETED",
        "FAILED",
      ],
      default: "PENDING",
    },

    // --------------------------------------------------
    // Data extracted by Gemini
    //
    // Different document types have different fields,
    // therefore Mixed is used here.
    // --------------------------------------------------
    extractedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // --------------------------------------------------
    // Common compliance field
    // This allows expiry reminders to work without
    // knowing the document-specific field structure.
    // --------------------------------------------------
    expiryDate: {
      type: Date,
      default: null,
      index: true,
    },

    // --------------------------------------------------
    // Compliance review
    // --------------------------------------------------
    status: {
      type: String,
      enum: [
        "PENDING_REVIEW",
        "APPROVED",
        "REJECTED",
      ],
      default: "PENDING_REVIEW",
      index: true,
    },

    // --------------------------------------------------
    // Review information
    // --------------------------------------------------
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      default: null,
      trim: true,
    },

    // --------------------------------------------------
    // Version information
    // --------------------------------------------------
    version: {
      type: Number,
      default: 1,
    },

    previousVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorDocument",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


// --------------------------------------------------
// Useful compound indexes
// --------------------------------------------------

vendorDocumentSchema.index({
  vendorId: 1,
  documentTypeId: 1,
});

vendorDocumentSchema.index({
  organizationId: 1,
  status: 1,
});

vendorDocumentSchema.index({
  organizationId: 1,
  expiryDate: 1,
});


module.exports = mongoose.model(
  "VendorDocument",
  vendorDocumentSchema
);
