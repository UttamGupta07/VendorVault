 const bcrypt = require("bcryptjs");
 const crypto = require("crypto");
const Organization = require("../models/Organization");
const User = require("../models/User");
const Vendor = require("../models/Vendor");
const generateToken = require("../utills/generatetoken");
const setAuthCookie = require("../utills/setAuthCookie");

const {
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail,
} = require("../services/ForgetEmailService");

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



const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Validate required fields
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      });
    }

    // Prevent using the same password
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from old password",
      });
    }

    // Find the currently logged-in user
    const user = await User.findById(req.user.userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify old password
    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Hash the new password before saving
    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Update profile of the currently logged-in user
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    // Check whether another user already has this email
    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: user._id },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    user.name = name.trim();
    user.email = normalizedEmail;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Update organization of the currently logged-in user
const updateOrganization = async (req, res) => {
  try {
    const {
      name,
      officialEmail,
      phone,
      industry,
      companySize,
      country,
      state,
      city,
      website,
    } = req.body;

    if (
      !name ||
      !officialEmail ||
      !phone ||
      !industry ||
      !companySize ||
      !country ||
      !state ||
      !city
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required organization fields",
      });
    }

    const normalizedOfficialEmail = officialEmail.toLowerCase().trim();

    // Get organization only through the logged-in user's organizationId
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    const organization = await Organization.findById(
      user.organizationId
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    if (!organization.isActive) {
      return res.status(403).json({
        success: false,
        message: "Organization account is inactive",
      });
    }

    // Check official email against other organizations
    const existingOrganization = await Organization.findOne({
      officialEmail: normalizedOfficialEmail,
      _id: { $ne: organization._id },
    });

    if (existingOrganization) {
      return res.status(409).json({
        success: false,
        message: "Organization with this official email already exists",
      });
    }

    organization.name = name.trim();
    organization.officialEmail = normalizedOfficialEmail;
    organization.phone = phone.trim();
    organization.industry = industry.trim();
    organization.companySize = companySize;
    organization.country = country.trim();
    organization.state = state.trim();
    organization.city = city.trim();
    organization.website = website ? website.trim() : "";

    await organization.save();

    return res.status(200).json({
      success: true,
      message: "Organization updated successfully",
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
    console.error("Update organization error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    console.log("🔥 FORGOT PASSWORD CONTROLLER HIT");

    const { email } = req.body;

    console.log("📧 Email received:", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // ==========================================
    // 1. CHECK USER COLLECTION
    // ==========================================

    let account = await User.findOne({
      email: normalizedEmail,
    });

    let accountType = "USER";

    console.log(
      "👤 User found:",
      account ? account.email : "NO USER"
    );

    // ==========================================
    // 2. IF USER NOT FOUND, CHECK VENDOR
    // ==========================================

    if (!account) {
      account = await Vendor.findOne({
        email: normalizedEmail,
      }).select("+password");

      accountType = "VENDOR";

      console.log(
        "🏢 Vendor found:",
        account ? account.email : "NO VENDOR"
      );
    }

    // ==========================================
    // 3. NO ACCOUNT FOUND
    // ==========================================

    if (!account) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    console.log(
      `✅ Account found: ${account.email} (${accountType})`
    );

    // ==========================================
    // 4. GENERATE RESET TOKEN
    // ==========================================

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    account.resetPasswordToken = hashedToken;

    account.resetPasswordExpires =
      Date.now() + 15 * 60 * 1000;

    await account.save({
      validateBeforeSave: false,
    });

    console.log("🔐 Reset token saved");

    // ==========================================
    // 5. CREATE RESET URL
    // ==========================================

    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    console.log("🔗 Reset URL:", resetUrl);

    // ==========================================
    // 6. SEND EMAIL
    // ==========================================

    console.log(
      "📨 Calling sendPasswordResetEmail..."
    );

    await sendPasswordResetEmail(
      account.email,
      account.name,
      resetUrl
    );

    console.log(
      "✅ sendPasswordResetEmail completed"
    );

    // ==========================================
    // 7. RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error(
      "❌ Forgot password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong. Please try again later.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const {
      token,
      password,
      confirmPassword,
    } = req.body;

    console.log("🔥 RESET PASSWORD CONTROLLER HIT");

    // ==========================================
    // 1. VALIDATE INPUT
    // ==========================================

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirm password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long",
      });
    }

    // ==========================================
    // 2. HASH TOKEN
    // ==========================================

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    console.log("🔐 Token hashed");

    // ==========================================
    // 3. CHECK USER COLLECTION
    // ==========================================

    let account = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    }).select("+password");

    let accountType = "USER";

    console.log(
      "👤 User account:",
      account ? account.email : "NOT FOUND"
    );

    // ==========================================
    // 4. IF USER NOT FOUND, CHECK VENDOR
    // ==========================================

    if (!account) {
      account = await Vendor.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          $gt: Date.now(),
        },
      }).select("+password");

      accountType = "VENDOR";

      console.log(
        "🏢 Vendor account:",
        account ? account.email : "NOT FOUND"
      );
    }

    // ==========================================
    // 5. TOKEN INVALID / EXPIRED
    // ==========================================

    if (!account) {
      return res.status(400).json({
        success: false,
        message:
          "Reset link is invalid or has expired",
      });
    }

    console.log(
      `✅ Reset account found: ${account.email} (${accountType})`
    );

    // ==========================================
    // 6. HASH NEW PASSWORD
    // ==========================================

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    account.password = hashedPassword;

    // ==========================================
    // 7. CLEAR RESET TOKEN
    // ==========================================

    account.resetPasswordToken = null;
    account.resetPasswordExpires = null;

    await account.save();

    console.log("🔑 Password updated successfully");

    // ==========================================
    // 8. SEND CONFIRMATION EMAIL
    // ==========================================

    try {
      await sendPasswordResetConfirmationEmail(
        account.email,
        account.name
      );

      console.log(
        "📨 Password confirmation email sent"
      );
    } catch (emailError) {
      console.error(
        "⚠️ Confirmation email error:",
        emailError
      );
    }

    // ==========================================
    // 9. SUCCESS RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(
      "❌ Reset password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong. Please try again later.",
    });
  }
};


module.exports = {
  registerOrganization,
  loginUser,
  getMe,
  logoutUser,
  changePassword,
  updateProfile,
  updateOrganization,
  forgotPassword,
  resetPassword,
};