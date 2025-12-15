const express = require("express");
const router = express.Router();
const { getActiveUsers,updateStatus  } = require("../controllers/activeUsersController");

router.get("/", getActiveUsers);
router.post("/update-status", updateStatus);
module.exports = router;
