const { GoogleGenAI, Type } = require("@google/genai");
const fs = require("fs");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Extract structured data from a vendor document using Gemini.
 *
 * @param {Object} params
 * @param {string} params.filePath - Local path of the uploaded PDF
 * @param {string} params.documentType - Type of document
 * @param {Array<string>} params.fields - Fields to extract
 *
 * @returns {Promise<Object>} Extracted document data
 */
const extractDocumentData = async ({
  filePath,
  documentType,
  fields,
}) => {
  try {
    if (!filePath) {
      throw new Error("Document file path is required");
    }

    if (!documentType) {
      throw new Error("Document type is required");
    }

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      throw new Error("Extraction fields are required");
    }

    if (!fs.existsSync(filePath)) {
      throw new Error("Document file not found");
    }

    /*
     * Convert PDF to base64.
     *
     * Gemini supports PDF input directly.
     */
    const pdfData = fs.readFileSync(filePath).toString("base64");

    /*
     * Create dynamic JSON schema.
     *
     * Example:
     *
     * {
     *   policyNumber: string | null,
     *   provider: string | null,
     *   issueDate: string | null,
     *   expiryDate: string | null
     * }
     */
    const properties = {};

    fields.forEach((field) => {
      properties[field] = {
        type: Type.STRING,
        nullable: true,
        description: `Extract the ${field} from the document. Return null if it is not present.`,
      };
    });

    const prompt = `
You are an intelligent document extraction system for VendorVault,
a B2B vendor compliance management platform.

Analyze the uploaded document carefully.

DOCUMENT TYPE:
${documentType}

FIELDS TO EXTRACT:
${fields.map((field) => `- ${field}`).join("\n")}

IMPORTANT RULES:

1. Extract information ONLY from the document.
2. Never guess or invent information.
3. If a field is not present, return null.
4. Preserve the original meaning of the extracted information.
5. Dates should be returned in YYYY-MM-DD format whenever possible.
6. Do not add fields that were not requested.
7. Do not provide explanations.
8. Return only the structured JSON object.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",

      contents: [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: pdfData,
          },
        },
        {
          text: prompt,
        },
      ],

      config: {
        temperature: 0,

        responseMimeType: "application/json",

        responseSchema: {
          type: Type.OBJECT,
          properties,
          required: fields,
        },
      },
    });

    /*
     * Gemini returns JSON as text.
     */
    const extractedData = JSON.parse(response.text);

    return {
      success: true,
      documentType,
      data: extractedData,
    };
  } catch (error) {
    console.error(
      "Gemini document extraction error:",
      error
    );

    throw new Error(
      error.message || "Failed to extract document data"
    );
  }
};

module.exports = {
  extractDocumentData,
};