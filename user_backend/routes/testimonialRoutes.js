const express = require("express");
const router = express.Router();
const { getTestimonials } = require("../controllers/testimonialController");

// ===== ROUTES =====
router.get("/testimonials", getTestimonials);

module.exports = router;
