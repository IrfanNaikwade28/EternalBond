const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filterController');

router.get('/income', filterController.getIncome);
router.get('/education', filterController.getEducation);
router.get('/height', filterController.getHeight);
router.get('/caste', filterController.getCaste);
router.get('/subcast', filterController.getSubcast);
router.get('/marriage', filterController.getMarriageType);
router.get('/country', filterController.getCountry);

// 👉 NEW API
router.post("/profiles", filterController.getFilteredProfiles);

module.exports = router;
