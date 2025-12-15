const express = require("express");
const router = express.Router();
const { getDeactiveUsers,updateStatus  } = require("../controllers/deactiveUsersController");

router.get("/", getDeactiveUsers);
router.post("/update-status", updateStatus);
module.exports = router;
