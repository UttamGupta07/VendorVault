// const uploadDocument = async (req, res) => {
//   try {
//     // Check whether file was uploaded
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "PDF document is required",
//       });
//     }

//     console.log("File received:");
//     console.log(req.file);

//     return res.status(200).json({
//       success: true,
//       message: "PDF uploaded temporarily",
//       file: {
//         originalName: req.file.originalname,
//         filename: req.file.filename,
//         path: req.file.path,
//         size: req.file.size,
//         mimetype: req.file.mimetype,
//       },
//     });
//   } catch (error) {
//     console.error("Document upload error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to upload document",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   uploadDocument,
// };

const cloudinary = require("../config/cloudinary");

const uploadDocument = async (req, res) => {
  try {
    // 1. Check file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF document is required",
      });
    }

    console.log("File received:");
    console.log(req.file);

    // 2. Upload temporary file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
      folder: "vendorvault/documents",
    });

    console.log("Cloudinary upload successful:");
    console.log({
      publicId: result.public_id,
      secureUrl: result.secure_url,
      resourceType: result.resource_type,
      format: result.format,
    });

    // 3. Return Cloudinary information
    return res.status(200).json({
      success: true,
      message: "Document uploaded successfully",

      file: {
        originalName: req.file.originalname,
        size: req.file.size,

        cloudinaryUrl: result.secure_url,
        cloudinaryPublicId: result.public_id,
      },
    });
  } catch (error) {
    console.error("Document upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload document",
      error: error.message,
    });
  }
};

module.exports = {
  uploadDocument,
};