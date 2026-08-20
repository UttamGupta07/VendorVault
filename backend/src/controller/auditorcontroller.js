const createAuditor = async (req, res) => {
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only Super Admin can create Auditors",
      });
    }

    const {
      name,
      email,
      password,
    } = req.body;

    const organizationId = req.user.organizationId;

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

    const auditor = await User.create({
      organizationId,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "AUDITOR",
    });

    return res.status(201).json({
      success: true,
      message: "Auditor created successfully",
      data: {
        id: auditor._id,
        name: auditor.name,
        email: auditor.email,
        role: auditor.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create Auditor",
    });
  }
};