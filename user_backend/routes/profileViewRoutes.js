const express = require("express");
const router = express.Router();
const { incrementViewCount , getUnlockedProfiles } = require("../controllers/profileViewController");

// POST /api/user/view
router.get("/", getUnlockedProfiles);
router.post("/", incrementViewCount);

module.exports = router;
