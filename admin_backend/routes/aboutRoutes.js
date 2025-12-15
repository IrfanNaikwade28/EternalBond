const express = require("express");
const router = express.Router();
const aboutController = require("../controllers/aboutController");

// Cast Dropdown
router.get("/cast", aboutController.getAllCast);

// About CRUD
router.get("/all", aboutController.getAllAbout);
router.post("/add", aboutController.addAbout);
router.put("/:id", aboutController.updateAbout);
router.delete("/:id", aboutController.deleteAbout);

module.exports = router;
