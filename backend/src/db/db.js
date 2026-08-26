const mongoose = require("mongoose");

async function connectdb() {
    // Moving this inside ensures dotenv has loaded the environment variables first
    const url = process.env.MONGO_URL; 
    
    if (!url) {
        throw new Error("MONGO_URL variable is undefined. Check your dotenv configuration.");
    }

    await mongoose.connect(url);
}

// Call the function to connect
connectdb().then(() => {
    console.log("db connection successful");
}).catch((err) => {
    console.log("db connection failed !");
    console.log(err);
});

module.exports = connectdb;
