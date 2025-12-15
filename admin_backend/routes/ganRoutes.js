const express = require("express");
const router = express.Router();
const ganController = require("../controllers/ganController");

router.get("/cast", ganController.getCasts);
router.get("/", ganController.getGans);
router.post("/", ganController.addGan);
router.put("/:id", ganController.updateGan);
router.delete("/:id", ganController.deleteGan);

module.exports = router;
