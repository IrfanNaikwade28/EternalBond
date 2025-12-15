const express = require("express");
const router = express.Router();
const educationWorkController = require("../controllers/educationWorkController");
// GET single record by userId
router.get("/:userId", educationWorkController.getEducationWorkByUserId);
// GET all records
router.get("/", educationWorkController.getAllEducationWork);

// POST (insert/update for existing UID)
router.post("/:userId", educationWorkController.createEducationWork);

// PUT (update specific record by UID)
router.put("/:uid", educationWorkController.updateEducationWork); // ✅ correct param name

// DELETE (clear record)
router.delete("/:userId", educationWorkController.deleteEducationWork);

module.exports = router;
