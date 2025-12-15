const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filterController');


// 👉 NEW API
router.post("/profiles", filterController.getFilteredProfiles);

module.exports = router;
