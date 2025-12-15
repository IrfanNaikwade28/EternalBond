const express = require("express");
const router = express.Router();
const { getProfileViews,getProfileViewers } = require("../controllers/profileViewController");

router.get("/", getProfileViews);
router.get("/viewers/:profileId", getProfileViewers); // viewers of a profile

module.exports = router;
