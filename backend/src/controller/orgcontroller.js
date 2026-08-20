// controllers/auth.controller.js

const bcrypt = require("bcryptjs");
const Organization = require("../model/orgmodel");
const User = require("../model/usermodel");

const registerOrganization = async (req, res) => {
  try {
    const {
      organizationName,
      officialEmail,
      phone,
      industry,
      companySize,
      country,
      state,
      city,
      website,

      adminName,
      adminEmail,
      password,
    } = req.body;

    if (
      !organizationName ||
      !officialEmail ||
      !phone ||
      !industry ||
      !companySize ||
      !country ||
      !state ||
      !city ||
      !adminName ||
      !adminEmail ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    // 2. Check whether admin email already exists
    const existingUser = await User.findOne({
      email: adminEmail.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // 3. Create organization
    const organization = await Organization.create({
      name: organizationName,
      officialEmail,
      phone,
      industry,
      companySize,
      country,
      state,
      city,
      website,
    });

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Create Super Admin automatically
    const admin = await User.create({
      organizationId: organization._id,
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isEmailVerified: false,
    });

    return res.status(201).json({
      success: true,
      message: "Organization registered successfully",
      data: {
        organization: {
          id: organization._id,
          name: organization.name,
        },

        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to register organization",
    });
  }
};



module.exports = {registerOrganization};