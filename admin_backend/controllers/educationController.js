const db = require("../db");



// Get all educations with pagination & search
exports.getEducations = (req, res) => {
  const { page = 1, limit = 5, search = "" } = req.query;
  const offset = (page - 1) * limit;

  const countQuery = `SELECT COUNT(*) as total FROM mst_education WHERE Education LIKE ?`;
  const sql = `SELECT EDID, Education FROM mst_education WHERE Education LIKE ? ORDER BY EDID DESC LIMIT ? OFFSET ?`;

  db.query(countQuery, [`%${search}%`], (err, countResult) => {
    if (err) return res.status(500).json({ message: "Database error" });
    const total = countResult[0].total;

    db.query(sql, [`%${search}%`, parseInt(limit), parseInt(offset)], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });

      res.status(200).json({
        data: result,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    });
  });
};

// Add Education
exports.addEducation = (req, res) => {
  const { education } = req.body;
  if (!education) return res.status(400).json({ message: "Education is required" });

  // Prevent duplicate
  const checkSql = "SELECT * FROM mst_education WHERE Education=?";
  db.query(checkSql, [education], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length > 0) return res.status(400).json({ message: "Education already exists" });

    const sql = "INSERT INTO mst_education (Education) VALUES (?)";
    db.query(sql, [education], (err) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.status(200).json({ message: "Education added successfully" });
    });
  });
};

// Update Education
exports.updateEducation = (req, res) => {
  const { id } = req.params;
  const { education } = req.body;

  if (!education) return res.status(400).json({ message: "Education is required" });

  // Prevent duplicate except current
  const checkSql = "SELECT * FROM mst_education WHERE Education=? AND EDID<>?";
  db.query(checkSql, [education, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length > 0) return res.status(400).json({ message: "Education already exists" });

    const sql = "UPDATE mst_education SET Education=? WHERE EDID=?";
    db.query(sql, [education, id], (err) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.status(200).json({ message: "Education updated successfully" });
    });
  });
};

// Delete Education
exports.deleteEducation = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM mst_education WHERE EDID=?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json({ message: "Education deleted successfully" });
  });
};
// 🟢 Fetch all educations (for dropdowns)
exports.getAllEducations = (req, res) => {
  const sql = "SELECT EDID, Education FROM mst_education ORDER BY Education ASC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json(results);
  });
};
