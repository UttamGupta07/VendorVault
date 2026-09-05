 const bcrypt = require("bcryptjs");
const Organization = require("../models/Organization");
const User = require("../models/User");
const seedDefaultRoles = require("../utills/seedRoles");
const Vendor = require("../models/Vendor");
const generateToken = require("../utills/generatetoken");
const setAuthCookie = require("../utills/setAuthCookie");
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

    // -----------------------------
    // 1. Validate required fields
    // -----------------------------
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
        message: "Please provide all required fields",
      });
    }

    // Normalize emails
    const normalizedOfficialEmail = officialEmail.toLowerCase().trim();
    const normalizedAdminEmail = adminEmail.toLowerCase().trim();

    // -----------------------------
    // 2. Check existing organization
    // -----------------------------
    const existingOrganization = await Organization.findOne({
      officialEmail: normalizedOfficialEmail,
    });

    if (existingOrganization) {
      return res.status(409).json({
        success: false,
        message: "Organization with this official email already exists",
      });
    }

    // -----------------------------
    // 3. Check existing user
    // -----------------------------
    const existingUser = await User.findOne({
      email: normalizedAdminEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // -----------------------------
    // 4. Create organization
    // -----------------------------
    const organization = await Organization.create({
      name: organizationName,
      officialEmail: normalizedOfficialEmail,
      phone,
      industry,
      companySize,
      country,
      state,
      city,
      website,
    });

    await seedDefaultRoles(organization._id);
    // -----------------------------
    // 5. Hash password
    // -----------------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // -----------------------------
    // 6. Create SUPER_ADMIN user
    // -----------------------------
    const admin = await User.create({
      organizationId: organization._id,
      name: adminName,
      email: normalizedAdminEmail,
      password: hashedPassword,
      role: "SUPER_ADMIN",
    });

    // -----------------------------
    // 7. Generate JWT
    // -----------------------------
    const token = generateToken(admin);

    // -----------------------------
    // 8. Store JWT in cookie
    // -----------------------------
    setAuthCookie(res, token);

    // -----------------------------
    // 9. Send response
    // -----------------------------
    return res.status(201).json({
      success: true,
      message: "Organization registered successfully",

      organization: {
        id: organization._id,
        name: organization.name,
        officialEmail: organization.officialEmail,
        phone: organization.phone,
        industry: organization.industry,
        companySize: organization.companySize,
        country: organization.country,
        state: organization.state,
        city: organization.city,
        website: organization.website,
        isActive: organization.isActive,
      },

      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        organizationId: admin.organizationId,
        isActive: admin.isActive,
        isEmailVerified: admin.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Organization registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};




//  const loginUser = async (req, res) => {
//   // console.log(req.body);
  
//   try {
//     const { email, password } = req.body;

//     // ----------------------------------------
//     // 1. Validate fields
//     // ----------------------------------------

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     // ----------------------------------------
//     // 2. Normalize email
//     // ----------------------------------------

//     const normalizedEmail = email.toLowerCase().trim();

//     // ----------------------------------------
//     // 3. Find user
//     // IMPORTANT:
//     // password has select:false in User schema
//     // so explicitly select it here
//     // ----------------------------------------

//     const user = await User.findOne({
//       email: normalizedEmail,
//     }).select("+password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     // ----------------------------------------
//     // 4. Check user status
//     // ----------------------------------------

//     if (!user.isActive) {
//       return res.status(403).json({
//         success: false,
//         message: "Your account is inactive",
//       });
//     }

//     // ----------------------------------------
//     // 5. Check password
//     // ----------------------------------------

//     const isPasswordValid = await bcrypt.compare(
//       password,
//       user.password
//     );

//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     // ----------------------------------------
//     // 6. Find organization
//     // ----------------------------------------

//     const organization = await Organization.findById(
//       user.organizationId
//     );

//     if (!organization) {
//       return res.status(404).json({
//         success: false,
//         message: "Organization not found",
//       });
//     }

//     // ----------------------------------------
//     // 7. Check organization status
//     // Your Organization schema uses isActive
//     // ----------------------------------------

//     if (!organization.isActive) {
//       return res.status(403).json({
//         success: false,
//         message: "Organization account is inactive",
//       });
//     }

//     // ----------------------------------------
//     // 8. Update last login
//     // ----------------------------------------

//     user.lastLoginAt = new Date();
//     await user.save();

//     // ----------------------------------------
//     // 9. Generate JWT
//     // ----------------------------------------

//     const token = generateToken(user);

//     // ----------------------------------------
//     // 10. Store JWT in HTTP-only cookie
//     // ----------------------------------------

//     setAuthCookie(res, token);

//     // ----------------------------------------
//     // 11. Send response
//     // ----------------------------------------

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
   
//       user: { 
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         organizationId: user.organizationId,
//         isActive: user.isActive,
//         isEmailVerified: user.isEmailVerified,
//       },

//       organization: {
//         id: organization._id,
//         name: organization.name,
//         officialEmail: organization.officialEmail,
//         phone: organization.phone,
//         industry: organization.industry,
//         companySize: organization.companySize,
//         country: organization.country,
//         state: organization.state,
//         city: organization.city,
//         website: organization.website,
//         isActive: organization.isActive,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };


 

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ==========================================
    // 1. CHECK USER
    // ==========================================

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (user) {
      // Check user status
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Your account is inactive",
        });
      }

      // Check password
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate token
      const token = generateToken(user);

      // Set cookie
      setAuthCookie(res, token);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        type: "USER",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId,
        },
      });
    }

    // ==========================================
    // 2. CHECK VENDOR
    // ==========================================

    const vendor = await Vendor.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (vendor) {
      // Check vendor status
      if (
        vendor.status === "suspended" ||
        vendor.status === "inactive"
      ) {
        return res.status(403).json({
          success: false,
          message: "Your vendor account is inactive",
        });
      }

      // Check password
      const isPasswordCorrect = await bcrypt.compare(
        password,
        vendor.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate token
      const token = generateToken(vendor);

      // Set cookie
      setAuthCookie(res, token);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        type: "VENDOR",
        user: {
          id: vendor._id,
          name: vendor.name,
          companyName: vendor.companyName,
          email: vendor.email,
          phone: vendor.phone,
          role: vendor.role,
          organizationId: vendor.organizationId,
          serviceTypeId: vendor.serviceTypeId,
          address: vendor.address,
          status: vendor.status,
          complianceScore: vendor.complianceScore,
        },
      });
    }

    // ==========================================
    // 3. EMAIL NOT FOUND
    // ==========================================

    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};





 const getMe = async (req, res) => {
  try {
    // Prevent caching of authentication data
    res.set("Cache-Control", "no-store");

    // JWT contains userId
    const user = await User.findById(req.user.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check user status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    // Find organization
    const organization = await Organization.findById(
      user.organizationId
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // Check organization status
    if (!organization.isActive) {
      return res.status(403).json({
        success: false,
        message: "Organization account is inactive",
      });
    }

    return res.status(200).json({
      success: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: user.lastLoginAt,
      },

      organization: {
        id: organization._id,
        name: organization.name,
        officialEmail: organization.officialEmail,
        phone: organization.phone,
        industry: organization.industry,
        companySize: organization.companySize,
        country: organization.country,
        state: organization.state,
        city: organization.city,
        website: organization.website,
        isActive: organization.isActive,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  registerOrganization,
  loginUser,
  getMe,
  logoutUser,
};