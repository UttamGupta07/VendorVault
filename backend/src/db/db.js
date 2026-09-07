const mongoose = require("mongoose");


// =====================================================
// MongoDB Connection
// =====================================================

async function connectdb() {

    const url = process.env.MONGO_URL;


    // MONGO_URL check

    if (!url) {

        throw new Error(
            "MONGO_URL variable is undefined. Check your dotenv configuration."
        );
    }


    // MongoDB se connect karo

    await mongoose.connect(url);


    console.log(
        "db connection successful"
    );
}


module.exports = connectdb;