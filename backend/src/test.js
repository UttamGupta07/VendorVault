 require("dotenv").config();

const {
  extractDocumentData,
} = require("./services/geminiExtractionServices");

async function testGemini() {
  require("dotenv").config();

console.log("Key exists:", !!process.env.GEMINI_API_KEY);
console.log(
  "Key prefix:",
  process.env.GEMINI_API_KEY?.substring(0, 10)
);
  try {
    const filePath =
      "C:\\Users\\Uttam Gupta\\project\\VendorVault\\backend\\src\\uploads\\temp\\1788399735514-29295377aadhar.pdf";

    const result = await extractDocumentData(filePath);

    console.log("\n========== EXTRACTED DATA ==========");
    console.log(JSON.stringify(result, null, 2));
    console.log("=====================================");
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

testGemini();