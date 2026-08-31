const mongoose = require("mongoose");

const documentTypeSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Whether this document type is currently available
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Same document type name should not be duplicated
// inside the same organization
documentTypeSchema.index(
  { organizationId: 1, name: 1 },
  { unique: true }
);

module.exports = mongoose.model("DocumentType", documentTypeSchema);