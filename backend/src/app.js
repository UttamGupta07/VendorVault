 const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoute");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

// ==========================================
// EXPORT
// ==========================================

module.exports = app;