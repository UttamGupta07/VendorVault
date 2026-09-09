const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
    getComplianceTeam,
} = require("../controller/complianceTeamController");

const router = express.Router();

router.get(
    "/",
    protect,
    authorizeRoles("SUPER_ADMIN"),
    getComplianceTeam
);

module.exports = router;