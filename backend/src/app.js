 const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoute");
const adminUserRoutes=require("./routes/adminUserRoute")
const rolePermissionRoutes = require("./routes/rolePermissionRoute");
const documentRoute =require("./routes/documentTypeRoute");
const serviceRoute=require("./routes/serviceTypeRoute");
const documentRoutes=require("./routes/documentRoute");
const vendorAuthRoutes=require("./routes/vendorAuthRoutes");
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
app.use("/api/vendor/auth", vendorAuthRoutes);
app.use("/api/admin/users",adminUserRoutes);
app.use(
  "/api/admin/roles",
  rolePermissionRoutes
);
app.use("/api/document-types",documentRoute)
app.use("/api/service-types",serviceRoute); 
app.use("/api/documents",documentRoutes)
// ==========================================
// EXPORT
// ==========================================

module.exports = app;