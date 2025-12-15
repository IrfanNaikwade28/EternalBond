const express = require("express");
const router = express.Router();
const castController = require("../controllers/castController");

// GET /api/gotra/cast
router.get("/", castController.getAllCasts);

// Get sub-casts for a cast
router.get("/:castId/subcasts", castController.getSubCasts);
// CRUD Routes
//router.get("/", castController.getCasts);          // Get all Casts
router.post("/", castController.addCast);          // Add Cast
router.put("/:id", castController.updateCast);     // Update Cast
router.delete("/:id", castController.deleteCast);  // Delete Cast
module.exports = router;
