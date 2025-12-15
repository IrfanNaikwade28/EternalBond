// backend/routes/familyRoutes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/familyController");

// Create
//router.get("/users/:UID", userController.getUserById);//
router.post("/family", ctrl.createFamily);

// Read all
router.get("/families", ctrl.getAllFamilies);

// for admin side
//router.get("/family/uid/:UID", ctrl.getFamilyByUID);


//for user side
router.get("/family/:UID", ctrl.getFamilyByUID);
// Read by FID
router.get("/family/:FID", ctrl.getFamilyByFID);

// Update by FID
router.put("/family/:FID", ctrl.updateFamily);

// Delete by FID
router.delete("/family/:FID", ctrl.deleteFamily);

module.exports = router;
