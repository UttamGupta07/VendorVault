 require("dotenv").config();

const connectdb = require("./src/db/db");
const app = require("./src/app");

const PORT = process.env.PORT || 5000;

// =====================================================
// Start Server
// =====================================================

const startServer = async () => {
    try {

        // -------------------------------------------------
        // Connect MongoDB
        // -------------------------------------------------

        await connectdb();

        console.log("MongoDB connection ready");

        // -------------------------------------------------
        // Start Express Server
        // -------------------------------------------------

        app.listen(PORT, "0.0.0.0", () => {

            console.log(
                `VendorVault Server Started on port ${PORT}`
            );

        });

    } catch (error) {

        console.error(
            "Server startup failed:",
            error
        );

        process.exit(1);
    }
};

startServer();