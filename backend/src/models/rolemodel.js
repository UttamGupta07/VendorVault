const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    name: {
      type: String,
      enum: [
        "SUPER_ADMIN",
        "COMPLIANCE_OFFICER",
        "AUDITOR",
        "VENDOR",
      ],
      required: true,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    permissions: {
      type: [String],
      default: [],
    },

    isSystemRole: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// One role configuration per organization
roleSchema.index(
  {
    organizationId: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Role", roleSchema);