const express = require("express");
const router = express.Router();
const biodataController = require("../controllers/biodataController");

// GET /api/biodata-users
router.get("/", biodataController.getUsers);

module.exports = router;
