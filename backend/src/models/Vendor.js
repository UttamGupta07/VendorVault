const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
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

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["VENDOR"],
      default: "VENDOR",
      immutable: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    // Service provided by the vendor
    serviceTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceType",
      required: true,
      index: true,
    },

    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "active",
        "suspended",
        "inactive",
      ],
      default: "pending",
    },

    complianceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // Compliance Officer / Super Admin who created the vendor
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate vendor email inside the same organization
vendorSchema.index({
  organizationId: 1,
  email: 1,
});

// Useful for filtering vendors by status
vendorSchema.index({
  organizationId: 1,
  status: 1,
});

// Useful for filtering vendors by service type
vendorSchema.index({
  organizationId: 1,
  serviceTypeId: 1,
});

module.exports = mongoose.model("Vendor", vendorSchema);