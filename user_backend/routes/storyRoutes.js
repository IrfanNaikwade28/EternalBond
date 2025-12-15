// routes/storyRoutes.js
const express = require("express");
const router = express.Router();
const storyController = require("../controllers/storyController");

router.get("/", storyController.getStories);

module.exports = router;
