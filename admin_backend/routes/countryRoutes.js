const express = require("express");
const router = express.Router();
const controller = require("../controllers/countryController");

router.post("/add", controller.addCountry);
router.put("/update", controller.updateCountry);
router.get("/list", controller.getCountries);
router.delete("/delete/:id", controller.deleteCountry);

module.exports = router;
