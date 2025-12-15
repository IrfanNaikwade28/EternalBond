const express = require("express");
const router = express.Router();
const educationController = require("../controllers/educationController");

// CRUD routes
router.get("/", educationController.getEducations);       // Get all with search & pagination
router.post("/", educationController.addEducation);       // Add
router.put("/:id", educationController.updateEducation);  // Update
router.delete("/:id", educationController.deleteEducation); // Delete
// 🟢 Public route for dropdown (frontend form)
router.get("/all", educationController.getAllEducations);

module.exports = router;
