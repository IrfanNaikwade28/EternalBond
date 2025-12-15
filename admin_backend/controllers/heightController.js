const db = require("../db");
// ✅ Get all active heights (for dropdown)
exports.getAllHeights = (req, res) => {
  const sql = "SELECT HEID, Height FROM mst_height WHERE status = 1 ORDER BY Height ASC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
};
// Get heights with pagination & search
exports.getHeights = (req, res) => {
  const { page = 1, limit = 5, search = "" } = req.query;
  const offset = (page - 1) * limit;

  const countQuery = `SELECT COUNT(*) as total FROM mst_height WHERE Height LIKE ?`;
  const sql = `SELECT * FROM mst_height WHERE Height LIKE ? ORDER BY HEID DESC LIMIT ? OFFSET ?`;

  db.query(countQuery, [`%${search}%`], (err, countResult) => {
    if (err) return res.status(500).json({ message: "Database error" });

    const total = countResult[0].total;

    db.query(sql, [`%${search}%`, parseInt(limit), parseInt(offset)], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });

      res.status(200).json({
        data: result,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    });
  });
};

// Add height
exports.addHeight = (req, res) => {
  const { height } = req.body;
  if (!height) return res.status(400).json({ message: "Height is required" });

  // Check duplicate
  const checkSql = "SELECT * FROM mst_height WHERE Height=?";
  db.query(checkSql, [height], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length > 0) return res.status(409).json({ message: "Height already exists" });

    const sql = "INSERT INTO mst_height (Height, status) VALUES (?, 1)";
    db.query(sql, [height], (err) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.status(200).json({ message: "Height added successfully" });
    });
  });
};

// Update height
exports.updateHeight = (req, res) => {
  const { id } = req.params;
  const { height } = req.body;
  if (!height) return res.status(400).json({ message: "Height is required" });

  // Check duplicate excluding current id
  const checkSql = "SELECT * FROM mst_height WHERE Height=? AND HEID<>?";
  db.query(checkSql, [height, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length > 0) return res.status(409).json({ message: "Height already exists" });

    const sql = "UPDATE mst_height SET Height=? WHERE HEID=?";
    db.query(sql, [height, id], (err) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.status(200).json({ message: "Height updated successfully" });
    });
  });
};

// Delete height
exports.deleteHeight = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM mst_height WHERE HEID=?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json({ message: "Height deleted successfully" });
  });
};
