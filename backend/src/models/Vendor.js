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

    phone: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
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

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

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

vendorSchema.index({
  organizationId: 1,
  email: 1,
});

vendorSchema.index({
  organizationId: 1,
  status: 1,
});

module.exports = mongoose.model("Vendor", vendorSchema);