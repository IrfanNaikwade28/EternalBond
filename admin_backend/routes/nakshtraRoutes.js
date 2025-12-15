const express = require("express");
const router = express.Router();
const nakshtraController = require("../controllers/nakshtraController");

router.get("/cast", nakshtraController.getCasts);
router.get("/", nakshtraController.getNakshtras);
router.post("/", nakshtraController.addNakshtra);
router.put("/:id", nakshtraController.updateNakshtra);
router.delete("/:id", nakshtraController.deleteNakshtra);
// ✅ New route for "all Nakshtras"
router.get("/all", nakshtraController.getAllNakshtras);

module.exports = router;
