require("dotenv").config();

const connectdb = require("./src/db/db");
const app = require("./src/app");

const PORT = process.env.PORT || 3000;


// =====================================================
// Start Server
// =====================================================
// Pehle MongoDB connect hoga.
// MongoDB successfully connect hone ke baad hi
// Express server start hoga.
// =====================================================

const startServer = async () => {

    try {

        // -------------------------------------------------
        // MongoDB connection
        // -------------------------------------------------

        await connectdb();

        console.log(
            "MongoDB connection ready"
        );


        // -------------------------------------------------
        // Start Express server
        // -------------------------------------------------

        app.listen(PORT, () => {

            console.log(PORT);

            console.log(
                "VendorVault Server Started..."
            );
        });

    } catch (error) {

        console.error(
            "Server startup failed:",
            error.message
        );

        process.exit(1);
    }
};


startServer();