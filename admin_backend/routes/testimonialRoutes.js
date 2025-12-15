const express = require("express");
const router = express.Router();
const testimonialController = require("../controllers/testimonialController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// -------------------- Multer Config --------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./uploads/testimonial";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// -------------------- Routes --------------------

// Add Testimonial
router.post("/", upload.single("simg"), testimonialController.addTestimonial);

// Get All
router.get("/", testimonialController.getAllTestimonials);

// Get Single
router.get("/:id", testimonialController.getTestimonial);

// Update Testimonial
router.put("/:id", upload.single("simg"), testimonialController.updateTestimonial);

// Delete Testimonial
router.delete("/:id", testimonialController.deleteTestimonial);

module.exports = router;
