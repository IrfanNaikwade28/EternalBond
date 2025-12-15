const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");

router.get("/liked-profiles/:prid", likeController.getLikedProfiles);

router.get("/likes", likeController.getUserLikes);
router.post("/toggle-like", likeController.toggleLike);
module.exports = router;
