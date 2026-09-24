const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// ==========================================
// ROUTES
// ==========================================

const authRoutes = require("./routes/authRoute");

const adminUserRoutes = require("./routes/adminUserRoute");

const documentRoute = require("./routes/documentTypeRoute");

const serviceRoute = require("./routes/serviceTypeRoute");

const documentRoutes = require("./routes/documentRoute");

const vendorAuthRoutes = require("./routes/vendorAuthRoutes");

const adminDashboardRoute = require("./routes/adminDashboardRoute");

const complianceRoute = require("./routes/complianceRoute");

const complianceDashboardRoute = require("./routes/complianceDashboardRoute");

const notificationRoutes = require("./routes/notificationRoute");

const complianceTeamRoute = require("./routes/complianceTeamRoute");

const adminReportRoute = require("./routes/adminReportRoute");

const auditLogRoute = require("./routes/auditLogRoute");

const emailDeliveryRoute = require("./routes/emailDeliveryRoute.js");

const failedReminderRoute = require("./routes/failedReminderRoute");

const userNotificationRoutes = require("./routes/userNotificationRoute.js");


// ==========================================
// APP
// ==========================================

const app = express();


// ==========================================
// TRUST PROXY
// Required for Render
// ==========================================

app.set("trust proxy", 1);


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);


// ==========================================
// CORS
// ==========================================
//
// Local development:
// http://localhost:5173
//
// Production:
// FRONTEND_URL environment variable
//
// ==========================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow requests without Origin
      // such as health checks/server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(
        `CORS blocked origin: ${origin}`
      );

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


// ==========================================
// COOKIE PARSER
// ==========================================

app.use(cookieParser());


// ==========================================
// REQUEST LOGGER
// ==========================================

app.use((req, res, next) => {

  console.log(
    `${new Date().toISOString()} ${req.method} ${req.originalUrl}`
  );

  next();
});


// ==========================================
// HEALTH CHECK
// ==========================================
// Render will use this endpoint.
// ==========================================

app.get("/health", (req, res) => {

  return res.status(200).json({
    success: true,
    message: "VendorVault backend is healthy",
    environment:
      process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});


// ==========================================
// ROOT
// ==========================================

app.get("/", (req, res) => {

  return res.status(200).json({
    success: true,
    message: "VendorVault API is running",
  });
});


// ==========================================
// ROUTES
// ==========================================


// ------------------------------------------
// EMAIL DELIVERY
// ------------------------------------------

app.use(
  "/api/email-delivery",
  emailDeliveryRoute
);


// ------------------------------------------
// AUTHENTICATION
// ------------------------------------------

app.use(
  "/api/auth",
  authRoutes
);


// ------------------------------------------
// VENDOR AUTHENTICATION
// ------------------------------------------

app.use(
  "/api/vendor",
  vendorAuthRoutes
);


// ------------------------------------------
// ADMIN USERS
// ------------------------------------------

app.use(
  "/api/admin/users",
  adminUserRoutes
);


// ------------------------------------------
// COMPLIANCE
// ------------------------------------------

app.use(
  "/api/compliance",
  complianceRoute
);


// ------------------------------------------
// DOCUMENT TYPES
// ------------------------------------------

app.use(
  "/api/document-types",
  documentRoute
);


// ------------------------------------------
// SERVICE TYPES
// ------------------------------------------

app.use(
  "/api/service-types",
  serviceRoute
);


// ------------------------------------------
// DOCUMENTS
// ------------------------------------------

app.use(
  "/api/documents",
  documentRoutes
);


// ------------------------------------------
// ADMIN DASHBOARD
// ------------------------------------------

app.use(
  "/api/admin/dashboard",
  adminDashboardRoute
);


// ------------------------------------------
// COMPLIANCE DASHBOARD
// ------------------------------------------

app.use(
  "/api/compliance-dashboard",
  complianceDashboardRoute
);


// ------------------------------------------
// COMPLIANCE TEAM
// ------------------------------------------

app.use(
  "/api/admin/compliance-team",
  complianceTeamRoute
);


// ------------------------------------------
// ADMIN REPORTS
// ------------------------------------------

app.use(
  "/api/admin/reports",
  adminReportRoute
);


// ------------------------------------------
// ADMIN ACTIVITY LOGS
// ------------------------------------------

app.use(
  "/api/admin/activity-logs",
  auditLogRoute
);


// ------------------------------------------
// NOTIFICATIONS
// ------------------------------------------

app.use(
  "/api/notifications",
  notificationRoutes
);


// ------------------------------------------
// USER NOTIFICATIONS
// ------------------------------------------

app.use(
  "/api/user-notifications",
  userNotificationRoutes
);


// ------------------------------------------
// FAILED REMINDERS
// ------------------------------------------

app.use(
  "/api/admin/failed-reminders",
  failedReminderRoute
);


// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {

  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((error, req, res, next) => {

  console.error(
    "Global error:",
    error
  );

  // --------------------------------------
  // CORS ERROR
  // --------------------------------------

  if (
    error.message ===
    "Not allowed by CORS"
  ) {
    return res.status(403).json({
      success: false,
      message:
        "CORS policy blocked this request.",
    });
  }


  // --------------------------------------
  // MULTER ERROR
  // --------------------------------------

  if (
    error.name === "MulterError"
  ) {
    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "File upload error.",
    });
  }


  // --------------------------------------
  // GENERAL ERROR
  // --------------------------------------

  return res.status(
    error.statusCode || 500
  ).json({
    success: false,
    message:
      error.message ||
      "Internal server error.",
  });
});


// ==========================================
// EXPORT
// ==========================================

module.exports = app;