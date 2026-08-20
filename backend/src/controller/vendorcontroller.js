const Vendor = require("../model/vendormodel");
const User = require("../model/usermodel");
const bcrypt = require("bcryptjs");

const createVendor = async (req, res) => {
  try {
    const {
      name,
      contactPerson,
      email,
      phone,
      address,
      gstin,
      pan,
    } = req.body;

    const organizationId = req.user.organizationId;

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({
      organizationId,
      email: email.toLowerCase(),
    });

    if (existingVendor) {
      return res.status(409).json({
        success: false,
        message: "Vendor already exists",
      });
    }

    // Temporary password for MVP
    const hashedPassword = await bcrypt.hash("TEMP_PASSWORD", 12);

    // Create vendor login user
    const vendorUser = await User.create({
      organizationId,
      name: contactPerson,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "VENDOR",
    });

    // Create vendor business entity
    const vendor = await Vendor.create({
      organizationId,
      name,
      contactPerson,
      email: email.toLowerCase(),
      phone,
      address,
      gstin,
      pan,
      status: "INVITED",
      createdBy: req.user._id,
      userId: vendorUser._id,
    });

    return res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      data: {
        vendor,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create vendor",
    });
  }
};

module.exports = {
  createVendor,
};