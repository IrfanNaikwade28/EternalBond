const express = require("express");
const router = express.Router();
const heightController = require("../controllers/heightController");

router.get("/", heightController.getHeights);
router.post("/", heightController.addHeight);
router.put("/:id", heightController.updateHeight);
router.delete("/:id", heightController.deleteHeight);

// For dropdown list (no pagination)
router.get("/all", heightController.getAllHeights);

module.exports = router;
