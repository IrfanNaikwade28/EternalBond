const express = require("express");
const router = express.Router();
const marriageController = require("../controllers/marriageController");

router.post("/add", marriageController.addMarriage);
router.get("/list", marriageController.getAllMarriage);
router.put("/update", marriageController.updateMarriage);
router.delete("/delete/:id", marriageController.deleteMarriage);
router.get("/all", marriageController.getAllMarriageTypes);
module.exports = router;
