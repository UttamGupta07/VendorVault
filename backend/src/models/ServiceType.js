const mongoose = require("mongoose");

const serviceTypeSchema = new mongoose.Schema(
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

    // Documents required for this service
    requiredDocuments: [
      {
        documentTypeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "DocumentType",
          required: true,
        },

        // Whether this document is mandatory
        isRequired: {
          type: Boolean,
          default: true,
        },

        // Whether this document must have an expiry date
        expiryRequired: {
          type: Boolean,
          default: false,
        },

        // Days before expiry when reminders should be sent
        reminderDays: {
          type: [Number],
          default: [30, 15, 7],
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Same service type name should not be duplicated
// inside the same organization
serviceTypeSchema.index(
  { organizationId: 1, name: 1 },
  { unique: true }
);

module.exports = mongoose.model("ServiceType", serviceTypeSchema);