const ServiceType = require("../models/ServiceType");
const DocumentType = require("../models/DocumentType");

// =====================================================
// CREATE SERVICE TYPE
// SUPER ADMIN ONLY
// =====================================================

const createServiceType = async (req, res) => {
  try {
    const {
      name,
      description,
      requiredDocuments = [],
    } = req.body;

    const organizationId = req.user.organizationId;

    // Check role
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only Super Admin can create service types",
      });
    }

    // Validate name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Service type name is required",
      });
    }

    // Check duplicate service type
    const existingServiceType = await ServiceType.findOne({
      organizationId,
      name: name.trim(),
    });

    if (existingServiceType) {
      return res.status(409).json({
        success: false,
        message: "Service type already exists",
      });
    }

    // Validate requiredDocuments
    if (!Array.isArray(requiredDocuments)) {
      return res.status(400).json({
        success: false,
        message: "requiredDocuments must be an array",
      });
    }

    // Extract document IDs
    const documentIds = requiredDocuments.map(
      (doc) => doc.documentTypeId
    );

    // Check duplicate document IDs
    const uniqueDocumentIds = [
      ...new Set(documentIds.map((id) => id.toString())),
    ];

    if (uniqueDocumentIds.length !== documentIds.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate documents are not allowed",
      });
    }

    // Verify all documents belong to this organization
    if (documentIds.length > 0) {
      const documents = await DocumentType.find({
        _id: { $in: documentIds },
        organizationId,
        isActive: true,
      });

      if (documents.length !== documentIds.length) {
        return res.status(400).json({
          success: false,
          message:
            "One or more selected document types are invalid or inactive",
        });
      }
    }

    const serviceType = await ServiceType.create({
      organizationId,
      name: name.trim(),
      description: description?.trim() || "",
      requiredDocuments,
    });

    // Populate documents before sending response
    await serviceType.populate(
      "requiredDocuments.documentTypeId"
    );

    return res.status(201).json({
      success: true,
      message: "Service type created successfully",
      serviceType,
    });
  } catch (error) {
    console.error("Create service type error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create service type",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL SERVICE TYPES
// SUPER ADMIN ONLY
// =====================================================

const getServiceTypes = async (req, res) => {
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only Super Admin can access service types",
      });
    }

    const organizationId = req.user.organizationId;

    const serviceTypes = await ServiceType.find({
      organizationId,
    })
      .populate(
        "requiredDocuments.documentTypeId",
        "name description isActive"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: serviceTypes.length,
      serviceTypes,
    });
  } catch (error) {
    console.error("Get service types error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch service types",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE SERVICE TYPE
// SUPER ADMIN ONLY
// =====================================================

const getServiceTypeById = async (req, res) => {
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only Super Admin can access service types",
      });
    }

    const organizationId = req.user.organizationId;

    const serviceType = await ServiceType.findOne({
      _id: req.params.id,
      organizationId,
    }).populate(
      "requiredDocuments.documentTypeId",
      "name description isActive"
    );

    if (!serviceType) {
      return res.status(404).json({
        success: false,
        message: "Service type not found",
      });
    }

    return res.status(200).json({
      success: true,
      serviceType,
    });
  } catch (error) {
    console.error("Get service type error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch service type",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE SERVICE TYPE
// SUPER ADMIN ONLY
// =====================================================

const updateServiceType = async (req, res) => {
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only Super Admin can update service types",
      });
    }

    const organizationId = req.user.organizationId;

    const {
      name,
      description,
      requiredDocuments,
      isActive,
    } = req.body;

    const serviceType = await ServiceType.findOne({
      _id: req.params.id,
      organizationId,
    });

    if (!serviceType) {
      return res.status(404).json({
        success: false,
        message: "Service type not found",
      });
    }

    // -----------------------------------------
    // Update name
    // -----------------------------------------

    if (name && name.trim() !== serviceType.name) {
      const duplicate = await ServiceType.findOne({
        organizationId,
        name: name.trim(),
        _id: { $ne: req.params.id },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "Another service type with this name already exists",
        });
      }

      serviceType.name = name.trim();
    }

    // -----------------------------------------
    // Update description
    // -----------------------------------------

    if (description !== undefined) {
      serviceType.description = description.trim();
    }

    // -----------------------------------------
    // Update required documents
    // -----------------------------------------

    if (requiredDocuments !== undefined) {
      if (!Array.isArray(requiredDocuments)) {
        return res.status(400).json({
          success: false,
          message: "requiredDocuments must be an array",
        });
      }

      const documentIds = requiredDocuments.map(
        (doc) => doc.documentTypeId
      );

      // Check duplicates
      const uniqueDocumentIds = [
        ...new Set(documentIds.map((id) => id.toString())),
      ];

      if (uniqueDocumentIds.length !== documentIds.length) {
        return res.status(400).json({
          success: false,
          message: "Duplicate documents are not allowed",
        });
      }

      // Verify documents belong to organization
      if (documentIds.length > 0) {
        const documents = await DocumentType.find({
          _id: { $in: documentIds },
          organizationId,
          isActive: true,
        });

        if (documents.length !== documentIds.length) {
          return res.status(400).json({
            success: false,
            message:
              "One or more selected document types are invalid or inactive",
          });
        }
      }

      serviceType.requiredDocuments = requiredDocuments;
    }

    // -----------------------------------------
    // Update active status
    // -----------------------------------------

    if (isActive !== undefined) {
      serviceType.isActive = isActive;
    }

    await serviceType.save();

    await serviceType.populate(
      "requiredDocuments.documentTypeId"
    );

    return res.status(200).json({
      success: true,
      message: "Service type updated successfully",
      serviceType,
    });
  } catch (error) {
    console.error("Update service type error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update service type",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE SERVICE TYPE
// SUPER ADMIN ONLY
// =====================================================

const deleteServiceType = async (req, res) => {
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only Super Admin can delete service types",
      });
    }

    const organizationId = req.user.organizationId;

    const serviceType = await ServiceType.findOne({
      _id: req.params.id,
      organizationId,
    });

    if (!serviceType) {
      return res.status(404).json({
        success: false,
        message: "Service type not found",
      });
    }

    await ServiceType.deleteOne({
      _id: serviceType._id,
    });

    return res.status(200).json({
      success: true,
      message: "Service type deleted successfully",
    });
  } catch (error) {
    console.error("Delete service type error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete service type",
      error: error.message,
    });
  }
};

module.exports = {
  createServiceType,
  getServiceTypes,
  getServiceTypeById,
  updateServiceType,
  deleteServiceType,
};