 const {
  GoogleGenAI,
  createPartFromUri,
  createUserContent,
} = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const extractDocumentData = async (filePath) => {
  let uploadedFile = null;

  try {
    console.log("Uploading document to Gemini...");

    // Upload PDF to Gemini Files API
    uploadedFile = await ai.files.upload({
      file: filePath,
      config: {
        mimeType: "application/pdf",
      },
    });

    console.log("Gemini file uploaded:");
    console.log({
      name: uploadedFile.name,
      uri: uploadedFile.uri,
      mimeType: uploadedFile.mimeType,
    });

    const prompt = `
You are a document information extraction system for a vendor compliance platform.

Analyze the provided PDF document.

Extract the following information:

{
  "documentType": null,
  "documentNumber": null,
  "vendorName": null,
  "issueDate": null,
  "expiryDate": null,
  "address":"null",
  "clauses": []
}

Rules:

1. documentType:
   Identify the type of document.

2. documentNumber:
   Extract the main certificate, license, registration,
   agreement, or document number.
   If unavailable, return null.

3. vendorName:
   Extract the company/person/entity the document belongs to.
   If unavailable, return null.

4. issueDate:
   Extract the issue/start/effective date.
   Return YYYY-MM-DD.
   If unavailable, return null.
5. address:
    Extract the address of the vendor or entity mentioned in the document.
    Return the address as a single string. If unavailable, return null.


6. expiryDate:
   Extract the expiry/valid-until/end date.
   Return YYYY-MM-DD.
   If the document does not expire, return null.

7. clauses:
   Extract important compliance-related clauses,
   obligations, restrictions, conditions, or renewal requirements.
   Return an array of strings.
   If none exist, return [].

8. Do NOT guess or invent information.

9. If information is not present in the document, return null.

Return ONLY valid JSON.
`;

    console.log("Sending document to Gemini for extraction...");

    // IMPORTANT:
    // Convert the uploaded Gemini file into a valid Part
    const filePart = createPartFromUri(
      uploadedFile.uri,
      uploadedFile.mimeType
    );

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",

      contents: createUserContent([
        filePart,
        prompt,
      ]),

      config: {
        responseMimeType: "application/json",
      },
    });

    console.log("Gemini extraction completed.");

    const text = response.text;

    console.log("Gemini raw response:");
    console.log(text);

    let extractedData;

    try {
      extractedData = JSON.parse(text);
    } catch (error) {
      console.error("Invalid JSON returned by Gemini:");
      console.error(text);

      throw new Error("Gemini returned invalid JSON");
    }

    return extractedData;

  } catch (error) {
    console.error("Gemini document extraction error:");
    console.error(error);

    throw error;

  } finally {

    // Delete Gemini temporary file after extraction
    if (uploadedFile?.name) {
      try {
        await ai.files.delete({
          name: uploadedFile.name,
        });

        console.log("Gemini temporary file deleted.");
      } catch (deleteError) {
        console.error(
          "Failed to delete Gemini temporary file:",
          deleteError.message
        );
      }
    }
  }
};

module.exports = {
  extractDocumentData,
};