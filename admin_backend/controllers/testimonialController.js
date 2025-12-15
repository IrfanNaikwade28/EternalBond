const db = require("../db");
const fs = require("fs");
const path = require("path");

// -------------------- Add Testimonial --------------------
exports.addTestimonial = (req, res) => {
  const { name, testimonial } = req.body;
  const simg = req.file ? req.file.filename : null;

  const q = `INSERT INTO mst_testimonial (Name, Testimonial, simg, status) VALUES (?, ?, ?, 1)`;
  db.query(q, [name, testimonial, simg], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Testimonial added successfully", TSID: result.insertId });
  });
};

// -------------------- Get All Testimonials --------------------
exports.getAllTestimonials = (req, res) => {
  const q = `SELECT * FROM mst_testimonial ORDER BY TSID DESC`;
  db.query(q, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// -------------------- Get Single Testimonial --------------------
exports.getTestimonial = (req, res) => {
  const q = `SELECT * FROM mst_testimonial WHERE TSID=?`;
  db.query(q, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

// -------------------- Update Testimonial --------------------
exports.updateTestimonial = (req, res) => {
  const { name, testimonial } = req.body;
  const newImg = req.file ? req.file.filename : null;

  if (newImg) {
    // Delete old image
    db.query("SELECT simg FROM mst_testimonial WHERE TSID=?", [req.params.id], (err, result) => {
      if (err) return res.status(500).json(err);

      const oldImg = result[0].simg;
      if (oldImg) {
        const oldPath = path.join(__dirname, "../uploads/testimonial", oldImg);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      // Update with new image
      const q = `UPDATE mst_testimonial SET Name=?, Testimonial=?, simg=? WHERE TSID=?`;
      db.query(q, [name, testimonial, newImg, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Testimonial updated successfully" });
      });
    });
  } else {
    // Update without image
    const q = `UPDATE mst_testimonial SET Name=?, Testimonial=? WHERE TSID=?`;
    db.query(q, [name, testimonial, req.params.id], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Testimonial updated successfully" });
    });
  }
};

// -------------------- Delete Testimonial --------------------
exports.deleteTestimonial = (req, res) => {
  // Delete image first
  db.query("SELECT simg FROM mst_testimonial WHERE TSID=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);

    const oldImg = result[0].simg;
    if (oldImg) {
      const oldPath = path.join(__dirname, "../uploads/testimonial", oldImg);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Delete DB record
    const q = `DELETE FROM mst_testimonial WHERE TSID=?`;
    db.query(q, [req.params.id], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Testimonial deleted successfully" });
    });
  });
};
