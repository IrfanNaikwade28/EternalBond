const express = require("express");
const router = express.Router();
const smsController = require("../controllers/contactController");

// POST /api/sms/send
router.post("/send", smsController.sendSms);

module.exports = router;
