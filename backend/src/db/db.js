const mongoose = require("mongoose")

async function connectdb(){
        await mongoose.connect(process.env.MONGO_URI)
    
        console.log("Connected to the database successfully")
}

module.exports = connectdb