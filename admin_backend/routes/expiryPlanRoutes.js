const express = require("express");
const router = express.Router();
const { getExpiryPlanUsers, extendPlan } = require("../controllers/expiryPlanController");

// GET all users
router.get("/", getExpiryPlanUsers);

// EXTEND user plan
router.put("/extend/:uid", extendPlan);

module.exports = router;
