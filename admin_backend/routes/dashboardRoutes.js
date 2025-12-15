const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// GET /api/dashboard/users
router.get("/users", dashboardController.getUserStats);

// GET /api/dashboard/success-stories
router.get("/success-stories", dashboardController.getSuccessStoryCount);

module.exports = router;
