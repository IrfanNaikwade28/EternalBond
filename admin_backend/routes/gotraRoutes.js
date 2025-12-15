const express = require("express");
const router = express.Router();
const gotraController = require("../controllers/gotraController");

// Get all casts
router.get("/cast", gotraController.getCasts);

// Get gotras with search & pagination
router.get("/", gotraController.getGotras);

// Add a new gotra
router.post("/", gotraController.addGotra);

// Update a gotra
router.put("/:id", gotraController.updateGotra);

// Delete a gotra
router.delete("/:id", gotraController.deleteGotra);

module.exports = router;
