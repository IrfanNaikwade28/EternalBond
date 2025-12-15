const express = require("express");
const router = express.Router();
const controller = require("../controllers/userDetailController");

router.get("/all", controller.getAllUsers);
//router.get("/:userId", controller.getUserDetails);
// Separate POST and PUT
router.get("/userdetails/search", controller.searchUsers);
// Get user details by UID
router.get("/:userId", controller.getUserDetailsByUID); // ✅ New route

router.post("/:userId", controller.createUserDetails); // ✅ Insert
router.put("/:userId", controller.updateUserDetails);  // ✅ Update
router.delete("/:userId", controller.deleteUserDetails);

module.exports = router;
