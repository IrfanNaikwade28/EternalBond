const express = require("express");
const router = express.Router();
const healthController = require("../controllers/healthController");

//router.get("/get-by-user/:UID", healthController.getHealthByUserId);//for user update

router.get("/", healthController.getAllHealth);          // Get all
router.get("/:UID", healthController.getHealthById);     // Get by UID
router.post("/", healthController.insertHealth);         // Insert (prevent duplicate)
router.put("/:UID", healthController.updateHealth);      // Update
router.delete("/:UID", healthController.deleteHealth);   // Delete

module.exports = router;
