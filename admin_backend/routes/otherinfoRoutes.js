const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/otherinfoController");


router.get("/:UID", ctrl.getOneByUser);   // ⭐ New API (Get one record by UID) for user update


router.get("/", ctrl.getAllByUser);
router.post("/", ctrl.insertOtherInfo);
router.put("/:OID", ctrl.updateOtherInfo);
router.delete("/:OID", ctrl.deleteOtherInfo);

module.exports = router;
