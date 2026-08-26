
require("dotenv").config()
const app = require("./src/app")
const connectdb = require("./src/db/db")

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(PORT)
    console.log("VendorVault Server Started...")
})