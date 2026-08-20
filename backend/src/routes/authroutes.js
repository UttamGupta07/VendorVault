const express = require("express");

const {registerOrganization} = require("../controller/orgcontroller");

// const {
//   createComplianceOfficer,
//   createAuditor,
// } = require("../controllers/user.controller");

// const {
//   createVendor,
// } = require("../controllers/vendor.controller");


const router = express.Router();
router.post(
  "/register-organization",
  registerOrganization
);

// router.post(
//   "/login",
//   login
// );


// // PROTECTED
// router.post(
//   "/users/compliance-officer",
//   authMiddleware,
//   createComplianceOfficer
// );

// router.post(
//   "/users/auditor",
//   authMiddleware,
//   createAuditor
// );

// router.post(
//   "/vendors",
//   authMiddleware,
//   createVendor
// );

module.exports = router;