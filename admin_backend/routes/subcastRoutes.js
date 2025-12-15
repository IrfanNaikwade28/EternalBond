const express = require("express");
const router = express.Router();
const controller = require("../controllers/subcastController");

// Add
router.post("/add", controller.addSubCast);

// Update
router.put("/update", controller.updateSubCast);

// List (search + pagination)
router.get("/list", controller.getSubCasts);

// Casts for dropdown
router.get("/casts", controller.getCasts);

// Delete
router.delete("/delete/:id", controller.deleteSubCast);

module.exports = router;
