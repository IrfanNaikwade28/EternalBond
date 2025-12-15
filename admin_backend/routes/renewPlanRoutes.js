const express = require("express");
const router = express.Router();
const { getRenewPlanUsers } = require("../controllers/renewPlanController");

// GET Renew Plan Users with pagination
router.get("/", getRenewPlanUsers);

module.exports = router;
