const DocumentType = require("../models/DocumentType");
const ServiceType = require("../models/ServiceType");

// =====================================================
// CREATE DOCUMENT TYPE
// SUPER ADMIN ONLY
// =====================================================

const createDocumentType = async (req, res) => {
  try {
    const { name, description } = req.body;

    const organizationId = req.user.organizationId;


    // Validate name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Document type name is required",
      });
    }

    // Check duplicate
    const existingDocument = await DocumentType.findOne({
      organizationId,
      name: name.trim(),
    });

    if (existingDocument) {
      return res.status(409).json({
        success: false,
        message: "Document type already exists",
      });
    }

    const documentType = await DocumentType.create({
      organizationId,
      name: name.trim(),
      description: description?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message: "Document type created successfully",
      documentType,
    });
  } catch (error) {
    console.error("Create document type error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create document type",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL DOCUMENT TYPES
// SUPER ADMIN ONLY
// =====================================================

const getDocumentTypes = async (req, res) => {
  try {
    

    const organizationId = req.user.organizationId;

    const documentTypes = await DocumentType.find({
      organizationId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: documentTypes.length,
      documentTypes,
    });
  } catch (error) {
    console.error("Get document types error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch document types",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE DOCUMENT TYPE
// SUPER ADMIN ONLY
// =====================================================

const getDocumentTypeById = async (req, res) => {
  try {
     

    const organizationId = req.user.organizationId;

    const documentType = await DocumentType.findOne({
      _id: req.params.id,
      organizationId,
    });

    if (!documentType) {
      return res.status(404).json({
        success: false,
        message: "Document type not found",
      });
    }

    return res.status(200).json({
      success: true,
      documentType,
    });
  } catch (error) {
    console.error("Get document type error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch document type",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE DOCUMENT TYPE
// SUPER ADMIN ONLY
// =====================================================

const updateDocumentType = async (req, res) => {
  try {
    

    const organizationId = req.user.organizationId;

    const { name, description, isActive } = req.body;

    const documentType = await DocumentType.findOne({
      _id: req.params.id,
      organizationId,
    });

    if (!documentType) {
      return res.status(404).json({
        success: false,
        message: "Document type not found",
      });
    }

    // Check duplicate name
    if (name && name.trim() !== documentType.name) {
      const duplicate = await DocumentType.findOne({
        organizationId,
        name: name.trim(),
        _id: { $ne: req.params.id },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Another document type with this name already exists",
        });
      }

      documentType.name = name.trim();
    }

    if (description !== undefined) {
      documentType.description = description.trim();
    }

    if (isActive !== undefined) {
      documentType.isActive = isActive;
    }

    await documentType.save();

    return res.status(200).json({
      success: true,
      message: "Document type updated successfully",
      documentType,
    });
  } catch (error) {
    console.error("Update document type error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update document type",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE DOCUMENT TYPE
// SUPER ADMIN ONLY
// =====================================================

const deleteDocumentType = async (req, res) => {
  try {
   
    const organizationId = req.user.organizationId;

    const documentType = await DocumentType.findOne({
      _id: req.params.id,
      organizationId,
    });

    if (!documentType) {
      return res.status(404).json({
        success: false,
        message: "Document type not found",
      });
    }

    // Check whether this document is being used
    // by any service type
    const usedByService = await ServiceType.findOne({
      organizationId,
      "requiredDocuments.documentTypeId": documentType._id,
    });

    if (usedByService) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete this document type because it is being used by a service type",
      });
    }

    await DocumentType.deleteOne({
      _id: documentType._id,
    });

    return res.status(200).json({
      success: true,
      message: "Document type deleted successfully",
    });
  } catch (error) {
    console.error("Delete document type error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete document type",
      error: error.message,
    });
  }
};

module.exports = {
  createDocumentType,
  getDocumentTypes,
  getDocumentTypeById,
  updateDocumentType,
  deleteDocumentType,
};