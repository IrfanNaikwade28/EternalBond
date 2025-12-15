const db = require("../db");

// =================== GET ALL TESTIMONIALS ===================
exports.getTestimonials = (req, res) => {
  const q = `SELECT TSID, Name, Testimonial, simg, status FROM mst_testimonial WHERE status = 1 ORDER BY TSID DESC`;

  db.query(q, (err, result) => {
    if (err) {
      console.log("Testimonial Fetch Error:", err);
      return res.status(500).json({ success: false, message: "DB Error" });
    }

    return res.json({
      success: true,
      testimonials: result,
    });
  });
};
