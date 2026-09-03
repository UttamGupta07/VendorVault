 require("dotenv").config();

const {
  extractDocumentData,
} = require("./services/geminiExtractionServices");

async function testGemini() {
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