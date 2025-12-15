// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const bioController = require("../controllers/bioController");

// GET user biodata by UID
router.get("/:uid", bioController.getUserByUID);

module.exports = router;
