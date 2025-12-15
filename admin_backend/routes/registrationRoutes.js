const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/registerController");

// POST: Register a short user
router.post("/", registerUser);

module.exports = router;
