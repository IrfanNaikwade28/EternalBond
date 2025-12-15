const express = require("express");
const router = express.Router();
const nadiController = require("../controllers/nadiController");

// CRUD routes
router.get("/", nadiController.getNadis); // list + search
router.post("/", nadiController.addNadi); // add
router.put("/:id", nadiController.updateNadi); // update
router.delete("/:id", nadiController.deleteNadi); // delete

module.exports = router;
