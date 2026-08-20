const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'
}));

const authRoutes = require("./routes/authroutes");

app.use("/api/auth", authRoutes);


module.exports  = app;