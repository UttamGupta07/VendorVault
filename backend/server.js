
const app = require("./src/app")
const connectdb = require("./src/db/db")
require("dotenv").config()
const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log("VendorVault Server Started...")
})