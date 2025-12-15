const express = require("express");
const router = express.Router();
const {
  getAllRashi,
  addRashi,
  updateRashi,
  deleteRashi,
  getAllRashiList, // ✅ make sure this is included
} = require("../controllers/rashiController");

// Routes
router.get("/", getAllRashi);
router.post("/", addRashi);
router.put("/:id", updateRashi);
router.delete("/:id", deleteRashi);
router.get("/all", getAllRashiList); // 👈 new route (no pagination)
module.exports = router;
