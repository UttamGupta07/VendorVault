const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const createComplianceOfficer = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const organizationId = req.user.organizationId;

    // Only Super Admin
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only Super Admin can create Compliance Officers",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      organizationId,
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      organizationId,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "COMPLIANCE_OFFICER",
    });

    return res.status(201).json({
      success: true,
      message: "Compliance Officer created successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create Compliance Officer",
    });
  }
};

module.exports = {
  createComplianceOfficer,
};