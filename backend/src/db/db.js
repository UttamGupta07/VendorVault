const mongoose = require("mongoose")

const url=process.env.MONGO_URI || "mongodb://localhost:27017/vendro_vault";
async function connectdb(){
        await mongoose.connect(url);
}
connectdb().then(()=>{
        console.log("db connection successfull");
        
}).catch((err)=>{
        console.log("failed to connect with database !");
        
})

module.exports = connectdb