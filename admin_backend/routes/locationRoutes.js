const express = require("express");
const router = express.Router();

const {
  getCountries,
  getStatesByCountry,
  getDistrictsByState
} = require("../controllers/locationController");

// ✅ Fetch all countries
router.get("/countries", getCountries);

// ✅ Fetch states by country ID
router.get("/states/:cnid", getStatesByCountry);

// ✅ Fetch districts by state ID
router.get("/districts/:stid", getDistrictsByState);

module.exports = router;
