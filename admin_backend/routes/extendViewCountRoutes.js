const express = require("express");
const { getUsers,addProfileCount } = require("../controllers/extendViewCountController");
const router = express.Router();

// GET users with pagination
router.get("/", getUsers);
router.put("/add/:uid", addProfileCount);
module.exports = router;
